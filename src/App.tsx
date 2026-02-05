import { Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

// Public pages
import Home from "./pages/Home"
import Announcements from "./pages/Announcements"
import Downloads from "./pages/Downloads"
import FAQs from "./pages/FAQs"
import CBL from "./pages/About/CBL"
import Chairman from "./pages/About/Chairman"
import President from "./pages/About/President"
import Officers from "./pages/About/Officers"
import ActionPlan from "./pages/AdminFinance/ActionPlan"
import FinancialReport from "./pages/AdminFinance/FinancialReport"
import ProjectsPrograms from "./pages/Accomplishment/ProjectsPrograms"
import Events from "./pages/Accomplishment/Events"

// Auth
import Login from "./pages/login"
import ProtectedRoute from "./components/ProtectedRoute"

// Dashboard
import DashboardLayout from "./dashboard/DashboardLayout"
import Dashboard from "./dashboard/Dashboard"
import AccomplishmentList from "./dashboard/accomplishments/AccomplishmentList"
import AnnouncementList from "./dashboard/announcements/AnnouncementList"
import DownloadList from "./dashboard/downloads/DownloadList"
import FaqList from "./dashboard/faqs/FaqList"
import Account from "./dashboard/Account"
import LoginLogs from "./dashboard/LoginLogs"
import CblUpload from "./dashboard/cbl/CblUpload"
import PresidentCMS from "./dashboard/president/PresidentCMS"
import ChairmanCMS from "./dashboard/chairman/ChairmanCMS"
import OfficerCMS from "./dashboard/officer/OfficerCMS"

function App() {
  const location = useLocation()

  const isDashboard = location.pathname.startsWith("/dashboard")
  const isAuthPage = location.pathname === "/login"

  return (
    <div className="min-h-screen flex flex-col">

      {/* Navbar */}
      {!isDashboard && !isAuthPage && <Navbar />}

      {/* Main Content */}
      <div className="flex-1">
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/about/cbl" element={<CBL />} />
          <Route path="/about/chairman" element={<Chairman />} />
          <Route path="/about/president" element={<President />} />
          <Route path="/about/officers" element={<Officers />} />
          <Route path="/admin-finance/action-plan" element={<ActionPlan />} />
          <Route path="/admin-finance/financial-report" element={<FinancialReport />} />
          <Route path="/accomplishment/projects-programs" element={<ProjectsPrograms />} />
          <Route path="/accomplishment/events" element={<Events />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />

          {/* PROTECTED DASHBOARD */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="accomplishments" element={<AccomplishmentList />} />
            <Route path="announcements" element={<AnnouncementList />} />
            <Route path="downloads" element={<DownloadList />} />
            <Route path="faqs" element={<FaqList />} />
            <Route path="account" element={<Account />} />
            <Route path="logs" element={<LoginLogs />} />
            <Route path="cbl" element={<CblUpload />} />
            <Route path="president" element={<PresidentCMS />} />
            <Route path="chairman" element={<ChairmanCMS />} />
            <Route path="officers" element={<OfficerCMS />} />
          </Route>

        </Routes>
      </div>

      {/* Footer */}
      {!isDashboard && !isAuthPage && <Footer />}

    </div>
  )
}

export default App
