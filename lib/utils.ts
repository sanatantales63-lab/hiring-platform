// lib/utils.ts
// 🔥 CENTRALIZED CANDIDATE ID LOGIC — Ek jagah change = har jagah change

/**
 * Generates a human-readable unique candidate ID.
 *
 * Format: RM-[QUAL]-[INITIALS]-[SERIAL]
 * Examples:
 *   RM-CA-AS-001   (Ananya Singhania, CA Final, 1st registered)
 *   RM-MB-PS-002   (Priya Sharma, MBA, 2nd registered)
 *   RM-BC-AJ-25001 (Ankit Joshi, B.Com, 25001st registered)
 *
 * Parts:
 *  RM       → Fixed platform prefix (Resourcemania)
 *  CA/MB/CS → Highest qualification 2-letter code
 *  AS/PS/AJ → Candidate name initials (First + Last)
 *  001      → Serial number from DB (min 3 digits, grows as needed: 001 → 999 → 1000 → 25001)
 *
 * NOTE: serial_number comes from Supabase profiles table (added via migration).
 *       Fallback to UUID-derived digits if serial_number not yet available.
 */
export function generateCandidateId(candidate: {
  id?: string | null;
  fullName?: string | null;
  highestQualification?: string | null;
  serial_number?: number | null;
}): string {
  if (!candidate?.id) return "N/A";

  // ── 1. Qualification prefix ──────────────────────────────────────────────
  let qp = "GD";
  if (candidate.highestQualification) {
    const hq = candidate.highestQualification.toLowerCase();
    if (hq.includes("ca ") || hq.includes("ca-") || hq === "ca" || hq.includes("chartered accountant")) qp = "CA";
    else if (hq.includes("cma") || hq.includes("cost & management")) qp = "CM";
    else if (hq.includes("cs ") || hq.includes("cs-") || hq === "cs" || hq.includes("company secretary")) qp = "CS";
    else if (hq.includes("acca")) qp = "AC";
    else if (hq.includes("mba") || hq.includes("pgdm")) qp = "MB";
    else if (hq.includes("b.tech") || hq.includes("btech") || hq.includes("b.e.")) qp = "BT";
    else if (hq.includes("m.com") || hq.includes("mcom")) qp = "MC";
    else if (hq.includes("b.com") || hq.includes("bcom") || hq.includes("bba")) qp = "BC";
    else if (hq.includes("diploma") || hq.includes("polytechnic")) qp = "DP";
    else if (hq.includes("high school") || hq.includes("12th") || hq.includes("puc")) qp = "HS";
    else qp = "GD";
  }

  // ── 2. Name initials ─────────────────────────────────────────────────────
  const nameParts = (candidate.fullName || "").trim().split(/\s+/).filter(Boolean);
  const first = nameParts[0]?.[0]?.toUpperCase() || "X";
  const last =
    nameParts.length >= 2
      ? nameParts[nameParts.length - 1][0].toUpperCase()
      : "X";
  const initials = `${first}${last}`;

  // ── 3. Serial number — DB se aayega (minimum 3 digits, grows naturally) ──
  // serial_number = 1   → "001"
  // serial_number = 42  → "042"
  // serial_number = 999 → "999"
  // serial_number = 1000 → "1000"  (4 digits naturally, no padding needed)
  // serial_number = 25001 → "25001"
  let serial: string;
  if (candidate.serial_number != null && candidate.serial_number > 0) {
    // Real serial from DB — pad to minimum 3 digits
    serial = String(candidate.serial_number).padStart(3, "0");
  } else {
    // Fallback: UUID digits (until DB migration is done)
    const digits = candidate.id.replace(/[^0-9]/g, "");
    serial = digits.length >= 3
      ? digits.substring(0, 4)
      : digits.padEnd(3, "0");
  }

  return `RM-${qp}-${initials}-${serial}`;
}
