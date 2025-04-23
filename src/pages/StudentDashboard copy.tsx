import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {
  Bell,
  BookOpen,
  Calendar,
  ChevronRight,
  Home,
  MessageSquare,
  Settings,
  User,
  Users,
  FileText,
  Mic,
  BarChart,
  Shield,
  Database,
  LogOut,
} from "lucide-react";
import { useAuth } from '../hooks/authContext';
import { doSignOut, doDeleteUser } from '../firebase/auth';
import man from '../assets/man.svg';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get current user from auth service
  const { currentUser } = useAuth();

  // Mock data for the dashboard - use current user or fallback
  const student = currentUser || {
    displayName: "Student",
    email: "student@salimbigkas.edu.ph",
    photoURL: "https://via.placeholder.com/150",
    notifications: 8,
  };

  const stats = {
    totalUsers: 1245,
    activeTeachers: 32,
    activeStudents: 1213,
    totalCourses: 48,
  };

  const recentActivities = [
    {
      id: 1,
      type: "user",
      action: "New user registered",
      name: "Zyron Enrique",
      role: "Student",
      time: "10 minutes ago",
    },
    {
      id: 2,
      type: "course",
      action: "New course created",
      name: "Tamang Bigkas at Diin",
      teacher: "Prof. Emily Chen",
      time: "2 hours ago",
    },
    {
      id: 3,
      type: "system",
      action: "System update completed",
      details: "Version 2.4.1",
      time: "Yesterday",
    },
    {
      id: 4,
      type: "user",
      action: "User role changed",
      name: "Cheryl Lou Tinaan",
      role: "Teacher",
      time: "Yesterday",
    },
  ];

  const systemStatus = [
    {
      id: 1,
      name: "Database",
      status: "Operational",
      uptime: "99.9%",
      color: "green",
    },
    {
      id: 2,
      name: "API Services",
      status: "Operational",
      uptime: "99.7%",
      color: "green",
    },
    {
      id: 3,
      name: "Storage",
      status: "Operational",
      uptime: "99.8%",
      color: "green",
    },
    {
      id: 4,
      name: "Authentication",
      status: "Operational",
      uptime: "99.9%",
      color: "green",
    },
  ];

  // Handle tab change with loading animation
  const handleTabChange = (value) => {
    setLoading(true);
    setTimeout(() => {
      setActiveTab(value);
      setLoading(false);
    }, 100);
  };

  // Handle logout
  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      doSignOut()
        .then(() => {
            navigate("/");
        })
        .catch((error) => {
          console.error("Error signing out:", error);
        });
    }, 800);
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    setLoading(true);
    setTimeout(async () => {
      await doDeleteUser(admin.email, admin.password)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    }, 800);
  };

  // Handle navigation to other dashboards
  const handleDashboardNav = (role) => {
    setLoading(true);
    setTimeout(() => {
      navigate(`/${role}`);
    }, 800);
  };

  // Redirect if not authenticated or not an admin
