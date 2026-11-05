/** Fictional team content. All people, figures and milestones are sample data. */

export const TEAM_STORY = {
  heading: "Born in the dark hours of endurance racing",
  paragraphs: [
    "Apex Velocita Racing began in 2014 as a four-person privateer effort running a single prototype in regional endurance races. The founders shared one obsession: the moment, deep into the night at Le Mans, when speed matters less than precision, nerve and preparation.",
    "A decade later, the team runs a two-car factory-style Hypercar programme across the world's great endurance races — with more than 120 people across engineering, operations and race crew, and a technical centre that houses its own driver-in-the-loop simulator.",
  ],
  mission:
    "Our mission is simple: build the most consistent endurance car on the grid, operated by the best-prepared crew in the pit lane, and win the 24 Hours of Le Mans.",
  values: [
    { title: "Consistency over flash", text: "We design for lap 380, not lap one. Repeatable performance beats peak performance in a 24-hour race." },
    { title: "Prepared for the night", text: "Every procedure is rehearsed until it can be done half-asleep at 4 a.m. — because sometimes it will be." },
    { title: "One crew, two cars", text: "The #18 and #81 share data, set-ups and lessons openly. The team wins before either car does." },
  ],
};

export const MILESTONES = [
  { year: "2014", title: "Founded", text: "Four engineers enter a single prototype in a regional endurance series." },
  { year: "2017", title: "First Le Mans start", text: "The team makes its debut at the Circuit de la Sarthe in the prototype support class." },
  { year: "2021", title: "Class victory", text: "A first endurance class win, earned on a three-stop strategy in heavy rain." },
  { year: "2024", title: "Hypercar programme", text: "The AVR-24 debuts as the team steps into the top class with two cars." },
  { year: "2026", title: "First Hypercar wins", text: "Victories at Spa, Fuji and Petit Le Mans, plus second at Le Mans." },
];

export type CrewMember = { name: string; role: string; focus: string; initials: string };

export const CREW: CrewMember[] = [
  { name: "Elena Vasquez-Hart", role: "Team Principal", focus: "Leads the programme, from budget to the final call on race strategy.", initials: "EV" },
  { name: "Dr. Rafael Castiglione", role: "Technical Director", focus: "Owns the AVR-26 design and the development roadmap.", initials: "RC" },
  { name: "Priya Raman", role: "Chief Race Engineer · #18", focus: "Set-up direction and in-race decisions for the #18 crew.", initials: "PR" },
  { name: "Jonas Weidemann", role: "Chief Race Engineer · #81", focus: "Set-up direction and in-race decisions for the #81 crew.", initials: "JW" },
  { name: "Aiko Matsuda", role: "Head of Strategy", focus: "Fuel, tyre and caution modelling across both cars.", initials: "AM" },
  { name: "Oliver Grant", role: "Head of Aerodynamics", focus: "Le Mans and high-downforce kits, CFD and wind-tunnel correlation.", initials: "OG" },
  { name: "Sofia Andrade", role: "Head of Hybrid Systems", focus: "Energy deployment, brake-by-wire and battery reliability.", initials: "SA" },
  { name: "Marcus Bell", role: "Chief Mechanic", focus: "Pit-stop choreography, car builds and garage operations.", initials: "MB" },
  { name: "Dr. Hana Kowalski", role: "Driver Performance & Medical", focus: "Sleep, nutrition and fitness planning for all seven drivers.", initials: "HK" },
];

/** All-time fictional statistics shown on the team page. */
export const ALL_TIME_STATS = [
  { label: "Seasons", value: 13, suffix: "" },
  { label: "Race starts", value: 112, suffix: "" },
  { label: "Victories", value: 14, suffix: "" },
  { label: "Podiums", value: 41, suffix: "" },
  { label: "Le Mans starts", value: 10, suffix: "" },
  { label: "Kilometres raced", value: 418, suffix: "k" },
];
