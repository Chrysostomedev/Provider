"use client";

import { useEffect, useRef, useState } from "react";
import {
  X, Bell, Ticket, MapPin, Building2, FileText,
  Receipt, Users, Settings, ChevronRight, CheckCheck,
  Trash2, ExternalLink, ArrowLeft,
} from "lucide-react";

type NotifSource =
  | "service"
  | "ticket"
  | "site"
  | "prestataire"
  | "soustype"
  | "type"
  | "patrimoine"
  | "facture"
  | "devis"
  | "utilisateur"
  | "planning";

type Notification = {
  id: string;
  title: string;
  summary: string;
  body: string;
  source: NotifSource;
  entityLabel?: string;
  href?: string;
  createdAt: string;
  read: boolean;
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7) return `il y a ${Math.floor(diff / 86400)} j`;

  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

/* -------------------------------------------------------------------------- */
/*                       MOCK NOTIFICATIONS (statique)                        */
/* -------------------------------------------------------------------------- */

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "Nouveau ticket créé",
    summary: "Un nouveau ticket a été créé sur le site Abidjan Plateau.",
    body: "Un ticket d'intervention a été ouvert concernant une panne de climatisation dans le bâtiment A.",
    source: "ticket",
    entityLabel: "Ticket #4521",
    createdAt: new Date().toISOString(),
    read: false,
    href: "/admin/tickets/4521",
  },
  {
    id: "2",
    title: "Nouvelle facture disponible",
    summary: "La facture du prestataire ClimService est disponible.",
    body: "La facture mensuelle du prestataire ClimService vient d'être ajoutée dans le système.",
    source: "facture",
    entityLabel: "Facture Mars",
    createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
    read: false,
  },
  {
    id: "3",
    title: "Utilisateur ajouté",
    summary: "Un nouvel utilisateur a été ajouté dans le système.",
    body: "L'utilisateur Jean Kouassi a été ajouté avec le rôle administrateur.",
    source: "utilisateur",
    entityLabel: "Jean Kouassi",
    createdAt: new Date(Date.now() - 86400 * 1000).toISOString(),
    read: true,
  },
];

/* -------------------------------------------------------------------------- */
/*                                CONFIG SOURCE                               */
/* -------------------------------------------------------------------------- */

const SOURCE_CONFIG: Record<
  NotifSource,
  {
    label: string;
    Icon: React.ElementType;
    iconBg: string;
    iconColor: string;
    dotColor: string;
  }
> = {
  service: { label: "Services", Icon: Users, iconBg: "bg-gray-100", iconColor: "text-gray-700", dotColor: "#4b5563" },
  ticket: { label: "Ticket", Icon: Ticket, iconBg: "bg-gray-100", iconColor: "text-gray-700", dotColor: "#374151" },
  site: { label: "Site", Icon: MapPin, iconBg: "bg-gray-100", iconColor: "text-gray-700", dotColor: "#4b5563" },
  prestataire: { label: "Prestataire", Icon: Users, iconBg: "bg-gray-100", iconColor: "text-gray-700", dotColor: "#374151" },
  soustype: { label: "Sous-type", Icon: Users, iconBg: "bg-gray-100", iconColor: "text-gray-700", dotColor: "#4b5563" },
  type: { label: "Type", Icon: Users, iconBg: "bg-gray-100", iconColor: "text-gray-700", dotColor: "#374151" },
  patrimoine: { label: "Patrimoine", Icon: Building2, iconBg: "bg-gray-200", iconColor: "text-gray-800", dotColor: "#1f2937" },
  facture: { label: "Facture", Icon: Receipt, iconBg: "bg-gray-200", iconColor: "text-gray-800", dotColor: "#111827" },
  devis: { label: "Devis", Icon: FileText, iconBg: "bg-gray-100", iconColor: "text-gray-700", dotColor: "#4b5563" },
  utilisateur: { label: "Utilisateur", Icon: Users, iconBg: "bg-gray-100", iconColor: "text-gray-700", dotColor: "#374151" },
  planning: { label: "Planning", Icon: Settings, iconBg: "bg-gray-200", iconColor: "text-gray-800", dotColor: "#1f2937" },
};

/* -------------------------------------------------------------------------- */
/*                               SOURCE ICON                                  */
/* -------------------------------------------------------------------------- */

function SourceIcon({ source }: { source: NotifSource }) {
  const cfg = SOURCE_CONFIG[source];
  const { Icon, iconBg, iconColor } = cfg;

  return (
    <div className={`w-10 h-10 rounded-2xl ${iconBg} flex items-center justify-center`}>
      <Icon size={18} className={iconColor} />
    </div>
  );
}

function SourceBadge({ source }: { source: NotifSource }) {
  const cfg = SOURCE_CONFIG[source];

  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${cfg.iconBg} ${cfg.iconColor}`}>
      {cfg.label}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*                           COMPONENT PRINCIPAL                              */
/* -------------------------------------------------------------------------- */

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeNotif, setActiveNotif] = useState<Notification | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(n => n.map(v => ({ ...v, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(n =>
      n.map(v => (v.id === id ? { ...v, read: true } : v))
    );
  };

  const remove = (id: string) => {
    setNotifications(n => n.filter(v => v.id !== id));
  };

  const handleOpenDetail = (notif: Notification) => {
    setActiveNotif(notif);
    setDetailOpen(true);
    if (!notif.read) markAsRead(notif.id);
  };

  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-[70]" />

      <div ref={panelRef} className="fixed right-0 top-0 h-full z-[71] flex">

        <div className="w-[420px] bg-white shadow-2xl flex flex-col">

          {/* HEADER */}
          <div className="flex justify-between px-6 pt-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Bell size={18} />
              <div>
                <h2 className="font-bold">Notifications</h2>
                <p className="text-xs text-gray-400">
                  {unreadCount} non lues
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs border px-2 py-1 rounded"
                >
                  Tout lire
                </button>
              )}

              <button onClick={onClose}>
                <X size={18} />
              </button>
            </div>
          </div>

          {/* LISTE */}
          <div className="flex-1 overflow-y-auto">

            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleOpenDetail(notif)}
                className="flex gap-3 px-5 py-4 border-b hover:bg-gray-50 cursor-pointer"
              >
                <SourceIcon source={notif.source} />

                <div className="flex-1">
                  <p className={`text-sm ${notif.read ? "text-gray-500" : "font-bold"}`}>
                    {notif.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    {notif.summary}
                  </p>

                  <div className="flex gap-2 mt-1 items-center">
                    <SourceBadge source={notif.source} />
                    <span className="text-xs text-gray-400">
                      {timeAgo(notif.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(notif.id);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}