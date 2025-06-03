import {
    BookOpen,
    Calendar,
    ChevronRight,
    Users,
} from "lucide-react";

const TeacherDashboardTab = ({ Tab }: { Tab: () => string }) => {

    const stats = {
        activeStudents: 87,
        coursesManaged: 4,
        averageScore: 78, // percentage
    };

    const upcomingSessions = [
        {
          id: 1,
          title: "Pagkilala sa Alpabeto",
          date: "Today",
          time: "2:00 PM",
          students: 24,
        },
        {
          id: 2,
          title: "Pangngalan at Pandiwa",
          date: "Tomorrow",
          time: "10:00 AM",
          students: 18,
        },
        {
          id: 3,
          title: "Pagkilala sa Alpabeto",
          date: "Apr 18",
          time: "1:30 PM",
          students: 15,
        },
    ];
    
    const recentAssignments = [
        {
          id: 1,
          title: "Unang Pagususlit",
          course: "Pagkilala sa Alpabeto",
          submissions: 22,
          pending: 2,
        },
        {
          id: 2,
          title: "Pandiwa'y iyong itama",
          course: "Pangngalan at Pandiwa",
          submissions: 15,
          pending: 3,
        },
        {
          id: 3,
          title: "Bigkasin ang sampung salita",
          course: "Tamang Bigkas at Diin",
          submissions: 12,
          pending: 3,
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
                    <div className="grid gap-4 md:grid-cols-3">
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
                                +5 students from last month
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                        <div className="pb-2">
                            <div className="text-sm font-medium">
                                Courses Managed
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {stats.coursesManaged}
                            </div>
                            <p className="text-xs text-gray-500 text-muted-foreground">
                                2 active, 2 upcoming
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="pb-2">
                                <div className="text-sm font-medium">
                                Average Student Score
                                </div>
                            </div>
                            <div className="w-full">
                                <div className="text-2xl font-bold">
                                    {stats.averageScore}%
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div
                                        className="bg-[#2C3E50] h-2 rounded-full"
                                        style={{ width: `${stats.averageScore}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                        {/* Upcoming sessions section */}
                        <div className="lg:col-span-4 flex flex-col text-left items-start p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                            <div className="w-full">
                                <div className="flex items-center justify-between">
                                    <h2 className="font-medium">Upcoming Sessions</h2>
                                    <button type="button" value="ghost" className="gap-1 px-3 py-2 flex items-center text-xs rounded-sm hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:drop-shadow-lg">
                                        View All <ChevronRight size={16} />
                                    </button>
                                </div>
                                <h2 className="text-gray-500 text-sm mt-2">Your scheduled teaching sessions</h2>
                            </div>
                            <div className="space-y-4 w-full mt-5">
                                {upcomingSessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="flex items-center justify-between p-3 border rounded-lg border-gray-200"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full p-2 bg-[#2C3E50] flex items-center justify-center">
                                                <BookOpen size={18} color="white" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium">{session.title}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-xs text-gray-400">
                                                        {session.date}
                                                    </p>
                                                    <span className="text-xs text-gray-400">
                                                        •
                                                    </span>
                                                    <p className="text-xs text-gray-400">
                                                        {session.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <Users size={14} />
                                                <span className="text-sm text-muted-foreground">
                                                    {session.students}
                                                </span>
                                            </div>
                                            <button className="flex items-center gap-1 px-3 py-2 text-xs shadow-sm rounded-xs border border-gray-200 hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:drop-shadow-lg">
                                                Prepare
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Recent activities section */}
                        <div className="flex flex-col lg:col-span-3 text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                            <div>
                                <h2 className="font-medium">Recent Assignments</h2>
                                <h2 className="text-gray-400">Track student submissions</h2>
                            </div>
                            <div className="w-full space-y-4 mt-5">
                                {recentAssignments.map((assignment) => (
                                    <div
                                        key={assignment.id}
                                        className="p-4 border border-gray-200 rounded-lg space-y-2 justify-between"
                                    >
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium">
                                                {assignment.title}
                                            </h4>
                                            <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-sm border border-gray-200">
                                                {assignment.pending} pending
                                            </div>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {assignment.course}
                                        </p>
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm">
                                            <span className="font-medium">
                                                {assignment.submissions}
                                            </span>{" "}
                                            <span className="text-gray-500">
                                                submissions
                                            </span>
                                            </div>
                                            <button type="button" className="flex items-center gap-1 px-3 py-2 text-xs rounded-xs hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:drop-shadow-lg">
                                                Review
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TeacherDashboardTab;