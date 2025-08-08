import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';

// Layout component that includes the sidebar and main content area
function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <MobileHeader />
      
      {/* Main content area */}
      <main className="flex-1 pt-16 overflow-y-auto md:ml-64 md:pt-0">
        <div className="p-6">
          <Outlet /> {/* This renders the matched child route */}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (no sidebar) */}
        <Route path="/" element={<Login />} />
        
        {/* Authenticated routes (with sidebar) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          {/* Add more authenticated routes here */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}