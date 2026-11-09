"use client";

import { useState, useEffect } from "react";
import { 
  Users, UserPlus, Plus, Search, CheckCircle2, Clock, AlertCircle, X, 
  Share2, Eye, Building2, Phone, Mail, DollarSign, Calendar, Copy, Check, 
  MessageCircle, ExternalLink, Trash2, Sparkles, ArrowUpRight
} from "lucide-react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";

export default function AdminReferralsView() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPartnerCandidates, setSelectedPartnerCandidates] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // Form states
  const [partnerName, setPartnerName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [commissionRate, setCommissionRate] = useState(20);
  const [notes, setNotes] = useState("");

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/referrals");
      const data = await res.json();
      if (data.partners) {
        setPartners(data.partners);
      }
    } catch (err) {
      console.error("Failed to load referral partners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim()) {
      alert("Please provide the Partner / Vendor Name.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_name: partnerName.trim(),
          contact_person: contactPerson.trim(),
          email: email.trim(),
          phone: phone.trim(),
          referral_code: customCode.trim(),
          commission_rate: commissionRate,
          notes: notes.trim(),
        }),
      });

      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || "Failed to create partner");

      setToastNotice(`Partner "${partnerName}" registered successfully with code: ${result.partner.referral_code}`);
      setShowAddModal(false);
      resetForm();
      fetchPartners();
    } catch (err: any) {
      alert(err.message || "Failed to add partner.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePartner = async (partner: any) => {
    if (!confirm(`Are you sure you want to remove partner "${partner.partner_name}"?`)) return;

    try {
      const res = await fetch(`/api/referrals?id=${encodeURIComponent(partner.id)}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok || result.error) throw new Error(result.error || "Failed to delete");

      setToastNotice(`Partner "${partner.partner_name}" removed.`);
      fetchPartners();
    } catch (err: any) {
      alert(err.message || "Could not delete partner.");
    }
  };

  const resetForm = () => {
    setPartnerName("");
    setContactPerson("");
    setEmail("");
    setPhone("");
    setCustomCode("");
    setCommissionRate(20);
    setNotes("");
  };

  const getPartnerUrl = (code: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://resourcemania.in";
    return `${origin}/student/login?ref=${encodeURIComponent(code)}`;
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const copyLink = (code: string) => {
    navigator.clipboard.writeText(getPartnerUrl(code));
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Totals
  const totalReferredCandidates = partners.reduce((acc, p) => acc + (p.total_signups || 0), 0);
  const totalHiredReferrals = partners.reduce((acc, p) => acc + (p.hired_count || 0), 0);
  const totalCommissionEarned = partners.reduce((acc, p) => acc + (p.total_commission_earned || 0), 0);

  const filteredPartners = partners.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.partner_name && p.partner_name.toLowerCase().includes(q)) ||
      (p.contact_person && p.contact_person.toLowerCase().includes(q)) ||
      (p.referral_code && p.referral_code.toLowerCase().includes(q)) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.phone && p.phone.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastNotice && (
        <div className="p-4 bg-[var(--success-bg)] border border-[var(--success)]/20 text-[var(--success)] rounded-xl flex items-center justify-between text-xs font-semibold shadow-soft animate-in fade-in">
          <span>{toastNotice}</span>
          <button onClick={() => setToastNotice(null)} className="cursor-pointer hover:opacity-75">
            <X size={16} />
          </button>
        </div>
      )}

      {/* ── 1. HEADER ── */}
      <header className="flex justify-between items-start mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)] tracking-tight">
            Vendor & Partner Referral Management
          </h1>
          <p className="text-[var(--muted-foreground)] mt-1 text-sm">
            Create partner referral codes, track attributed candidate onboarding, and manage their 20% commission share on successful hires.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add New Partner</span>
        </Button>
      </header>

      {/* ── 2. METRIC STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3 bg-white border border-[var(--border)] shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[var(--surface)] text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--border)]">
            <Building2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Active Partners</span>
            <div className="text-xl font-black text-[var(--foreground)]">{partners.length}</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 bg-white border border-[var(--border)] shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Referred Signups</span>
            <div className="text-xl font-black text-[var(--foreground)]">{totalReferredCandidates}</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 bg-white border border-[var(--border)] shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Placed / Hired</span>
            <div className="text-xl font-black text-emerald-700">{totalHiredReferrals}</div>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3 bg-white border border-[var(--border)] shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--primary)]/20">
            <DollarSign size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)]">Commission Generated</span>
            <div className="text-xl font-black text-[var(--foreground)]">₹{totalCommissionEarned.toLocaleString('en-IN')}</div>
          </div>
        </Card>
      </div>

      {/* ── 3. SEARCH & FILTERS BAR ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-[var(--border)] shadow-soft">
        <div className="text-xs font-bold text-[var(--foreground)]">
          Registered Vendors / Institutes ({partners.length})
        </div>
        <div className="relative sm:w-72">
          <Search size={14} className="absolute left-3 top-2.5 text-[var(--muted-foreground)]" />
          <input
            type="text"
            placeholder="Search partner, code, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
      </div>

      {/* ── 4. PARTNERS LISTING ── */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-xl border border-[var(--border)] shadow-soft">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--primary)] border-t-transparent mb-3" />
          <p className="text-xs font-semibold text-[var(--muted-foreground)]">Loading referral partners...</p>
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-[var(--border)] shadow-soft">
          <Building2 size={36} className="mx-auto text-[var(--muted-foreground)] mb-2" />
          <h4 className="text-sm font-bold text-[var(--foreground)]">No Referral Partners Found</h4>
          <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm mx-auto">
            Click "+ Add New Partner" to register coaching institutes, training centers, or consultants with custom referral codes.
          </p>
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="mt-4 text-xs mx-auto">
            <Plus size={16} /> Add First Partner
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPartners.map((partner) => {
            const partnerUrl = getPartnerUrl(partner.referral_code);

            return (
              <Card key={partner.id} className="p-5 border-[var(--border)] bg-white hover:shadow-card transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Partner Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-black uppercase px-2.5 py-1 rounded-md bg-[var(--accent)] text-[var(--primary)] border border-[var(--primary)]/20">
                        {partner.referral_code}
                      </span>
                      <button
                        onClick={() => copyCode(partner.referral_code)}
                        className="cursor-pointer text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] flex items-center gap-1 font-medium"
                        title="Copy Code"
                      >
                        {copiedCode === partner.referral_code ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
                        <span>{copiedCode === partner.referral_code ? "Copied" : "Copy Code"}</span>
                      </button>

                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {partner.commission_rate || 20}% Net Commission
                      </span>

                      <span className="text-[11px] text-[var(--muted-foreground)]">
                        Added: {partner.created_at ? new Date(partner.created_at).toLocaleDateString() : "Recent"}
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="text-base font-bold text-[var(--foreground)]">{partner.partner_name}</h4>
                      {partner.contact_person && (
                        <span className="text-xs text-[var(--muted-foreground)] font-semibold">
                          (Attn: {partner.contact_person})
                        </span>
                      )}
                    </div>

                    {/* Contact Details */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--ink-soft)]">
                      {partner.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-[var(--primary)]" /> {partner.email}
                        </span>
                      )}
                      {partner.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} className="text-[var(--primary)]" /> {partner.phone}
                        </span>
                      )}
                      {partner.notes && (
                        <span className="text-[var(--muted-foreground)] italic">
                          &ldquo;{partner.notes}&rdquo;
                        </span>
                      )}
                    </div>

                    {/* Attribution Metrics Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                      <div className="px-2.5 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-md font-semibold text-[var(--foreground)]">
                        👥 Signed Up: <strong className="text-[var(--primary)]">{partner.total_signups || 0}</strong>
                      </div>
                      <div className="px-2.5 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-md font-semibold text-[var(--foreground)]">
                        🎯 Assessed: <strong className="text-[var(--foreground)]">{partner.assessed_count || 0}</strong>
                      </div>
                      <div className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md font-semibold text-emerald-800">
                        💼 Hired: <strong>{partner.hired_count || 0}</strong>
                      </div>
                      <div className="px-2.5 py-1 bg-[var(--accent)] border border-[var(--primary)]/20 rounded-md font-bold text-[var(--primary)]">
                        💰 Commission: ₹{(partner.total_commission_earned || 0).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap border-t lg:border-t-0 pt-3 lg:pt-0">
                    {/* View Candidates */}
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedPartnerCandidates(partner)}
                      className="py-1.5 px-3 text-xs"
                    >
                      <Eye size={14} /> Candidates ({partner.total_signups || 0})
                    </Button>

                    {/* Copy Link */}
                    <Button
                      variant="secondary"
                      onClick={() => copyLink(partner.referral_code)}
                      className="py-1.5 px-3 text-xs text-[var(--primary)] border-[var(--primary)]/30 bg-[var(--accent)]"
                    >
                      {copiedLink === partner.referral_code ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{copiedLink === partner.referral_code ? "Link Copied!" : "Copy Link"}</span>
                    </Button>

                    {/* WhatsApp Partner Share */}
                    <a
                      href={`https://wa.me/${partner.phone ? partner.phone.replace(/[^0-9]/g, '') : ''}?text=${encodeURIComponent(
                        `Hello ${partner.contact_person || partner.partner_name},\nHere is your official Resourcemania candidate onboarding link:\n${partnerUrl}\n\nRefer candidates to earn ${partner.commission_rate || 20}% commission on every successful hire!`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-soft transition-colors"
                    >
                      <MessageCircle size={14} /> WhatsApp Link
                    </a>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDeletePartner(partner)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Partner"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── 5. MODAL: ADD NEW PARTNER ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-modal border border-[var(--border)] overflow-hidden animate-in fade-in">
            {/* Header */}
            <div className="px-6 py-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Register Vendor / Institute Partner</h3>
                <p className="text-xs text-[var(--muted-foreground)]">Generate a unique referral code & onboarding link</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreatePartner} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--foreground)] uppercase tracking-wider mb-1">
                  Partner / Organization Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Navkar Institute, FinPro Academy, Sharma Consultancies"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--foreground)] uppercase tracking-wider mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ramesh Kumar"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--foreground)] uppercase tracking-wider mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--foreground)] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. partner@institute.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--foreground)] uppercase tracking-wider mb-1">
                    Custom Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs font-mono text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[var(--foreground)] uppercase tracking-wider mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--foreground)] uppercase tracking-wider mb-1">
                  Notes / Internal Remarks
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Agreement signed on Nov 2026, payout on monthly basis"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] font-medium"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-[var(--border)]">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddModal(false)}
                  className="py-1.5 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="py-1.5 text-xs"
                >
                  {isSubmitting ? "Creating..." : "Save Partner"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 6. MODAL: VIEW ATTRIBUTED CANDIDATES ── */}
      {selectedPartnerCandidates && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-modal border border-[var(--border)] overflow-hidden animate-in fade-in">
            <div className="px-6 py-5 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase bg-[var(--accent)] text-[var(--primary)] px-2 py-0.5 rounded border border-[var(--primary)]/20">
                  {selectedPartnerCandidates.referral_code}
                </span>
                <h3 className="text-base font-bold mt-1 text-[var(--foreground)]">
                  Candidates from {selectedPartnerCandidates.partner_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPartnerCandidates(null)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-white hover:bg-[var(--surface)] flex items-center justify-center text-[var(--foreground)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-[60vh] overflow-y-auto text-xs space-y-2">
              {(!selectedPartnerCandidates.candidates || selectedPartnerCandidates.candidates.length === 0) ? (
                <div className="p-8 text-center text-[var(--muted-foreground)]">
                  No candidates have registered with this referral code yet.
                </div>
              ) : (
                selectedPartnerCandidates.candidates.map((cand: any) => (
                  <div key={cand.id} className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[var(--foreground)]">{cand.name}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">{cand.email} • {cand.phone}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cand.hired_status === 'hired'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {cand.hired_status === 'hired' ? '🎉 Placed & Hired' : 'Registered / Available'}
                      </span>
                      {cand.score !== null && (
                        <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Score: {cand.score}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="px-6 py-4 bg-[var(--surface)] border-t border-[var(--border)] flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setSelectedPartnerCandidates(null)}
                className="py-1.5 text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
