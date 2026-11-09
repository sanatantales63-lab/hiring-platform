import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const FALLBACK_DIR = path.join(process.cwd(), 'data');
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'referral_partners.json');

// Helper for local file fallback
function getLocalPartners(): any[] {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    if (!fs.existsSync(FALLBACK_FILE)) {
      const initial: any[] = [];
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local fallback partners:', err);
    return [];
  }
}

function saveLocalPartners(partners: any[]) {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) fs.mkdirSync(FALLBACK_DIR, { recursive: true });
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(partners, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving local fallback partners:', err);
  }
}

// GET: Fetch all partners with live candidate attribution & commission metrics
export async function GET(req: Request) {
  try {
    let partners: any[] = [];

    // 1. Try fetching from Supabase table
    const { data: dbPartners, error: dbErr } = await supabase
      .from('referral_partners')
      .select('*')
      .order('created_at', { ascending: false });

    if (!dbErr && dbPartners) {
      partners = dbPartners;
    } else {
      // Fallback to local storage if table not yet created in Supabase
      partners = getLocalPartners();
    }

    // 2. Fetch candidates from profiles to compute live metrics
    const { data: allProfiles } = await supabase.from('profiles').select('*');
    const profiles = allProfiles || [];

    // Standard assumed net platform fee per placement (₹25,000) for commission projection
    const STANDARD_PLACEMENT_FEE = 25000;

    const enrichedPartners = partners.map((partner) => {
      const code = (partner.referral_code || '').trim().toUpperCase();

      // Find candidates attributed to this code
      const referredCandidates = profiles.filter((p: any) => {
        const pCode = (p.referral_code || p.meta?.referral_code || '').trim().toUpperCase();
        return pCode === code && code.length > 0;
      });

      const totalSignups = referredCandidates.length;
      
      const assessedCandidates = referredCandidates.filter((p: any) => {
        const score = p.lastScore || p.score || p.meta?.lastTestScore;
        const attempts = p.meta?.testAttempts || 0;
        return score !== undefined || attempts > 0;
      });

      const hiredCandidates = referredCandidates.filter((p: any) => {
        return p.hired_status === 'hired';
      });

      const rate = Number(partner.commission_rate) || 20;
      const commissionPerHire = Math.round((STANDARD_PLACEMENT_FEE * rate) / 100);
      const totalEarnedCommission = hiredCandidates.length * commissionPerHire;

      return {
        ...partner,
        total_signups: totalSignups,
        assessed_count: assessedCandidates.length,
        hired_count: hiredCandidates.length,
        commission_per_hire: commissionPerHire,
        total_commission_earned: totalEarnedCommission,
        candidates: referredCandidates.map((c: any) => ({
          id: c.id,
          name: c.fullName || c.name || c.email?.split('@')[0] || 'Candidate',
          email: c.email,
          phone: c.phone || 'N/A',
          created_at: c.created_at,
          hired_status: c.hired_status || 'available',
          score: c.lastScore || c.score || c.meta?.lastTestScore || null,
        })),
      };
    });

    return NextResponse.json({ partners: enrichedPartners });
  } catch (error: any) {
    console.error('GET /api/referrals error:', error);
    return NextResponse.json({ error: error.message || 'Server error', partners: [] }, { status: 500 });
  }
}

// POST: Create a new referral partner
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { partner_name, contact_person, email, phone, referral_code, commission_rate, notes } = body;

    if (!partner_name || !partner_name.trim()) {
      return NextResponse.json({ error: 'Partner name is required.' }, { status: 400 });
    }

    // Auto-generate or clean referral code
    const cleanCode = (referral_code || `REF-${partner_name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`).trim().toUpperCase();

    const newPartner = {
      id: crypto.randomUUID(),
      partner_name: partner_name.trim(),
      contact_person: contact_person ? contact_person.trim() : '',
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      referral_code: cleanCode,
      commission_rate: commission_rate !== undefined ? Number(commission_rate) : 20,
      status: 'active',
      notes: notes ? notes.trim() : '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Try Supabase insert
    const { data: dbData, error: dbErr } = await supabase
      .from('referral_partners')
      .insert([newPartner])
      .select()
      .maybeSingle();

    if (dbErr) {
      console.warn('Supabase referral_partners insert failed, saving to local fallback:', dbErr.message);
      const local = getLocalPartners();
      local.unshift(newPartner);
      saveLocalPartners(local);
      return NextResponse.json({ success: true, partner: newPartner, storage: 'local_fallback' });
    }

    return NextResponse.json({ success: true, partner: dbData || newPartner, storage: 'supabase' });
  } catch (error: any) {
    console.error('POST /api/referrals error:', error);
    return NextResponse.json({ error: error.message || 'Server error creating partner' }, { status: 500 });
  }
}

// DELETE: Remove a referral partner
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required.' }, { status: 400 });
    }

    // Try Supabase delete
    await supabase.from('referral_partners').delete().eq('id', id);

    // Also remove from local fallback if present
    const local = getLocalPartners();
    const updated = local.filter((p: any) => p.id !== id);
    saveLocalPartners(updated);

    return NextResponse.json({ success: true, message: 'Partner removed.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
