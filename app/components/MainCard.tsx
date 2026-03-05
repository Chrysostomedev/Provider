"use client";

import { useState } from "react";
import SearchInput from "./SearchInput";
import EventLegend from "./EventLegend";
import CalendarGrid from "./CalendarGrid";
import MiniCalendar from "./MiniCalendar";
import SideDetailsPanel from "./SideDetailsPanel";
import { Planning } from "@services/providerPlanningService";

interface DetailField {
  label: string;
  value: string;
  isStatus?: boolean;
  statusColor?: string;
}

interface FormattedEvent {
  title: string;
  reference?: string;
  description?: string;
  fields: DetailField[];
}

interface MainCardProps {
  plannings: Planning[];
  isLoading?: boolean;
  selectedEvent: FormattedEvent | null;
  isPanelOpen: boolean;
  onEventClick: (planning: Planning) => void;
  onPanelClose: () => void;
  onEditClick: () => void;
  onDeleteClick?: () => void;
}

export default function MainCard({
  plannings,
  isLoading = false,
  selectedEvent,
  isPanelOpen,
  onEventClick,
  onPanelClose,
  onEditClick,
  onDeleteClick,
}: MainCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMonth, setActiveMonth] = useState(new Date());

  const filteredPlannings = plannings.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.codification.toLowerCase().includes(q) ||
      p.responsable_name.toLowerCase().includes(q) ||
      (p.site?.nom ?? p.site?.name ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full space-y-6">

      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-md">
          <SearchInput
            onSearch={(q) => setSearchQuery(q)}
            placeholder="Rechercher un planning, responsable, site..."
          />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">

        {/* Sidebar gauche */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-[24px] border border-slate-100 shadow-sm">
            <MiniCalendar
              activeMonth={activeMonth}
              onMonthChange={setActiveMonth}
              plannings={filteredPlannings}
            />
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <EventLegend
              search={searchQuery}
              plannings={filteredPlannings}
            />
          </div>
        </div>

        {/* Grille calendrier */}
        <div className="col-span-12 lg:col-span-9 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 space-y-4 animate-pulse">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-xl" />
              ))}
            </div>
          ) : (
            <CalendarGrid
              search={searchQuery}
              plannings={filteredPlannings}
              activeMonth={activeMonth}
              onEventClick={onEventClick}
            />
          )}
        </div>
      </div>

      <SideDetailsPanel
        isOpen={isPanelOpen}
        onClose={onPanelClose}
        title={selectedEvent?.title || ""}
        reference={selectedEvent?.reference}
        fields={selectedEvent?.fields || []}
        descriptionContent={selectedEvent?.description}
        onEdit={onEditClick}
      />
    </div>
  );
}