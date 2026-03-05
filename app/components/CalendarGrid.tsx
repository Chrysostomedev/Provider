"use client";

import { Planning, STATUS_COLORS, isPlanningOnDate } from "@services/providerPlanningService";
import { DayCell } from "./DayCell";

interface CalendarEvent {
  id: number;
  label: string;
  time: string;
  color: string;
  status: string;
  planning: Planning;
}

interface CalendarGridProps {
  search?: string;
  plannings: Planning[];
  activeMonth: Date;
  onEventClick: (planning: Planning) => void;
}

export default function CalendarGrid({
  search = "",
  plannings,
  activeMonth,
  onEventClick,
}: CalendarGridProps) {
  const year  = activeMonth.getFullYear();
  const month = activeMonth.getMonth();

  const daysInMonth     = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const startingDay     = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: { day: number; currentMonth: boolean; events: CalendarEvent[] }[] = [];

  for (let i = startingDay; i > 0; i--)
    cells.push({ day: daysInPrevMonth - i + 1, currentMonth: false, events: [] });

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dayPlannings = plannings.filter((p) => isPlanningOnDate(p, date));
    const filtered = dayPlannings.filter((p) => {
      const q = search.toLowerCase();
      return (
        !q ||
        p.codification.toLowerCase().includes(q) ||
        p.responsable_name.toLowerCase().includes(q) ||
        (p.site?.nom ?? p.site?.name ?? "").toLowerCase().includes(q)
      );
    });
    const events: CalendarEvent[] = filtered.map((p) => ({
      id:       p.id,
      label:    p.codification,
      time:     p.date_debut.split("T")[1]?.slice(0, 5) ?? "—",
      color:    STATUS_COLORS[p.status] ?? "#000000",
      status:   p.status,
      planning: p,
    }));
    cells.push({ day: d, currentMonth: true, events });
  }

  const remaining = cells.length <= 35 ? 35 - cells.length : 42 - cells.length;
  for (let i = 1; i <= remaining; i++)
    cells.push({ day: i, currentMonth: false, events: [] });

  const DAY_HEADERS = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 border-b border-slate-100">
        {DAY_HEADERS.map((d) => (
          <div key={d} className="text-[11px] font-bold text-slate-400 tracking-widest text-center py-3">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 border-l border-slate-100">
        {cells.map((cell, i) => (
          <DayCell
            key={i}
            day={cell.day}
            currentMonth={cell.currentMonth}
            events={cell.events}
            onClick={(event) => {
              if (event?.planning) onEventClick(event.planning);
            }}
          />
        ))}
      </div>
    </div>
  );
}