import {
    BookOpen,
    Calendar,
    Settings,
    User,
} from "lucide-react";

const AdminDashboardTab = ({ Tab }: { Tab: () => string }) => {

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

    return (
        <>
            {Tab() === "dashboard" && (
              <div className="p-6 space-y-6">
                {/* Header section */}
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Dashboard
                  </h1>
                  <button type="button" className="flex items-center gap-2 px-3 py-2 text-sm shadow-sm rounded-lg border border-gray-200 hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:drop-shadow-lg">
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
              </div>
            )}
        </>
    );
}

export default AdminDashboardTab;