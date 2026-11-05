/** AVR-26 "Notturna" — every figure below is fictional sample/demo data. */

export type Livery = {
  id: string;
  name: string;
  meaning: string;
  description: string;
  usedAt: string;
  base: string;
  baseShade: string;
  stripe: string;
  accent: string;
  plate: string;
  numberColor: string;
  glow: string;
  number: string;
};

export const LIVERIES: Livery[] = [
  {
    id: "notturna",
    name: "Notturna",
    meaning: "Italian for “nocturnal”",
    description:
      "The primary race livery. Graphite bodywork with an electric-blue slash that stays visible under floodlights, plus an endurance-orange pinstripe on the leading edge.",
    usedAt: "Full-season livery · Car #18",
    base: "#1A1F26",
    baseShade: "#0B0D10",
    stripe: "#00A3FF",
    accent: "#FF6B00",
    plate: "#F5F7FA",
    numberColor: "#0B0D10",
    glow: "#00A3FF",
    number: "18",
  },
  {
    id: "alba",
    name: "Alba",
    meaning: "Italian for “dawn”",
    description:
      "The Le Mans special. Clean white bodywork and an orange sunrise slash, designed to stand out in the low morning light after the long night.",
    usedAt: "Le Mans special · Car #81",
    base: "#E9EDF2",
    baseShade: "#9AA4AF",
    stripe: "#FF6B00",
    accent: "#00A3FF",
    plate: "#0B0D10",
    numberColor: "#F5F7FA",
    glow: "#FFB070",
    number: "81",
  },
  {
    id: "tempesta",
    name: "Tempesta",
    meaning: "Italian for “storm”",
    description:
      "The test and development livery. Raw carbon black with orange accents, used for private testing and the pre-season prologue.",
    usedAt: "Testing & development",
    base: "#111418",
    baseShade: "#050607",
    stripe: "#FF6B00",
    accent: "#9AA4AF",
    plate: "#FF6B00",
    numberColor: "#0B0D10",
    glow: "#FF6B00",
    number: "00",
  },
];

export type SpecGroup = {
  id: string;
  title: string;
  icon: "engine" | "weight" | "aero" | "fuel" | "tyre" | "clock";
  summary: string;
  specs: { label: string; value: string }[];
};

export const CAR = {
  name: "AVR-26",
  nickname: "Notturna",
  category: "Hypercar · LMDh-style prototype (fictional)",
  intro:
    "The AVR-26 is Apex Velocita's second-generation endurance prototype — a hybrid, closed-cockpit Hypercar developed for one purpose: finishing 24 hours at the front. The design emphasises driveability, serviceability and consistency over peak lap time.",
  headline: [
    { label: "Combined output", value: "520", unit: "kW", note: "BoP-dependent" },
    { label: "Minimum weight", value: "1,030", unit: "kg", note: "Regulation figure" },
    { label: "Top speed (Le Mans trim)", value: "342", unit: "km/h", note: "Sample figure" },
    { label: "Stint length (Le Mans)", value: "13", unit: "laps", note: "Typical" },
  ],
} as const;

