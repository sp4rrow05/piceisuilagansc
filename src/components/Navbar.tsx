import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/pice-logo.png";
import { Menu, X, ChevronDown } from "lucide-react";

type MenuItem = {
  name: string;
  path?: string;
  children?: { name: string; path: string }[];
};

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menus: MenuItem[] = [
    { name: "Home", path: "/" },
    {
      name: "About",
      children: [
        { name: "Constitution & By-Laws", path: "/about/cbl" },
        { name: "Office of the Executive Officer", path: "/about/chairman" },
        { name: "Office of the College Dean", path: "/about/president" },
        { name: "Office of the Department Chairperson", path: "/about/chairperson" },
        { name: "The PICE-ISU-I SC Officers", path: "/about/officers" },
      ],
    },
    {
      name: "Admin & Finance",
      children: [
        { name: "Action Plan", path: "/admin-finance/action-plan" },
        { name: "Financial Report", path: "/admin-finance/financial-report" },
      ],
    },
    {
      name: "Accomplishment",
      children: [
        { name: "Projects and Programs", path: "/accomplishment/projects-programs" },
        { name: "Events", path: "/accomplishment/events" },
      ],
    },
    { name: "Announcements", path: "/announcements" },
    {
      name: "CE Files",
      children: [
        { name: "CE Library", path: "/ce-library" },
        { name: "Downloads", path: "/downloads" },
      ],
    },
    { name: "FAQs", path: "/faqs" },
  ];

  const closeMobile = () => {
    setMobileOpen(false);
    setOpenMenu(null);
  };

  return (
    <header className="bg-pice-navy text-white shadow-md relative z-50">
      {/* ===== TOP HEADER ===== */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4 overflow-hidden">
        
        {/* Watermark */}
        <img
          src={logo}
          alt="PICE Watermark"
          className="absolute right-10 top-1/2 -translate-y-1/2 h-40 md:h-52 opacity-10 pointer-events-none select-none -z-10"
        />

        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="PICE Logo" className="h-14 md:h-16 w-auto" />

          <div className="leading-tight">
            <h1 className="text-lg md:text-2xl font-bold tracking-wide">
              PICE ISU – ILAGAN SC
            </h1>
            <p className="hidden md:block text-sm text-pice-gray">
              Philippine Institute of Civil Engineers <br />
              Isabela State University – Ilagan Student Chapter
            </p>
          </div>
        </div>

        {/* ===== MOBILE TOGGLE ===== */}
        <button
          className="md:hidden p-2 rounded hover:bg-white/10"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ===== DESKTOP NAV ===== */}
      <nav className="bg-pice-dark relative z-50 hidden md:block">
        <ul className="max-w-7xl mx-auto px-6 flex gap-6 items-center h-12">
          {menus.map((menu) => (
            <li
              key={menu.name}
              className="relative"
              onMouseEnter={() => setOpenMenu(menu.name)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              {menu.path ? (
                <Link to={menu.path} className="hover:text-pice-gold font-medium">
                  {menu.name}
                </Link>
              ) : (
                <span className="hover:text-pice-gold font-medium cursor-pointer flex items-center gap-1">
                  {menu.name}
                  <ChevronDown size={14} />
                </span>
              )}

              {menu.children && openMenu === menu.name && (
                <div className="absolute top-full left-0 bg-white text-black shadow-lg rounded-md w-64 py-2 z-[9999]">
                  {menu.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.path}
                      className="block px-4 py-2 hover:bg-pice-orange"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* ===== MOBILE DRAWER ===== */}
      {mobileOpen && (
        <div className="md:hidden bg-pice-dark border-t border-white/10">
          <div className="flex flex-col divide-y divide-white/10">
            {menus.map((menu) => (
              <div key={menu.name}>
                {menu.path ? (
                  <Link
                    to={menu.path}
                    onClick={closeMobile}
                    className="block px-4 py-3 hover:bg-white/10"
                  >
                    {menu.name}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === menu.name ? null : menu.name)
                      }
                      className="w-full flex justify-between items-center px-4 py-3 hover:bg-white/10"
                    >
                      {menu.name}
                      <ChevronDown size={16} />
                    </button>

                    {menu.children && openMenu === menu.name && (
                      <div className="bg-black/20">
                        {menu.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.path}
                            onClick={closeMobile}
                            className="block px-8 py-3 text-sm hover:bg-white/10"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
