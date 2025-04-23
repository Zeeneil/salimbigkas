import { useState, useEffect, JSX } from "react"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Calendar,
  Home,
  Settings,
  User,
  Users,
  Mic,
  BarChart,
  Shield,
  Database,
  LogOut,
} from "lucide-react";
import { useAuth } from '../hooks/authContext';
import { doDeleteUser } from '../firebase/auth';
import LogoutModal from "../components/Modals/LogoutModal";
import AdminDashboardTab from "../components/AdminDashboard/AdminDashboardTab";
import AdminUsersTab from "../components/AdminDashboard/AdminUsersTab";
import AdminPronunciationTab from "../components/AdminDashboard/AdminPronunciationTab";
import AdminSystemTab from "../components/AdminDashboard/AdminSystemTab";

import man from '../assets/man.svg';
import salimbigkas from '../assets/salimbigkas.svg';

const AdminDashboard = () => {

  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Get current user from auth service
  const { currentUser, role } = useAuth();

  type Tab = "dashboard" | "users" | "courses" | "pronunciation" | "calendar" | "system" | "settings";
  
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  const NavItems: { tab: Tab; label: string; icon: JSX.Element }[] = [
    { tab: "dashboard", label: "Dashboard", icon: <Home size={22} /> },
    { tab: "users", label: "Users", icon: <Users size={22} /> },
    { tab: "courses", label: "Courses", icon: <BookOpen size={22} /> },
    { tab: "pronunciation", label: "Pronunciation", icon: <Mic size={22} /> },
    { tab: "calendar", label: "Analytics", icon: <BarChart size={22} /> },
    { tab: "system", label: "System", icon: <Database size={22} /> },
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

  // Navigation button component
  const NavButton = ({
    label,
    icon,
    onClick,
    isActive = false,
  }: {
    label: string;
    icon: JSX.Element;
    onClick: () => void;
    isActive?: boolean;
  }) => (
    <motion.button
      className={`w-full py-1.5 px-3 rounded-sm focus:text-white focus:bg-[#2C3E50] focus:shadow-sm focus:drop-shadow-lg ${
        isActive ? "bg-[#2C3E50] text-white" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileFocus={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
    >
      <div className="relative flex items-center gap-3 px-15">
        <div className="absolute top-0 left-0">{icon}</div>
        <span>{label}</span>
      </div>
    </motion.button>
  );

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
        className="px-3 py-2 text-sm shadow-sm rounded-sm border border-gray-200 hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:drop-shadow-lg"
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

  // Handle delete account
  const handleDeleteAccount = () => {
    setLoading(true);
    setTimeout(async () => {
      await doDeleteUser(currentUser?.email || "", password)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    }, 800);
  };

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      navigate("/home");
    } else if (role !== "admin") {
      navigate(`/${role}`);
    }
  }, [currentUser, role, navigate, loading]);

  return (
    <div className="min-h-screen bg-white flex rounded-lg">
      {/* {loading && <Loading />} */}
      {/* Sidebar */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <motion.div
        className="w-20 hover:w-64 border-r border-gray-200 flex flex-col justify-between overflow-hidden transition-width duration-300 ease-in-out sticky top-0 h-screen"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <div className="flex flex-col">
          <div className="relative w-64 px-22 py-4 flex items-center gap-2 border-b-1 border-gray-200">
            <Shield size={34} className="absolute top-auto left-6" />
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="md:hidden">
            <Shield className="h-6 w-6 text-primary" />
          </div>

          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex gap-6 justify-center items-center">
              <img
                src={salimbigkas}
                alt="Salimbigkas Logo"
                className="w-50"
              />
              <div className="hidden md:flex items-center gap-2">
                <DashboardNav
                  onClick={() => handleDashboardNav("teacher")}
                  label="Teacher View"
                />
                <DashboardNav
                  onClick={() => handleDashboardNav("student")}
                  label="Student View"
                />
              </div>
            </div>
            <div className="flex gap-4 items-center justify-between">
              <button type="button" className="relative">
                <Bell className="h-5 w-5" />
                {/* {currentUser?.notifications > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {currentUser?.notifications}
                  </div>
                )} */}
              </button>
              <img
                src={man}
                alt="Admin Avatar"
                className="h-10 w-10 rounded-full border border-gray-200 shadow-sm hover:cursor-pointer"
              />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-8xl mx-auto space-y-6">

            {/* // Admin Dashboard Tabs */}
            <AdminDashboardTab Tab={() => (activeTab === "dashboard" ? "dashboard" : "")} />

            {/* // Users Tab */}
            <AdminUsersTab Tab={() => (activeTab === "users" ? "users" : "")} />
            
            {/* // Pronunciation Tab */}
            <AdminPronunciationTab Tab={() => (activeTab === "pronunciation" ? "pronunciation" : "")} />
            
            {/* // System Tab */}
            <AdminSystemTab Tab={() => (activeTab === "system" ? "system" : "")} />

          </div>
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
