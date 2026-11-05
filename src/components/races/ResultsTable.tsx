import { cn } from "@/lib/cn";
import type { RaceResultDTO } from "@/lib/types";

export function ResultsTable({ results, raceName }: { results: RaceResultDTO[]; raceName: string }) {
  return (
    <div className="overflow-x-auto border border-line" role="region" aria-label={`${raceName} sample classification`} tabIndex={0}>
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <caption className="sr-only">Fictional sample classification for {raceName}. Apex Velocita entries are highlighted.</caption>
        <thead>
          <tr className="bg-graphite">
            {["Pos", "Car", "Team", "Drivers", "Laps", "Gap", "Best lap"].map((h) => (
              <th key={h} scope="col" className="label-tech whitespace-nowrap p-3 text-steel first:pl-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr
              key={r.position}
              className={cn("border-t border-line", r.isTeamEntry ? "bg-apex-blue/10" : "hover:bg-graphite/60", r.status === "DNF" && "text-steel")}
            >
              <td className="p-3 pl-4 font-mono font-bold">
                {r.status === "DNF" ? (
                  <span className="text-danger">DNF</span>
                ) : (
                  <span className={cn(r.position <= 3 && "text-apex-orange")}>P{r.position}</span>
                )}
              </td>
              <td className="p-3 font-mono font-bold">#{r.carNumber}</td>
              <td className="whitespace-nowrap p-3">
                <span className={cn(r.isTeamEntry && "font-semibold text-apex-blue")}>{r.team}</span>
                {r.isTeamEntry && <span className="sr-only"> (Apex Velocita entry)</span>}
              </td>
              <td className="p-3 text-steel">{r.drivers}</td>
              <td className="p-3 font-mono tabular">{r.laps}</td>
              <td className="whitespace-nowrap p-3 font-mono tabular">{r.gap}</td>
              <td className="p-3 font-mono tabular text-steel">{r.bestLap}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