export const SPEC_GROUPS: SpecGroup[] = [
  {
    id: "powertrain",
    title: "Powertrain",
    icon: "engine",
    summary: "Twin-turbo V6 at the rear, motor-generator unit on the front axle.",
    specs: [
      { label: "Engine", value: "2.6 L twin-turbo 90° V6, mid-mounted" },
      { label: "Hybrid system", value: "Front-axle MGU, 200 kW peak deployment" },
      { label: "Combined output", value: "520 kW (capped by Balance of Performance)" },
      { label: "Energy store", value: "Liquid-cooled 1.3 kWh battery pack" },
      { label: "Gearbox", value: "7-speed sequential, paddle-shift" },
      { label: "Deployment threshold", value: "Front axle above 190 km/h (sample rule)" },
    ],
  },
  {
    id: "weight",
    title: "Weight & Dimensions",
    icon: "weight",
    summary: "Carbon monocoque built around regulation minimums.",
    specs: [
      { label: "Minimum weight", value: "1,030 kg (without driver & fuel)" },
      { label: "Length", value: "5,100 mm" },
      { label: "Width", value: "2,000 mm" },
      { label: "Height", value: "1,060 mm" },
      { label: "Wheelbase", value: "3,148 mm" },
      { label: "Chassis", value: "Carbon-fibre composite monocoque with survival cell" },
    ],
  },
  {
    id: "aero",
    title: "Aerodynamics",
    icon: "aero",
    summary: "Two homologated kits: Le Mans low-drag and high-downforce.",
    specs: [
      { label: "Le Mans kit", value: "Low-drag wing, reduced-chord flap, trimmed dive planes" },
      { label: "High-downforce kit", value: "Full-chord flap, additional front louvres" },
      { label: "Downforce delta", value: "≈ 8% less in Le Mans trim (sample figure)" },
      { label: "Underfloor", value: "Stepped floor with rear diffuser" },
      { label: "Adjustability", value: "Single wing setting per event, balance via dive planes" },
      { label: "Cooling", value: "Adjustable duct blanking for brakes and radiators" },
    ],
  },
  {
    id: "fuel",
    title: "Fuel System",
    icon: "fuel",
    summary: "Energy-limited stints on 100% renewable race fuel.",
    specs: [
      { label: "Fuel", value: "100% renewable race fuel" },
      { label: "Tank capacity", value: "90 L FIA-spec safety cell" },
      { label: "Energy per stint", value: "Limited by BoP (≈ 900 MJ sample value)" },
      { label: "Refuelling", value: "Gravity-fed rig, dual-valve coupling" },
      { label: "Typical stop", value: "≈ 31 s with driver change & tyres (sample)" },
      { label: "Fuel flow", value: "Metered and monitored by series sensor" },
    ],
  },
  {
    id: "tyres",
    title: "Tyres & Brakes",
    icon: "tyre",
    summary: "Series-spec tyres; carbon brakes blended with hybrid harvesting.",
    specs: [
      { label: "Tyres", value: "Series control tyres — soft, medium, hard, wet" },
      { label: "Wheel size", value: "18 in rims, 29/71 front and rear diameter" },
      { label: "Brakes", value: "Carbon-carbon discs and pads, 6-piston callipers" },
      { label: "Brake-by-wire", value: "Rear axle, blended with front MGU regen" },
      { label: "Tyre plan (Le Mans)", value: "Up to quadruple stints at night" },
      { label: "Warmers", value: "Not permitted — out-lap warm-up procedure" },
    ],
  },
  {
    id: "endurance",
    title: "Endurance Setup",
    icon: "clock",
    summary: "Everything designed for a 24-hour race and fast repairs.",
    specs: [
      { label: "Quick-change bodywork", value: "Nose and rear deck swap in < 60 s" },
      { label: "Lighting", value: "LED headlight bars with class-identification lights" },
      { label: "Driver comfort", value: "Cooled seat, drinks system, adjustable pedal box" },
      { label: "Night aids", value: "Illuminated dash, rear-view radar for traffic" },
      { label: "Reliability target", value: "6,000 km continuous running per powertrain" },
      { label: "Telemetry", value: "Live link to pit wall and remote operations room" },
    ],
  },
];

export const SETUP_COMPARISON = {
  columns: ["Le Mans (24 h)", "6-hour rounds", "IMSA endurance"],
  rows: [
    { label: "Aero kit", values: ["Low-drag", "High-downforce", "High-downforce"] },
    { label: "Target stint", values: ["13 laps", "≈ 50 min", "≈ 45 min"] },
    { label: "Tyre strategy", values: ["Triple/quad stints", "Double stints", "Double stints"] },
    { label: "Brake cooling", values: ["Open → closed at night", "Medium", "Open"] },
    { label: "Ride height", values: ["Low", "Medium", "Raised (bumps)"] },
  ],
};
