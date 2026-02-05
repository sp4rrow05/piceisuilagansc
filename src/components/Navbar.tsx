import { Link } from "react-router-dom"
import { useState } from "react"
import logo from "../assets/pice-logo.png"

type MenuItem = {
  name: string
  path?: string
  children?: { name: string; path: string }[]
}

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const menus: MenuItem[] = [
    { name: "Home", path: "/" },
    {
      name: "About",
      children: [
        { name: "CBL", path: "/about/cbl" },
        { name: "Office of the Chairman", path: "/about/chairman" },
        { name: "Office of the President", path: "/about/president" },
        { name: "Organization Officers", path: "/about/officers" },
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
    { name: "Downloads", path: "/downloads" },
    { name: "FAQs", path: "/faqs" },
  ]

  return (
    <header className="bg-pice-navy text-white shadow-md relative z-50 overflow-visible">
      {/* Watermark Logo (Right Side) */}
      <img
        src={logo}
        alt="PICE Watermark"
        className="absolute right-10 top-1/2 -translate-y-1/2 h-40 md:h-52 opacity-10 pointer-events-none select-none"
      />

      {/* Top Header */}
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
        {/* Main Logo */}
        <img src={logo} alt="PICE Logo" className="h-16 w-auto" />

        <div className="leading-tight">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">
            PICE ISU – ILAGAN SC
          </h1>
          <p className="text-sm text-pice-gray">
            Philippine Institute of Civil Engineers <br />
            Isabela State University – Ilagan Student Chapter
          </p>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-pice-dark relative z-50">
        <ul className="max-w-7xl mx-auto px-6 flex gap-6 items-center h-12">
          {menus.map((menu) => (
            <li
              key={menu.name}
              className="relative"
              onMouseEnter={() => setOpenMenu(menu.name)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              {/* Main Menu */}
              {menu.path ? (
                <Link
                  to={menu.path}
                  className="hover:text-pice-gold font-medium"
                >
                  {menu.name}
                </Link>
              ) : (
                <span className="hover:text-pice-gold font-medium cursor-pointer">
                  {menu.name}
                </span>
              )}

              {/* Dropdown */}
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
    </header>
  )
}
