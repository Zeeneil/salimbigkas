import { useState, useEffect, JSX } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Home,
  Settings,
  Users,
  Mic,
  BarChart,
  Database,
  LogOut,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useAuth } from '../hooks/authContext';
import NavButton from "../components/Buttons/NavButton";
import LogoutModal from "../components/Modals/LogoutModal";
import AdminDashboardTab from "../components/AdminDashboard/AdminDashboardTab";
import AdminUsersTab from "../components/AdminDashboard/AdminUsersTab";
import ClassesTab from "../components/Class/ClassesTab";
import AdminAnalyticsTab from "../components/AdminDashboard/AdminAnalyticsTab";
import AdminPronunciationTab from "../components/AdminDashboard/AdminPronunciationTab";
import AdminSystemTab from "../components/AdminDashboard/AdminSystemTab";

import man from '../assets/man.svg';
import salimbigkas from '../assets/salimbigkas-poppins.svg';
import symbol from '../assets/sb-symbol.svg';
import CalendarTab from "../components/Calendar/CalendarTab";

const AdminDashboard = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get current user from auth service
  const { currentUser, role } = useAuth();

  type Tab = "dashboard" | "users" | "classes" | "pronunciation" | "analytics" | "system" | "schedule" | "Messages" | "settings" ;
  
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const NavItems: { tab: Tab; label: string; icon: JSX.Element }[] = [
    { tab: "dashboard", label: "Dashboard", icon: <Home size={22} /> },
    { tab: "users", label: "Users", icon: <Users size={22} /> },
    { tab: "classes", label: "Classes", icon: <BookOpen size={22} /> },
    // { tab: "pronunciation", label: "Pronunciation", icon: <Mic size={22} /> },
    { tab: "analytics", label: "Analytics", icon: <BarChart size={22} /> },
    { tab: "system", label: "System", icon: <Database size={22} /> },
    { tab: "schedule", label: "Schedule", icon: <Calendar size={22} /> },
    { tab: "Messages", label: "Messages", icon: <MessageSquare size={22} /> },
  ];

  // Handle tab change with loading animation
  const handleTabChange = (tab: Tab) => {
    if (tab === activeTab) return; // Prevent reloading the same tab
    setLoading(true);
    setTimeout(() => {
      setActiveTab(tab);
      setLoading(false);
    }, 100);
  };

  // Handle navigation to other dashboards
  const handleDashboardNav = (role: any) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/${role}`);
    }, 800);
  };

  const DashboardNav = ({
    onClick,
    label,
  }: {
    onClick: () => void;
    label: string;
  }) => {
    return (
      <button
        type="button"
        className="px-3 py-2 text-sm shadow-sm rounded-lg border border-gray-200 hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:drop-shadow-lg"
        onClick={onClick}
      >
        {label}
      </button>
    );
  };

  // Handle logout
  const openLogoutModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      navigate("/home");
    } else if (role !== "Admin") {
      navigate(`/${role}`);
    }
  }, [currentUser, role, navigate, loading]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'; // Reset scrolling on unmount
    };
  }, []);

  return (
    <div className="bg-white flex rounded-lg h-[100vh] max-h-[100vh]">
      {/* {loading && <Loading />} */}
      {/* Sidebar */}
      <motion.div
        className="w-20 border-r border-gray-200 flex flex-col justify-between overflow-hidden"
        initial={{ x: -100, width: 80 }}
        animate={{ x: 0 }}
        whileHover={{ width: 256 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="flex flex-col">
          <div className="relative w-64 px-22 py-5 flex items-center gap-2 border-b-1 border-gray-200">
            <img src={symbol} alt="Sample Icon" className="size-10 absolute top-auto left-5" />
            <h2 className="whitespace-nowrap font-extrabold">ADMIN</h2>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {NavItems.map((item) => (
              <NavButton
                key={item.tab}
                label={item.label}
                icon={item.icon}
                isActive={activeTab === item.tab}
                onClick={() => handleTabChange(item.tab)}
              />
            ))}
            <div className='border-b-1 mb-2.5 mr-2 w-full border-gray-200'></div>
            <NavButton
              label="Settings"
              icon={<Settings size={22} />}
              isActive={activeTab === "settings"}
              onClick={() => handleTabChange("settings")}
            />
            <NavButton
              label="Home"
              icon={<Home size={22} />}
              onClick={() => navigate("/")}
            />
            <NavButton
              label="Logout"
              icon={<LogOut size={22} />}
              onClick={openLogoutModal}
            />
          </nav>
        </div>

        <div className="p-5 border-t border-gray-200">
          <div className="relative flex items-center gap-3 px-15">
            <img
              src={currentUser?.photoURL || "https://via.placeholder.com/150"}
              alt="Admin Avatar"
              className="absolute top-auto left-0 h-10 w-10 rounded-full border border-gray-200 object-fill"
            />
            <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">{currentUser?.displayName}</p>
                <p className="text-xs truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-[100vh] max-h-[100vh]">
        {/* Header */}
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-5 flex-shrink-0">
          <div className="md:hidden">
            {/* <Shield className="h-6 w-6 text-primary" /> */}
          </div>

          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex gap-6 justify-center items-center">
              <img
                src={salimbigkas}
                alt="Salimbigkas Logo"
                className="w-50"
              />
              {/* <div className="hidden md:flex items-center gap-2">
                <DashboardNav
                  onClick={() => handleDashboardNav("teacher")}
                  label="Teacher View"
                />
                <DashboardNav
                  onClick={() => handleDashboardNav("student")}
                  label="Student View"
                />
              </div> */}
            </div>
            <div className="flex gap-4 items-center justify-between">
              <button
                title="Notifications"
                type="button"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center">
                  <span className="relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                  </span>
                </span>
              </button>
              <img
                src={man}
                alt="Admin Avatar"
                className="h-10 w-10 rounded-full border border-gray-200 shadow-sm hover:cursor-pointer"
              />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-white">
          <motion.div 
            className="max-w-8xl mx-auto space-y-6 overflow-visible"
            key={activeTab} // Add key to trigger re-render on tab change
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >

            {/* // Admin Dashboard Tabs */}
            <AdminDashboardTab Tab={() => (activeTab === "dashboard" ? "dashboard" : "")} />

            {/* // Users Tab */}
            <AdminUsersTab Tab={() => (activeTab === "users" ? "users" : "")} />

            {/* // Courses Tab */}
            <ClassesTab Tab={() => (activeTab === "classes" ? "classes" : "")} />

            {/* // Analytics Tab */}
            <AdminAnalyticsTab Tab={() => (activeTab === "analytics" ? "analytics" : "")} />
              
            {/* // Schedule Tab */}
            <CalendarTab Tab={() => (activeTab === "schedule" ? "schedule" : "")} />
            
            {/* // Pronunciation Tab */}
            {/* <AdminPronunciationTab Tab={() => (activeTab === "pronunciation" ? "pronunciation" : "")} /> */}
            
            {/* // System Tab */}
            <AdminSystemTab Tab={() => (activeTab === "system" ? "system" : "")} />

          </motion.div>
        </main>
      </div>
      {isModalOpen && (
        <div className={'fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center'}>
          <LogoutModal isOpen={isModalOpen} onClose={closeModal}/>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
