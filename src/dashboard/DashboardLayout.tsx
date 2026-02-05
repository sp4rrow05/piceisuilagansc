import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Trophy,
  Megaphone,
  Download,
  HelpCircle,
  Settings,
  LogOut,
  FileText,
  UserStar,
  UserRoundPen,
  NotepadText,
  Network,
} from "lucide-react";
import axios from "axios";
import logo from "../assets/pice-logo.png";
export default function DashboardLayout() {
  const logout = async () => {
    await axios.get("/pice-backend/api/?module=auth&action=logout", {
      withCredentials: true,
    });

    window.location.href = "/login";
  };

  const menu = [
    {
      label: "Dashboard",
      to: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "President CMS",
      to: "/dashboard/president",
      icon: <UserStar size={18} />,
    },
    {
      label: "Chairman CMS",
      to: "/dashboard/chairman",
      icon: <UserRoundPen size={18} />,
    },
    {
      label: "Officer CMS",
      to: "/dashboard/officers",
      icon: <Network size={18} />,
    },
    { label: "CBL Upload", to: "/dashboard/cbl", icon: <FileText size={18} /> },
    {
      label: "Accomplishments",
      to: "/dashboard/accomplishments",
      icon: <Trophy size={18} />,
    },
    {
      label: "Announcements",
      to: "/dashboard/announcements",
      icon: <Megaphone size={18} />,
    },
    {
      label: "Downloads",
      to: "/dashboard/downloads",
      icon: <Download size={18} />,
    },
    { label: "FAQs", to: "/dashboard/faqs", icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-pice-navy text-white flex flex-col">
        {/* Logo / Title */}
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold tracking-wide">PICE Admin</h2>
          <p className="text-xs text-white/60">Management Panel</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition
                ${
                  isActive
                    ? "bg-pice-gold text-pice-navy font-semibold shadow"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <img
            src={logo}
            alt="Pice Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/dashboard/account"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            <Settings size={18} />
            Account
          </Link>
          <Link
            to="/dashboard/logs"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition"
          >
            <NotepadText size={18} />
            Login Logs
          </Link>
          {/* <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-400 transition"
          >
            <LogOut size={18} />
            Logout
          </button> */}
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Top Bar */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-6">
          <div className="text-sm text-gray-500">
            PICE ISU Ilagan Student Chapter
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 h-0 min-h-0 overflow-y-auto p-8">
          
            <Outlet />
        </main>
      </div>
    </div>
  );
}
