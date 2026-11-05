/** Placeholder partner slots — no real sponsorships are implied. */
export type PartnerPlaceholder = { id: string; label: string; tier: "Title" | "Technical" | "Official"; shape: "hex" | "bolt" | "ring" | "chevron" | "grid" | "wave" };

export const PARTNERS: PartnerPlaceholder[] = [
  { id: "p1", label: "Title Partner", tier: "Title", shape: "chevron" },
  { id: "p2", label: "Energy Partner", tier: "Technical", shape: "bolt" },
  { id: "p3", label: "Tyre Partner", tier: "Technical", shape: "ring" },
  { id: "p4", label: "Data Partner", tier: "Technical", shape: "grid" },
  { id: "p5", label: "Timing Partner", tier: "Official", shape: "hex" },
  { id: "p6", label: "Apparel Partner", tier: "Official", shape: "wave" },
];
