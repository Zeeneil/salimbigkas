import React, { useEffect, useState } from "react";
import { dogetAllUsers } from "../../api/functions";
import man from '../../assets/man.svg';

const AdminUsersTab = ({ Tab }: { Tab: () => string }) => {

    // const [users, setUsers] = useState<any[]>([]);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const usersData = await dogetAllUsers();
    //             setUsers(usersData);
    //         } catch (error) {
    //             console.error("Error fetching users:", error);
    //         } finally {
    //             setUsers([]); // Clear users after fetching
    //         }
    //     };
    //     fetchUsers();
    // }, []);
    
    return (  
        <>
            {Tab() === "users" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold tracking-tight">
                    User Management
                  </h1>
                </div>

                <div className="grid gap-6 md:grid-cols-1 flex-col text-left items-start justify-between p-6 rounded-lg bg-white shadow-sm border border-gray-200">
                  <div className="space-y-2">
                    <h2 className="font-medium">All Users</h2>
                    <h2 className="text-sm text-gray-500">Manage users and their roles</h2>
                    <div className="grid gap-6 md:grid-cols-1 flex-col text-left items-center justify-between">
                      <div className="space-y-4 mt-5">
                        {/* {users.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
                          >
                            <div className="relative flex items-center gap-3 px-15">
                              <img
                                  src={man}
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
                        ))} */}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="space-y-4">
                      <p>User management interface would go here.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </>
    );
}

export default AdminUsersTab;