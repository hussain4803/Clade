/**
 * Sample news articles. Every story, quote and result below is fictional and
 * written for demonstration purposes only.
 */
export type SeedArticle = {
  slug: string;
  title: string;
  excerpt: string;
  category: "race-report" | "team" | "technical" | "drivers" | "behind-the-scenes";
  tags: string[];
  author: keyof typeof AUTHORS;
  publishedAt: string;
  featured?: boolean;
  coverAlt: string;
  body: string;
};

export const AUTHORS = {
  marlowe: { name: "Sienna Marlowe", role: "Communications Lead (fictional)" },
  okoro: { name: "Daniel Okoro", role: "Technical Editor (fictional)" },
  castell: { name: "Rhea Castell", role: "Team Reporter (fictional)" },
} as const;

export const ARTICLES: SeedArticle[] = [
  {
    slug: "bahrain-8-hours-preview",
    title: "Bahrain preview: eight hours to close the season",
    excerpt:
      "Both AVR-26s head to Sakhir for the world-championship finale with the team still in contention for second in the manufacturers' standings.",
    category: "team",
    tags: ["Bahrain", "Preview", "WEC"],
    author: "marlowe",
    publishedAt: "2026-11-04T09:00:00Z",
    featured: true,
    coverAlt: "Stylized graphic of the AVR-26 under floodlights",
    body: `The final round of the world-championship season takes Apex Velocita Racing to the Bahrain International Circuit for eight hours that start in the desert afternoon and finish under floodlights.

After victories at Spa and Fuji, the team arrives with both cars in form and a mathematical chance of finishing second in the manufacturers' standings. The target is simple: two clean races, maximum points.

## What makes Bahrain different

Sakhir's surface is one of the most abrasive on the calendar. Rear tyre degradation dominates the opening stints, and the four heavy braking zones put brake cooling under constant pressure as the ambient temperature drops into the evening.

> We will run a slightly more open cooling configuration for the first two hours and close it down as the sun sets. The car has to be right across a 20-degree window.
> — Priya Raman, Chief Race Engineer #18 (fictional)

## Line-ups

- #18: Mara Lindqvist, Kenji Arakawa, Théo Valcourt
- #81: Isabela Duarte, Callum Rourke, Nadia Okonkwo

The countdown on the race page shows the scheduled start in local track time. As always, everything on this page is sample content for a fictional team.`,
  },
  {
    slug: "driver-line-up-confirmed-2027",
    title: "Unchanged six-driver line-up confirmed for 2027",
    excerpt:
      "Lindqvist, Arakawa, Valcourt, Duarte, Rourke and Okonkwo will stay together for a second season, with Luca Ferrandi retained as reserve.",
    category: "team",
    tags: ["2027", "Drivers", "Announcement"],
    author: "marlowe",
    publishedAt: "2026-10-20T10:00:00Z",
    coverAlt: "Six stylized racing helmets lined up on a dark background",
    body: `Apex Velocita Racing will keep its full driver roster together for the 2027 endurance season, giving both crews a second year of continuity.

Mara Lindqvist, Kenji Arakawa and Théo Valcourt remain in the #18, while Isabela Duarte, Callum Rourke and Nadia Okonkwo continue in the #81. Luca Ferrandi stays on as reserve and simulator driver and will again join the #81 for the longer North American rounds.

## Why continuity matters

In endurance racing, a crew that knows each other's habits is worth tenths over a stint. Shared seat inserts, pedal positions and steering-wheel layouts have been refined over a full season, and the driver-change routine is now measured in fractions of a second.

> Speed was never the question with this group. What we have built this year is trust — between the drivers, and between the cockpit and the pit wall.
> — Elena Vasquez-Hart, Team Principal (fictional)

The 2027 calendar on this site lists provisional sample dates. This announcement is fictional demo content.`,
  },
  {
    slug: "petit-le-mans-victory",
    title: "Petit Le Mans: #18 wins as the #81 completes the podium",
    excerpt:
      "A late-race safety-car gamble put the #18 on the lead lap with fresh tyres, and Lindqvist did the rest in the Georgia darkness.",
    category: "race-report",
    tags: ["Petit Le Mans", "Victory", "IMSA"],
    author: "castell",
    publishedAt: "2026-10-12T08:00:00Z",
    coverAlt: "Stylized graphic of a prototype racing car at night with light trails",
    body: `Apex Velocita Racing closed its North American endurance campaign with a win and a podium at Road Atlanta, as the #18 crew converted a bold strategy call into victory after ten hours of racing.

## The decisive call

With 94 minutes remaining, a full-course caution split the field. The #18 pit wall chose to take four new tyres and a full energy top-up while the leaders stayed out. The gamble cost two positions on the restart but left the car with the freshest rubber in the top five.

Mara Lindqvist re-passed both cars ahead within 20 laps and controlled the final stint to take the chequered flag.

> The tyres were the difference. In the dark you can't see the grip falling away for everyone else — but you can feel it in the gaps.
> — Mara Lindqvist (fictional)

## #81 on the podium

The #81 of Isabela Duarte, Callum Rourke, Nadia Okonkwo and Luca Ferrandi ran a clean race to finish third, giving the team a double podium.

All results quoted here are fictional sample data.`,
  },
  {
    slug: "fuji-6-hours-strategy-win",
    title: "Fuji 6 Hours: a perfect strategy win for the #18",
    excerpt:
      "One fewer pit stop than the opposition, a flawless final stint from Arakawa and the team's second Hypercar victory of the season.",
    category: "race-report",
    tags: ["Fuji", "Victory", "WEC", "Strategy"],
    author: "castell",
    publishedAt: "2026-09-28T07:30:00Z",
    coverAlt: "Stylized graphic of a long straight with a mountain silhouette",
    body: `Kenji Arakawa crossed the line at Fuji Speedway to give Apex Velocita its second Hypercar win of the season, with the #18 crew completing the six hours on one fewer stop than any of their rivals.

## Saving a stop

Fuji's long main straight rewards efficiency. The team ran the #18 with a fractionally lower downforce level and asked the drivers to lift-and-coast into Turn 1 throughout the race. The saving — roughly 0.4 per cent of energy per lap — added up to an extra lap per stint.

> We knew from the simulator that the stop was available if the drivers hit the targets every lap. They hit them every single lap.
> — Aiko Matsuda, Head of Strategy (fictional)

## Home hero

For Arakawa, the win came in front of his home crowd. The #81 finished fourth after a drive-through penalty for a pit-lane speed infringement.

This race report is fictional sample content.`,
  },
  {
    slug: "packing-for-flyaway-rounds",
    title: "Forty tonnes of freight: packing for the flyaway rounds",
    excerpt:
      "How the logistics team fits two race cars, a garage and a hospitality kitchen into air-freight pallets — and gets it all back again.",
    category: "behind-the-scenes",
    tags: ["Logistics", "Freight", "Behind the Scenes"],
    author: "castell",
    publishedAt: "2026-08-28T12:00:00Z",
    coverAlt: "Stylized graphic of stacked freight crates with diagonal stripes",
    body: `When the championship leaves Europe, the team's entire operation has to fit into air-freight containers. For the Americas and Asia swing, that means roughly 40 tonnes of equipment packed to the centimetre.

## The packing list

- Two race cars plus a spare monocoque
- 48 wheel rims and a tyre-warming setup
- Four pit-wall stands and the full timing network
- Spares for gearboxes, hybrid units and bodywork
- A garage floor, lighting rig and team kitchen

Every crate is numbered and weighed, and the packing plan is rehearsed in the workshop before the first item leaves.

> If one crate goes missing, we need to know within minutes what was in it and whether we can race without it.
> — Marcus Bell, Chief Mechanic (fictional)

All figures in this story are fictional sample data.`,
  },
  {
    slug: "brakes-that-last-24-hours",
    title: "Brakes that last 24 hours: carbon, cooling and patience",
    excerpt:
      "An endurance brake system has to survive thousands of heavy stops. Here is how the AVR-26 manages temperature, wear and driver feel.",
    category: "technical",
    tags: ["Technical", "Brakes", "AVR-26"],
    author: "okoro",
    publishedAt: "2026-08-18T09:00:00Z",
    coverAlt: "Stylized technical drawing of a glowing brake disc",
    body: `A Hypercar brakes from over 300 km/h several times a lap. Over 24 hours at Le Mans, that adds up to thousands of heavy stops — and the brakes have to feel the same in hour 23 as they did on lap one.

## Carbon needs heat — but not too much

Carbon-carbon discs work best in a narrow temperature window. Too cold and the bite disappears; too hot and wear accelerates sharply. The AVR-26 uses adjustable brake-duct blanking so the crew can tune cooling at every stop.

## Hybrid harvesting helps

The front-axle motor-generator recovers energy under braking, which also takes load off the friction brakes. The brake-by-wire system blends the two seamlessly so the driver feels one consistent pedal.

> Drivers don't care where the deceleration comes from. They care that the pedal is the same every time.
> — Sofia Andrade, Head of Hybrid Systems (fictional)

Technical details in this article are illustrative and not real specifications.`,
  },
  {
    slug: "nadia-okonkwo-rookie-season",
    title: "Nadia Okonkwo's rookie season, in her own words",
    excerpt:
      "From GT racing to Hypercar: the youngest driver in the team on night stints, data overload and her first podium.",
    category: "drivers",
    tags: ["Drivers", "Nadia Okonkwo", "Interview"],
    author: "marlowe",
    publishedAt: "2026-08-04T10:00:00Z",
    coverAlt: "Stylized helmet graphic in white, orange and blue",
    body: `Nadia Okonkwo stepped up from GT endurance racing to the #81 Hypercar this season. Halfway through the year, we asked her what has surprised her most.

## On the step up

"The braking. You think you know how late you can brake, and then the car keeps telling you that you can go later. It took me two race weekends to trust it fully."

## On night driving

"In GT racing I did night stints, but here the closing speeds on slower cars are so much bigger. You're constantly planning three corners ahead."

> My first podium felt amazing, but my favourite moment was a triple stint at Sebring where my lap times barely moved. That's when I felt I belonged.
> — Nadia Okonkwo (fictional)

## Learning from the best

Okonkwo credits team-mates Duarte and Rourke for accelerating her learning, with shared onboard reviews after every session.

This interview is fictional sample content.`,
  },
  {
    slug: "mara-lindqvist-leading-the-night",
    title: "Mara Lindqvist on leading the #18 through the night",
    excerpt:
      "The #18's lead driver explains how she prepares for night stints, why consistency beats peak pace, and what she eats at 4 a.m.",
    category: "drivers",
    tags: ["Drivers", "Mara Lindqvist", "Le Mans"],
    author: "marlowe",
    publishedAt: "2026-07-02T09:00:00Z",
    coverAlt: "Stylized helmet graphic in white with an electric-blue stripe",
    body: `Mara Lindqvist has become the reference driver of the #18 crew. After a second place at Le Mans, she talked us through how she approaches the hardest hours of an endurance race.

## Sleep is part of the strategy

"I plan my sleep like a stint plan. After a double stint I have 90 minutes to eat, debrief and rest before the next one. If I miss the window, the next stint is worse."

## Consistency over peak pace

"Anyone can do one fast lap. What wins Le Mans is lap 40 of a stint being the same as lap four, with the same tyre wear, the same fuel use."

> At night, I focus on reference points I wouldn't even notice in daylight — a marshal post light, a sign on the barrier. The track becomes a sequence of little beacons.
> — Mara Lindqvist (fictional)

## And at 4 a.m.?

"Rice, a bit of chicken, lots of water. Nothing exciting. Excitement is for the last hour."

This interview is fictional sample content.`,
  },
  {
    slug: "night-shift-le-mans-garage",
    title: "Night shift: inside the garage at 4 a.m. at Le Mans",
    excerpt:
      "Fifty people, two cars and one rule — nobody sleeps when their car is due in. A look at the quietest, tensest hours of the race.",
    category: "behind-the-scenes",
    tags: ["Le Mans", "Behind the Scenes", "Crew"],
    author: "castell",
    publishedAt: "2026-06-20T08:00:00Z",
    coverAlt: "Stylized graphic of a pit garage lit by blue and orange lights",
    body: `At four in the morning at Le Mans, the grandstands are almost empty, but inside the garage nothing stops. Mechanics rotate on carefully planned rest shifts, engineers stare at tyre-temperature traces, and the next driver sits fully suited in a quiet room behind the pit box.

## Choreography in the dark

Every pit stop at night follows the same rehearsed sequence as in daylight, but under artificial light. The crew wears head torches during wheel changes, and the lollipop operator uses an illuminated board.

> The night is when concentration drops. That's why we rehearse the procedures until nobody has to think about them.
> — Marcus Bell, Chief Mechanic (fictional)

## Fuel for the crew

The team kitchen serves warm meals every four hours. Coffee consumption, we are told, is "classified".

This feature is fictional sample content.`,
  },
  {
    slug: "le-mans-2026-second-place",
    title: "Le Mans 2026: second after 24 hours of attrition",
    excerpt:
      "The #18 fought back from a slow puncture in hour three to finish second at the Circuit de la Sarthe — the team's best Le Mans result to date.",
    category: "race-report",
    tags: ["Le Mans", "Podium", "WEC"],
    author: "castell",
    publishedAt: "2026-06-15T07:00:00Z",
    featured: true,
    coverAlt: "Stylized graphic of the AVR-26 at dusk on a long straight",
    body: `After 24 hours and more than 5,000 kilometres, the #18 Apex Velocita AVR-26 crossed the line in second place at the 24 Hours of Le Mans — the best result in the team's history at the race it was built for.

## Recovering from hour three

A slow puncture on the Mulsanne Straight in the third hour forced Théo Valcourt into an unscheduled stop and dropped the #18 a lap behind the leaders. The crew responded by switching to a quadruple-stint tyre plan through the night, with Kenji Arakawa completing almost four hours in the car.

By sunrise, the #18 was back on the lead lap.

> When we lost the lap, nobody panicked. We said: there are 21 hours left, let's make every single one count.
> — Elena Vasquez-Hart, Team Principal (fictional)

## A tough race for the #81

The #81 ran in the top five until a hybrid-system fault on Sunday morning cost twelve minutes in the garage. Duarte, Rourke and Okonkwo recovered to sixth.

## By the numbers

- 381 laps completed by the #18
- 31 pit stops
- 0 penalties

All figures and results are fictional sample data.`,
  },
  {
    slug: "le-mans-aero-kit-explained",
    title: "Low-drag, high stakes: the Le Mans aero kit explained",
    excerpt:
      "The AVR-26 runs a unique bodywork package for the Circuit de la Sarthe. Our technical editor explains what changes and why.",
    category: "technical",
    tags: ["Technical", "Aerodynamics", "Le Mans"],
    author: "okoro",
    publishedAt: "2026-06-02T09:00:00Z",
    coverAlt: "Stylized aerodynamic streamlines flowing over a prototype silhouette",
    body: `With straights that make up most of the lap, Le Mans demands a different aerodynamic philosophy from any other round. The AVR-26 arrives with a dedicated low-drag kit.

## What changes

- A shallower rear-wing main plane with a reduced-chord flap
- Revised front dive planes to rebalance the car
- Smaller cooling inlets where ambient temperatures allow

## The compromise

Less downforce means higher top speed on the Mulsanne, but a nervous car through the Porsche Curves. The team's simulator programme ran over 4,000 laps to find the balance — trading roughly 8 per cent of downforce for a top-speed gain of around 6 km/h.

> Balance of performance fixes the headline numbers. Our job is to make the car easy to drive fast for 24 hours.
> — Oliver Grant, Head of Aerodynamics (fictional)

All numbers in this article are illustrative sample data, not real specifications.`,
  },
  {
    slug: "inside-the-hybrid-system",
    title: "Inside the hybrid: harvesting energy over a 13.6 km lap",
    excerpt:
      "How the AVR-26's front-axle motor-generator recovers, stores and redeploys energy — and why the rulebook limits when it can be used.",
    category: "technical",
    tags: ["Technical", "Hybrid", "AVR-26"],
    author: "okoro",
    publishedAt: "2026-05-28T10:00:00Z",
    coverAlt: "Stylized telemetry graph of hybrid energy deployment",
    body: `The AVR-26 combines a twin-turbo V6 at the rear with an electric motor-generator unit on the front axle. Together they deliver a combined output capped by the regulations — so the art is in when and how the energy is used.

## Harvest, store, deploy

Under braking, the front motor-generator converts kinetic energy into electricity stored in a compact battery. On corner exit, that energy is redeployed to the front wheels, giving the car temporary four-wheel drive.

## The speed threshold

Regulations only allow front-axle deployment above a minimum speed, so the system cannot be used to launch out of slow corners. Engineers instead map the deployment to medium- and high-speed exits.

> The driver feels one car, but underneath there are hundreds of decisions per lap about where every kilojoule goes.
> — Sofia Andrade, Head of Hybrid Systems (fictional)

This article contains illustrative sample data and is not a description of any real car.`,
  },
  {
    slug: "luca-ferrandi-simulator-laps",
    title: "Luca Ferrandi: 4,000 simulator laps before Le Mans",
    excerpt:
      "The team's reserve driver spends his race weeks in a dark room. Here's why his work matters to every set-up change on the race cars.",
    category: "drivers",
    tags: ["Drivers", "Simulator", "Luca Ferrandi"],
    author: "castell",
    publishedAt: "2026-05-20T11:00:00Z",
    coverAlt: "Stylized graphic of a simulator cockpit with blue screens",
    body: `While the race drivers prepare at the track, Luca Ferrandi is often hundreds of kilometres away — sitting in the team's driver-in-the-loop simulator, testing set-up changes before they reach the real cars.

## A virtual Le Mans

In the four weeks before Le Mans, Ferrandi completed more than 4,000 simulated laps of the Circuit de la Sarthe, including full night runs with reduced visibility and degraded tyre models.

> The engineers ask questions like: if we soften the rear by one click, what happens in hour 18 with old tyres? I find the answer before the race does.
> — Luca Ferrandi (fictional)

## Racing too

Ferrandi also joins the #81 crew for the longer North American endurance races, where four-driver line-ups are common.

This feature is fictional sample content.`,
  },
  {
    slug: "spa-first-hypercar-win",
    title: "First win: the #81 conquers a rain-soaked Spa",
    excerpt:
      "Isabela Duarte gambled on slicks on a drying track with 70 minutes to go — and gave Apex Velocita its first Hypercar victory.",
    category: "race-report",
    tags: ["Spa", "Victory", "WEC"],
    author: "castell",
    publishedAt: "2026-05-10T07:00:00Z",
    coverAlt: "Stylized graphic of a prototype racing car with spray on a wet track",
    body: `Apex Velocita Racing claimed its first Hypercar victory at Spa-Francorchamps, as the #81 crew of Isabela Duarte, Callum Rourke and Nadia Okonkwo mastered the changing Ardennes weather.

## The slick gamble

A heavy shower in the fourth hour sent most of the field onto wet tyres. As the track began to dry with 70 minutes remaining, Duarte radioed the pit wall asking for slicks — a lap earlier than anyone else.

The gamble was worth almost 20 seconds per lap for two laps, and the #81 emerged from the cycle of stops with a lead it never lost.

> Isabela told us the track was ready, and she has the best feel for grip I've ever worked with. We trusted her.
> — Jonas Weidemann, Chief Race Engineer #81 (fictional)

## Double podium

The #18 finished third, giving the team two cars on the podium for the first time.

All results quoted are fictional sample data.`,
  },
  {
    slug: "driver-change-rehearsal",
    title: "Pit stop in 31 seconds: rehearsing the driver change",
    excerpt:
      "A driver change can win or lose a race. The team practises it hundreds of times a year — here's the step-by-step.",
    category: "behind-the-scenes",
    tags: ["Pit Stops", "Behind the Scenes", "Crew"],
    author: "castell",
    publishedAt: "2026-04-08T10:00:00Z",
    coverAlt: "Stylized top-down graphic of a pit box with crew positions",
    body: `In endurance racing, every pit stop is a chance to gain or lose position — and the driver change is the most complex part of it.

## The sequence

- The outgoing driver releases belts and disconnects the drinks tube before the car stops
- A crew member opens the door and helps the driver out
- The incoming driver drops in; a second crew member tightens the belts
- Radio and drinks connections are checked before the car is released

The team's best rehearsed driver change, combined with refuelling and four tyres, sits at 31 seconds in workshop conditions.

> We film every rehearsal and review it frame by frame. A tenth here and a tenth there adds up to a minute over 24 hours.
> — Callum Rourke (fictional)

All times quoted are fictional sample data.`,
  },
  {
    slug: "sebring-12-hours-report",
    title: "Sebring 12 Hours: Duarte leads #81 to second as #18 retires",
    excerpt:
      "The bumps of Sebring claimed the #18 with a suspension failure, but the sister car fought to a strong second place.",
    category: "race-report",
    tags: ["Sebring", "Podium", "IMSA"],
    author: "castell",
    publishedAt: "2026-03-22T08:00:00Z",
    coverAlt: "Stylized graphic of a prototype on a bumpy concrete track at sunset",
    body: `The 12 Hours of Sebring lived up to its reputation as the toughest race on the calendar, with the #18 retiring in the fifth hour and the #81 battling to second place.

## A cruel retirement

The #18 had been running third when a rear suspension component failed over the infamous Turn 17 bumps. Kenji Arakawa brought the car back to the pits, but the damage could not be repaired in time to rejoin.

## #81 rises to second

Isabela Duarte, Callum Rourke, Nadia Okonkwo and Luca Ferrandi kept the #81 on the lead lap throughout. A late charge from Duarte cut the gap to the winner to around a minute at the flag.

> Sebring finds every weakness. We'll learn from the failure, and the #81 showed what this car can do when it gets to the end.
> — Dr. Rafael Castiglione, Technical Director (fictional)

All results quoted are fictional sample data.`,
  },
  {
    slug: "qatar-season-opener-podium",
    title: "Qatar opener: a podium to start the Hypercar year",
    excerpt:
      "The #18 claimed third place in the 1812 km season opener, while the #81 recovered from a first-lap tangle to finish sixth.",
    category: "race-report",
    tags: ["Qatar", "Podium", "WEC"],
    author: "castell",
    publishedAt: "2026-03-01T07:00:00Z",
    coverAlt: "Stylized graphic of a prototype under desert floodlights",
    body: `Apex Velocita Racing opened its world-championship season with a podium, as the #18 crew finished third after 1,812 kilometres under the Lusail floodlights.

## Managing the front-left

Lusail's long, fast corners load the front-left tyre heavily. The #18 crew opted for a conservative tyre-pressure strategy that cost pace early but paid off in the final two stints as rivals faded.

## Recovery drive for the #81

Contact on the opening lap damaged the #81's front bodywork, forcing an early stop. From the back of the field, the crew recovered to sixth.

> Third is a solid start. More importantly, the car was quick in the cool of the night, which tells us we're in good shape for Le Mans.
> — Mara Lindqvist (fictional)

All results quoted are fictional sample data.`,
  },
  {
    slug: "technical-centre-opens",
    title: "New technical centre opens its doors",
    excerpt:
      "A purpose-built facility brings design, race preparation and the driver-in-the-loop simulator under one roof for the first time.",
    category: "team",
    tags: ["Facility", "Team", "Simulator"],
    author: "marlowe",
    publishedAt: "2026-02-10T10:00:00Z",
    coverAlt: "Stylized architectural graphic of a modern workshop with grid lines",
    body: `Apex Velocita Racing has moved into a new technical centre that unites every part of the endurance programme in a single building for the first time.

## What's inside

- A race-preparation bay with space for four cars
- A dedicated hybrid-systems laboratory
- A driver-in-the-loop simulator with a 210-degree screen
- A mission-control room linked to the pit wall during races

## Mission control

During races, a team of engineers in the operations room analyses live telemetry and feeds strategy recommendations to the pit wall — effectively adding extra engineers to the garage without adding travel.

> Endurance racing is a team sport played by a hundred people. Now those hundred people can actually see each other every day.
> — Elena Vasquez-Hart, Team Principal (fictional)

The facility described here is fictional sample content.`,
  },
];
