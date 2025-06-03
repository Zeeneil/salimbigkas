import woman from '../../assets/woman.svg';

const TeacherStudentsTab = ({ Tab }: { Tab: () => string }) => {

    return (
        <>  
            {Tab() === "students" && (
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">
                            Student Management
                        </h1>
                    </div>
                    <div className="grid gap-6 md:grid-cols-1 flex-col text-left items-center justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                        <div className="flex flex-col justify-between">
                            <h2 className="font-medium">Student List</h2>
                            <h2 className="text-sm text-gray-500">Manage your students and their progress</h2>
                        </div>
                        <div className="grid gap-6 md:grid-cols-1 flex-col text-left items-center justify-between">
                            <div className="space-y-4">
                                {[
                                    {
                                    id: 1,
                                    name: "Alex Johnson",
                                    email: "alex.j@example.com",
                                    progress: 78,
                                    avatar:
                                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
                                    },
                                    {
                                    id: 2,
                                    name: "Jamie Smith",
                                    email: "jamie.s@example.com",
                                    progress: 92,
                                    avatar:
                                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie",
                                    },
                                    {
                                    id: 3,
                                    name: "Taylor Wilson",
                                    email: "taylor.w@example.com",
                                    progress: 65,
                                    avatar:
                                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor",
                                    },
                                ].map((student) => (
                                    <div
                                    key={student.id}
                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                                    >
                                        <div className="relative flex items-center gap-3 px-15">
                                            <img
                                                src={woman}
                                                alt="Teacher Avatar"
                                                className="absolute top-auto left-0 h-10 w-10 rounded-full border border-gray-200 shadow-sm"
                                            />
                                            <div>
                                            <h4 className="font-medium">{student.name}</h4>
                                            <p className="text-sm text-muted-foreground">
                                                {student.email}
                                            </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                            <div className="font-medium">
                                                {student.progress}%
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Progress
                                            </div>
                                            </div>
                                            <button type="button" className="flex items-center gap-1 px-3 py-2 text-xs rounded-xs shadow-xs border border-gray-200 hover:bg-gray-100 focus:text-white focus:bg-[#2C3E50] focus:drop-shadow-lg">
                                                View Details
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

export default TeacherStudentsTab;