//   useEffect(() => {
//     if (!currentUser) {
//       navigate("/");
//     } else if (currentUser.role !== "admin") {
//       navigate(`/${currentUser.role}`);
//     }
//   }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-white flex">
      {/* {loading && <Loading />} */}
      {/* Sidebar */}
      <div className="w-20 hover:w-64 border-r border-gray-200 flex flex-col justify-between overflow-hidden transition-width duration-300 ease-in-out sticky top-0 h-screen">
        <div className="flex flex-col h-full">
          <div className="relative w-64 px-20 py-4 flex items-center gap-2 border-b-1 border-gray-200">
            <Shield size={34} className="absolute top-auto left-6" />
            <h2 className="whitespace-nowrap font-bold">SalimBigkas Student</h2>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full py-1.5 px-3 rounded-sm hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:shadow-sm focus:drop-shadow-lg ${activeTab === "dashboard" ? "bg-[#2C3E50] text-white" : ""}`}
              onClick={() => handleTabChange("dashboard")}
              autoFocus
            >
              <div className="relative flex items-center gap-3 px-15">
                <Home size={22} className="absolute top-0 left-0"/>
                <span>Dashboard</span>
              </div>
            </button>
            <button 
              variant="ghost" 
              className={`w-full py-1.5 px-3 rounded-sm hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:shadow-sm focus:drop-shadow-lg ${activeTab === "courses" ? "bg-[#2C3E50] text-white" : ""}`}
              onClick={() => handleTabChange("courses")}
            >
              <div className="relative flex items-center gap-3 px-15">
                <BookOpen size={22} className="absolute top-0 left-0" />
                <span className="whitespace-nowrap">My Courses</span>
              </div>
            </button>
            <button
              variant={activeTab === "pronunciation" ? "default" : "ghost"}
              className={`w-full py-1.5 px-3 rounded-sm hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:shadow-sm focus:drop-shadow-lg ${activeTab === "pronunciation" ? "bg-[#2C3E50] text-white" : ""}`}
              onClick={() => handleTabChange("pronunciation")}
            >
              <div className="relative flex items-center gap-3 px-15">
                <Mic size={22} className="absolute top-0 left-0" />
                <span>Pronunciation</span>
              </div>
            </button>
            <div className='border-b-1 mb-2.5 mr-2 w-full border-gray-200'></div>
            <button 
              variant="ghost" 
              className={`w-full py-1.5 px-3 rounded-sm hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:shadow-sm focus:drop-shadow-lg ${activeTab === "settings" ? "bg-[#2C3E50] text-white" : ""}`}
              onClick={() => handleTabChange("settings")}
            >
              <div className="relative flex items-center gap-3 px-15">
                <Settings size={22} className="absolute top-0 left-0" />
                <span>Settings</span>
              </div>
            </button>
            <button
              variant="ghost"
              className="w-full py-1.5 px-3 rounded-sm hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:shadow-sm focus:drop-shadow-lg"
              onClick={() => navigate("/")}
            >
              <div className="relative flex items-center gap-3 px-15">
                <Home size={22} className="absolute top-0 left-0" />
                <span>Home</span>
              </div>
            </button>
            <button
              variant="ghost"
              className="w-full py-1.5 px-3 rounded-sm hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:shadow-sm focus:drop-shadow-lg"
              onClick={handleLogout}
            >
              <div className="relative flex items-center gap-3 px-15">
                <LogOut size={22} className="absolute top-0 left-0" />
                <span>Logout</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-5 border-t border-gray-200">
          <div className="relative flex items-center gap-3 px-15">
            <img
              src={man}
              alt="Student Avatar"
              className="absolute top-auto left-0 h-10 w-10 rounded-full border border-gray-200 shadow-sm"
            />
            <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate">{student.displayName}</p>
                <p className="text-xs">
                  {student.email}
                </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
          <div className="md:hidden">
            <Shield className="h-6 w-6 text-primary" />
          </div>

          <div className="flex items-center gap-4 justify-between w-full">
            <div className="flex gap-4 items-center justify-between">
              <button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {admin.notifications > 0 && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {admin.notifications}
                  </div>
                )}
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
            {activeTab === "dashboard" && (
              <>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Student Dashboard
                  </h1>
                  <button variant="outline" className="flex items-center gap-2 px-3 py-2 text-sm shadow-sm rounded-sm border border-gray-200 hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:drop-shadow-lg">
                    <Calendar className="mr-2 h-4 w-4" />
                    April 2025
                  </button>
                </div>

                {/* Stats divs */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                    <div className="pb-2">
                      <div className="text-sm font-medium">
                        Total Users
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.totalUsers}
                      </div>
                      <p className="text-xs text-gray-500 text-muted-foreground">
                        +24 from last month
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                    <div className="pb-2">
                      <div className="text-sm font-medium">
                        Active Teachers
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.activeTeachers}
                      </div>
                      <p className="text-xs text-gray-500 text-muted-foreground">
                        +3 from last month
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                    <div className="pb-2">
                      <div className="text-sm font-medium">
                        Active Students
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.activeStudents}
                      </div>
                      <p className="text-xs text-gray-500 text-muted-foreground">
                        +21 from last month
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                    <div className="pb-2">
                      <div className="text-sm font-medium">
                        Total Courses
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.totalCourses}
                      </div>
                      <p className="text-xs text-gray-500 text-muted-foreground">
                        +5 from last month
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent activities section */}
                <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                  <div>
                    <h2 className="font-medium">Recent Activities</h2>
                    <h2 className="text-gray-400">Latest actions across the platform</h2>
                  </div>
                  <div className="w-full space-y-4 mt-5">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-3 rounded-lg transition-colors duration-200 hover:bg-gray-50 justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="rounded-full p-2 bg-[#2C3E50] flex items-center justify-center">
                            {activity.type === "user" && (
                              <User size={18} color="white" />
                            )}
                            {activity.type === "course" && (
                              <BookOpen size={18} color="white" />
                            )}
                            {activity.type === "system" && (
                              <Settings size={18} color="white" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium">
                              {activity.action}
                            </h4>
                            <div className="text-xs text-gray-500 text-muted-foreground mt-1">
                              {activity.name && <p>{activity.name}</p>}
                              {activity.role && <p>Role: {activity.role}</p>}
                              {activity.teacher && (
                                <p>Teacher: {activity.teacher}</p>
                              )}
                              {activity.details && <p>{activity.details}</p>}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System status section */}
                <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                  <div>
                    <h2 className="font-medium">System Status</h2>
                    <h2 className="text-gray-400">Current status of platform services</h2>
                  </div>
                  <div className="w-full space-y-4 mt-5">
                    {systemStatus.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between px-6 py-3 rounded-lg border border-gray-200 transition-colors duration-200 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-3 w-3 rounded-full ${
                              service.color === "green" ? "bg-green-500" :
                              service.color === "red" ? "bg-red-500" :
                              service.color === "yellow" ? "bg-yellow-500" : "bg-gray-500"
                            }`}
                          />
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-muted-foreground text-gray-500">
                              Uptime: {service.uptime}
                            </p>
                          </div>
                        </div>
                        <div
                          className="rounded-sm px-2 py-1 text-xs font-medium text-green-500 border border-green-200 bg-green-50"
                        >
                          {service.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === "pronunciation" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Pronunciation Exercises
                  </h1>
                </div>

                <div className="grid gap-6 md:grid-cols-1 flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                  <div>
                    <div>
                      <h2 className="font-medium">Pronunciation Management</h2>
                      <h2 className="text-gray-500">Manage pronunciation exercises across the platform</h2>
                    </div>
                    <div className="space-y-4 mt-5">
                      <p>Pronunciation management interface would go here.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
