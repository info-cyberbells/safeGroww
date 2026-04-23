"use client";

import { useState, useEffect } from "react";
import { LogOut, Leaf, Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";

type Role = "user" | "admin" | "superadmin";

type Props = {
  children: React.ReactNode;
  initialRole: Role;
};

export default function DashboardLayout({ children, initialRole }: Props) {
  const [role] = useState<Role>(initialRole);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-surface-container-low relative">

      {/* Mobile Topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-outline-variant flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight" style={{ color: "var(--color-primary)" }}>
            SafeGrow
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-surface-container transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        flex flex-col h-screen bg-white border-r border-outline-variant shadow-sm
        fixed top-0 left-0 z-40 w-64 transition-transform duration-300
        lg:sticky lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>

        {/* Top: Brand */}
        <div className="flex-shrink-0 px-5 py-5 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
              <Leaf size={16} className="text-white" />
            </div>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--color-primary)" }}
            >
              SafeGrow
            </span>
          </div>
        </div>

        {/* Middle: Scrollable Sidebar Nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          <Sidebar role={role} onNavigate={() => setIsOpen(false)} />
        </div>

        {/* Bottom: Logout */}
        <div className="flex-shrink-0 px-4 py-4 border-t border-outline-variant">
          <button className="w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error-dim hover:bg-red-50 transition-all duration-150 group">
            <LogOut size={17} className="text-error-dim group-hover:translate-x-0.5 transition-transform duration-150" />
            Logout
          </button>
        </div>

      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Right Side Content */}
      <main className="flex-1 p-4 lg:p-6 bg-surface-container-low overflow-auto pt-20 lg:pt-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}