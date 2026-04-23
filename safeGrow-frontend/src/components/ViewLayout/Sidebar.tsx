"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Users,
  FileBarChart2,
  ShieldCheck,
  Settings,
  Activity,
  BarChart2,
  Bell,
  Bot,
  Briefcase,
  Cpu,
  LineChart,
  ListOrdered,
  Star,
  Wallet,
  Clock7,
  UserCheck2,
  Key,
  Layers,
  Server,
  Shield,
  TrendingUp,
} from "lucide-react";

type Role = "user" | "admin" | "superadmin";

type Props = {
  role: Role;
  onNavigate?: () => void;
};

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

const menu: Record<Role, MenuItem[]> = {
  user: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },

    // Trading Core
    {
      name: "Positions",
      path: "/positions",
      icon: <Briefcase size={18} />,
    },
    {
      name: "Trade History",
      path: "/trades",
      icon: <Activity size={18} />,
    },

    // Algo / Automation
    {
      name: "Strategies",
      path: "/strategies",
      icon: <Cpu size={18} />,
    },

    // Funds & Reports
    {
      name: "Funds",
      path: "/funds",
      icon: <Wallet size={18} />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <BarChart2 size={18} />,
    },

    // Utilities
    {
      name: "Settings",
      path: "/settings",
      icon: <Settings size={18} />,
    },
  ],
  admin: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <Users size={18} />,
    },
    {
      name: "KYC Verification",
      path: "/admin/kyc",
      icon: <UserCheck2 size={18} />,
    },

    // Trading Monitoring
    {
      name: "All Orders",
      path: "/admin/orders",
      icon: <ListOrdered size={18} />,
    },
    {
      name: "All Positions",
      path: "/admin/positions",
      icon: <Briefcase size={18} />,
    },

    // Funds Control
    {
      name: "Fund Requests",
      path: "/admin/funds",
      icon: <Wallet size={18} />,
    },
    // Reports
    {
      name: "Reports",
      path: "/admin/reports",
      icon: <BarChart2 size={18} />,
    },

    // Settings
    {
      name: "Settings",
      path: "/admin/settings",
      icon: <Settings size={18} />,
    },
  ],
  superadmin: [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Manage Admins",
      path: "/superadmin/admins",
      icon: <Shield size={18} />,
    },

    // User System
    {
      name: "All Users",
      path: "/superadmin/users",
      icon: <Users size={18} />,
    },

    // Broker / API Control (OpenAlgo Core)
    {
      name: "Broker Config",
      path: "/superadmin/brokers",
      icon: <Server size={18} />,
    },
    {
      name: "API Keys",
      path: "/superadmin/api-keys",
      icon: <Key size={18} />,
    },

    // Trading System Control
    {
      name: "Global Orders",
      path: "/superadmin/orders",
      icon: <ListOrdered size={18} />,
    },
    {
      name: "System Positions",
      path: "/superadmin/positions",
      icon: <Briefcase size={18} />,
    },
    // Financial Control
    {
      name: "Revenue",
      path: "/superadmin/revenue",
      icon: <TrendingUp size={18} />,
    },
    {
      name: "Subscriptions",
      path: "/superadmin/subscriptions",
      icon: <Layers size={18} />,
    },

    // System Monitoring
    {
      name: "Server Status",
      path: "/superadmin/system",
      icon: <Activity size={18} />,
    },
  ],
};

export default function Sidebar({ role, onNavigate }: Props) {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white px-3 py-4 space-y-1">
      {menu[role].map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm 
              transition-all duration-150
              ${
                isActive
                  ? "bg-primary-container font-medium text-primary"
                  : "text-[#7c7e8c] font-semibold tracking-wide hover:bg-surface-container hover:text-on-surface"
              }
            `}
          >
            <span
              className={isActive ? "text-primary" : "text-on-surface-variant"}
            >
              {item.icon}
            </span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
