import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Generate readable unique job id e.g. RM-JOB-74829
function generateUniqueJobId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `RM-JOB-${year}-${randomNum}`;
}

// GET: Fetch jobs with filters
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('company_id');
    const status = searchParams.get('status'); // 'all' | 'active' | 'pending_approval' | 'closed'
    const jobId = searchParams.get('job_id');

    let query = supabase.from('jobs').select('*').order('created_at', { ascending: false });

    if (jobId) {
      query = query.eq('job_id', jobId);
      const { data, error } = await query.maybeSingle();
      if (error) throw error;
      return NextResponse.json({ job: data });
    }

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        // Match either status='active' or is_active=true
        query = query.or('status.eq.active,is_active.eq.true');
      } else {
        query = query.eq('status', status);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching jobs:', error);
      return NextResponse.json({ jobs: [], error: error.message }, { status: 200 });
    }

    return NextResponse.json({ jobs: data || [] });
  } catch (error: any) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch jobs', jobs: [] }, { status: 500 });
  }
}

// POST: Create a new job posting by company
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      company_id,
      company_name,
      company_email,
      title,
      description,
      skills_required,
      other_skills,
      experience,
      location,
      job_type,
      salary_range,
    } = body;

    if (!title || !description || !company_id) {
      return NextResponse.json(
        { error: 'Title, description, and company ID are required.' },
        { status: 400 }
      );
    }

    const uniqueJobId = generateUniqueJobId();

    // Prepare payload
    const newJob = {
      job_id: uniqueJobId,
      company_id,
      company_name: company_name || 'Hiring Partner',
      company_email: company_email || '',
      title: title.trim(),
      description: description.trim(),
      skills_required: Array.isArray(skills_required) ? skills_required : [],
      other_skills: other_skills ? String(other_skills).trim() : '',
      experience: experience || 'Not Specified',
      location: location || 'Remote',
      job_type: job_type || 'Full-time',
      salary_range: salary_range || 'Competitive',
      status: 'pending_approval', // Under Review for Admin Control
      is_active: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 1. Insert into Supabase
    const { data, error } = await supabase
      .from('jobs')
      .insert([newJob])
      .select()
      .maybeSingle();

    if (error) {
      console.error('Supabase jobs insert error:', error);
      return NextResponse.json(
        { 
          error: error.message, 
          hint: 'Please ensure migration SQL is executed in Supabase SQL Editor if columns are missing.' 
        }, 
        { status: 500 }
      );
    }

    // 2. Trigger Brevo Email Notification for Admin & Company
    try {
      const origin = req.headers.get('origin') || 'https://resourcemania.in';
      fetch(`${origin}/api/send-admin-alert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'job_submitted',
          jobId: uniqueJobId,
          jobTitle: title,
          companyName: company_name || 'Hiring Partner',
          companyEmail: company_email,
          location: location || 'Remote',
          skills: skills_required,
          experience: experience,
          salaryRange: salary_range,
          description: description,
        }),
      }).catch((e) => console.error('Email trigger background error:', e));
    } catch (mailErr) {
      console.error('Failed to trigger job submit mail:', mailErr);
    }

    return NextResponse.json({
      success: true,
      job: data || newJob,
      job_id: uniqueJobId,
      message: 'Job submitted successfully and is awaiting admin approval.',
    });
  } catch (error: any) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json({ error: error.message || 'Server error creating job' }, { status: 500 });
  }
}

// PATCH: Admin updates status (Approve & Publish, Reject, Close)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, job_id, status, title, description, skills_required, location, experience, salary_range } = body;

    if (!id && !job_id) {
      return NextResponse.json({ error: 'Job ID or primary ID is required.' }, { status: 400 });
    }

    // Fetch existing job to get company email and title
    let getQuery = supabase.from('jobs').select('*');
    if (id) getQuery = getQuery.eq('id', id);
    else if (job_id) getQuery = getQuery.eq('job_id', job_id);
    const { data: existingJob } = await getQuery.maybeSingle();

    const updatePayload: any = {
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
      updatePayload.is_active = status === 'active';
    }
    if (title) updatePayload.title = title;
    if (description) updatePayload.description = description;
    if (skills_required) updatePayload.skills_required = skills_required;
    if (location) updatePayload.location = location;
    if (experience) updatePayload.experience = experience;
    if (salary_range) updatePayload.salary_range = salary_range;

    let updateQuery = supabase.from('jobs').update(updatePayload);
    if (id) updateQuery = updateQuery.eq('id', id);
    else if (job_id) updateQuery = updateQuery.eq('job_id', job_id);

    const { data, error } = await updateQuery.select().maybeSingle();

    if (error) {
      console.error('PATCH /api/jobs error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If job was just approved & published, send email to company
    if (status === 'active' && existingJob) {
      try {
        const origin = req.headers.get('origin') || 'https://resourcemania.in';
        fetch(`${origin}/api/send-admin-alert`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'job_approved',
            jobId: existingJob.job_id || job_id,
            jobTitle: existingJob.title,
            companyName: existingJob.company_name,
            companyEmail: existingJob.company_email,
          }),
        }).catch((e) => console.error('Email trigger error on approve:', e));
      } catch (mailErr) {
        console.error('Mail trigger error:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      job: data,
      message: `Job status updated to ${status}.`,
    });
  } catch (error: any) {
    console.error('PATCH /api/jobs error:', error);
    return NextResponse.json({ error: error.message || 'Server error updating job' }, { status: 500 });
  }
}

// DELETE: Remove or archive a job
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const job_id = searchParams.get('job_id');

    if (!id && !job_id) {
      return NextResponse.json({ error: 'ID or job_id required' }, { status: 400 });
    }

    let deleteQuery = supabase.from('jobs').delete();
    if (id) deleteQuery = deleteQuery.eq('id', id);
    else if (job_id) deleteQuery = deleteQuery.eq('job_id', job_id);

    const { error } = await deleteQuery;
    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Job deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
