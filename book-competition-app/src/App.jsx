import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy-loaded components
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Sidebar = lazy(() => import("./components/Sidebar"));
const MobileHeader = lazy(() => import("./components/MobileHeader"));
const CompetitionDetail = lazy(() => import("./components/CompetitionDetail"));
const Register = lazy(() => import("./pages/Register"));
const CompetitionsPage = lazy(() => import("./pages/Dashboard"));
const About = lazy(() => import("./pages/About"));
const Achievements = lazy(() => import("./pages/Achievements"));
const InboxPage = lazy(() => import("./pages/InboxPage"))

function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <MobileHeader />

      {/* Main content area */}
      <main className="flex-1 pt-16 overflow-y-auto md:ml-64 md:pt-0">
        <div className="p-6">
          <Outlet /> {/* Renders the matched child route */}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Authenticated routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/competitions/:id" element={<CompetitionDetail />} />
            <Route path="/competitions" element={<CompetitionsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/inbox" element={< InboxPage />} />
            <Route path="/competitions/register/:id" element={<CompetitionsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}