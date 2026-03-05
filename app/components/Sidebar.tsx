"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  LayoutDashboard,
  Settings,
  LogOut,
  Ticket,
  Calendar,
  FileText,
  FileSignature,
  AlertTriangle,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  BellDot
} from "lucide-react";

interface MenuItem {
  label: string;
  icon: JSX.Element;
  href?: string;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { label: "Tableau de bord", icon: <LayoutDashboard size={20} />, href: "/provider/dashboard" },
  { label: "Tickets", icon: <Ticket size={20} />, href: "/provider/tickets" },
  { label: "Planning", icon: <Calendar size={20} />, href: "#" },
  { label: "Devis", icon: <FileSignature size={20} />, href: "#" },
  { label: "Factures", icon: <FileText size={20} />, href: "#" },
  { label: "Rapports", icon: <ChartNoAxesColumnIncreasing size={20} />, href: "#" },
  { label: "Notifictaions", icon: <BellDot size={20} />, href: "#" },

];

export default function Sidebar() {

  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSubMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const NavItem = ({ item, depth = 0 }: { item: MenuItem; depth?: number }) => {

    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus.includes(item.label);

    return (
      <div className="w-full">

        <div className="flex items-center w-full rounded-xl text-gray-600 hover:bg-gray-50 transition-all duration-200">

          <Link
            href={item.href || "#"}
            className={`flex-1 flex items-center gap-3 px-3 py-2.5 font-medium text-[15px] ${
              depth > 0 ? "pl-4" : ""
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>

          {hasSubItems && (
            <button
              onClick={() => toggleSubMenu(item.label)}
              className={`px-3 py-2.5 transition-transform ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={16} />
            </button>
          )}
        </div>

        {hasSubItems && isExpanded && (
          <div className="ml-4 mt-1 border-l-2 border-gray-100 pl-2 space-y-1">
            {item.subItems?.map((sub) => (
              <NavItem key={sub.label} item={sub} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const bottomItems = [
    { label: "Paramètres", href: "#", icon: <Settings size={20} /> }
  ];

  return (
    <>
      <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-lg border-r border-gray-200 flex flex-col z-40">

        {/* Logo */}
        <div className="px-6 py-6 border-b border-gray-100 flex items-center justify-center">
          <Image
            src="/images/logo_canal.png"
            alt="CANAL+"
            width={180}
            height={50}
            priority
          />
        </div>

        {/* Menu principal */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        {/* Bas sidebar */}
        <div className="p-4 border-t border-gray-100 space-y-2">

          {bottomItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-medium text-[15px]"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}

          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium text-[15px]"
          >
            <LogOut size={20} />
            <span>Se déconnecter</span>
          </button>

        </div>
      </aside>

      {/* Modal logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center">

          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />

          <div className="relative bg-white w-[90%] max-w-lg rounded-[2.5rem] p-10 shadow-2xl flex flex-col items-center text-center space-y-8">

            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle
                className="text-red-500"
                size={38}
                strokeWidth={2.5}
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Déconnexion de votre compte
              </h2>

              <p className="text-gray-500 text-lg leading-relaxed font-medium px-4">
                Souhaitez-vous vous déconnecter ?
              </p>
            </div>

            <div className="flex gap-4 w-full pt-4">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-6 rounded-2xl bg-[#1A1A1A] text-white font-bold hover:bg-black transition-all"
              >
                Rester connecté
              </button>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 px-6 rounded-2xl bg-[#FF0000] text-white font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-200"
              >
                Se déconnecter
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}