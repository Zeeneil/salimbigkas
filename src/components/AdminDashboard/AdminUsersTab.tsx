import { useEffect, useState } from "react";
import { X, MailCheck, MailX, Funnel, Calendar, Ellipsis, SquarePen, Trash2, UserRound, UserRoundPlus, UserLock, Search, School, ChevronDown } from "lucide-react";
import { dogetAllUsers, doSetUserStatus, doDeleteUser } from "../../api/functions";
import { useAuth } from "../../hooks/authContext";
import { toast } from "react-toastify";
import CustomToast from "../Toast/CustomToast";
import { motion } from "framer-motion";
import Popup from 'reactjs-popup';
import man from '../../assets/man.svg';
import AddUser from "./AddUser";
import UpdateUser from "./UpdateUser";
import DeleteModal from "../Modals/DeleteModal";
import { formatUserDate, filterAndSortUsers, paginate, useLongPress } from "../../utils/helpers";
import { SpinLoadingColored } from "../Icons/icons";

const AdminUsersTab = ({ Tab }: { Tab: () => string }) => {

  const { currentUser, role } = useAuth();
  const [userStatus, setUserStatus] = useState(false); // Control SetUserStatus visibility
  const [showadduser, setShowAddUser] = useState(false); // Control AddUser visibility
  const [showUpdateUser, setShowUpdateUser] = useState(false); // Control EditUser visibility
  const [selectedUserData, setSelectedUserData] = useState<any | null>(null); // Store selected user data for editing
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // Track selected user IDs
  const [showCheckboxes, setShowCheckboxes] = useState(false); // Control checkbox visibility
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control DeleteUserModal visibility

  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(10); // Default to 10 users per page

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>(""); // For role filter
  const [sortOrder, setSortOrder] = useState<string>("asc"); // For alphabetical order
  const [emailVerified, setEmailVerified] = useState<string>(""); // For email verified filter
  const [statusFilter, setStatusFilter] = useState<string>(""); // For status filter
  
  const fetchAndSetUsers = async () => {
    try {
      const response = await dogetAllUsers(currentUser?.uid || "", role || "") as any;
      setUsers(response?.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  // UseEffect for initial fetch
  useEffect(() => {
    fetchAndSetUsers(); // Fetch users on component mount
  }, [currentUser, role]);

  const handleStatusChange = async (uid: string, status: boolean) => {
    try {
      setUserStatus(true); // Show loading state
      const response = await doSetUserStatus(currentUser?.uid || "", uid, status) as any;
      if (response?.success) {
        toast.success(<CustomToast title="Congratulation!" subtitle="User status change successfully." />);
        fetchAndSetUsers(); // Refresh user list
      } else {
        toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to change user status. Please try again." />);
      }
    } catch (error) {
      toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to update user status. Please try again." />);
    } finally {
      setUserStatus(false); // Hide loading state
    }
  }

  const filtered = filterAndSortUsers(users, searchQuery, selectedRole, sortOrder, emailVerified, statusFilter);
  const { paged, totalPages, safePage } = paginate(filtered, currentPage, usersPerPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRole(role);
    setCurrentPage(1);
  };

  const handleSortOrder = (order: string) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleEmailVerifiedFilter = (verified: string) => {
    setEmailVerified(verified);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [safePage, currentPage]);
  
  const handleRowHold = () => {
    setShowCheckboxes(true); // Show checkboxes when a row is held
  };

  const longPressHandlers = useLongPress(handleRowHold);

  return (
    <>
      {showadduser ? (
        <AddUser setShowAddUser={() => setShowAddUser(!showadduser)} callFetchUsers={() => fetchAndSetUsers()}/>
      ) : showUpdateUser ? (
        <UpdateUser
          setShowUpdateUser={() => setShowUpdateUser(!showUpdateUser)}
          callFetchUsers={() => fetchAndSetUsers()}
          userData={selectedUserData}
        />
      ) : (
        <>
          {Tab() === "users" && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">
                  User Management
                </h1>
                <div className="flex items-center space-x-4 p-2">
                  <div className="relative flex items-center">
                    <button
                      title="Search"
                      type="button"
                      className="absolute left-1 p-2 text-gray-500 hover:text-[#2C3E50]"
                      onClick={(e) => handleSearch(e.currentTarget.value)}
                    >
                      <Search size={20} />
                    </button>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-10 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2C3E50]"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <Popup
                      trigger={
                        <button
                          title="Filter"
                          aria-label="Filter"
                          type="button"
                          className="flex px-4 py-2 text-lg font-bold items-center border-1 border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition duration-200 ease-in-out"
                          tabIndex={0}
                        >
                          <Funnel size={20} className="mr-2" />
                          Filter
                        </button>
                      }
                      position="bottom right"
                      on="click"
                      closeOnDocumentClick
                      arrow={false}
                      contentStyle={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}
                      overlayStyle={{ background: 'rgba(0,0,0,0.05)' }}
                      nested
                      lockScroll
                      children={((close: () => void) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="flex flex-col bg-white shadow-xl rounded-lg mt-2 p-2 border border-gray-200 min-w-[160px] focus:outline-none"
                            tabIndex={-1}
                            onKeyDown={e => {
                                if (e.key === 'Escape') close();
                            }}
                        >
                          <div className="p-4 space-y-4">
                            <div className="mt-2 mb-2 text-left relative">
                              <select
                                title="Filter by role"
                                className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none appearance-none ${selectedRole? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                value={selectedRole}
                                onChange={(e) => handleRoleFilter(e.target.value)}
                              > 
                                <option value="">{selectedRole ? 'All' : ''}</option>
                                <option value="Admin">Admin</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                              </select>
                              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                  <ChevronDown size={20} />
                              </span>
                              <label 
                                className={`absolute text-lg font-medium left-3 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${selectedRole ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                htmlFor="Filter by role"
                              >
                                Role
                              </label>
                            </div>
                            <div className="mt-4 mb-2 text-left relative">
                              <select
                                title="Filter by email verified"
                                className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none appearance-none ${emailVerified ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                value={emailVerified}
                                onChange={(e) => handleEmailVerifiedFilter(e.target.value)}
                              >
                                <option value="">{emailVerified ? 'All' : ''}</option>
                                <option value="verified">Verified</option>
                                <option value="unverified">Unverified</option>
                              </select>
                              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                  <ChevronDown size={20} />
                              </span>
                              <label 
                                className={`absolute text-lg font-medium left-3 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${emailVerified ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                htmlFor="Filter by email verified"
                              >
                                Email
                              </label>
                            </div>
                            <div className="mt-4 mb-2 text-left relative">
                              <select
                                title="Filter by status"
                                className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none appearance-none ${statusFilter ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                value={statusFilter}
                                onChange={(e) => handleStatusFilter(e.target.value)}
                              >
                                <option value="">{statusFilter ? 'All' : ''}</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </select>
                              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                  <ChevronDown size={20} />
                              </span>
                              <label 
                                className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${statusFilter ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                htmlFor="Filter by status"
                              >
                                Status
                              </label>
                            </div>
                            <div className="mt-4 mb-2 text-left relative">
                              <select
                                title="Sort order"
                                className={`w-full p-4 border rounded-sm transition-all duration-300 focus:ring-2 focus:ring-[#2C3E50] focus:outline-none appearance-none ${sortOrder ? 'border-[#2C3E50]' : 'border-gray-300'}`}
                                value={sortOrder}
                                onChange={(e) => handleSortOrder(e.target.value)}
                              >
                                <option value="asc">↓ A-Z</option>
                                <option value="desc">↑ Z-A</option>
                              </select>
                              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                                  <ChevronDown size={20} />
                              </span>
                              <label 
                                className={`absolute text-lg font-medium left-4 top-4 text-[#2C3E50] px-1 transition-all duration-300 transform ${sortOrder ? 'bg-white top-[-10px] text-[#2C3E50] text-sm' : 'top-4 text-gray-500 text-base'}`}
                                htmlFor="sortOrder"
                              >
                                Sort Order
                              </label>
                            </div>
                          </div>
                        </motion.div>
                      )) as any}
                    />
                  </div>
                  {selectedUsers.length > 0 || showCheckboxes ? (
                    <>
                      <motion.button
                        type="button"
                        disabled={selectedUsers.length === 0}
                        className={`flex px-4 py-2 text-lg font-bold items-center rounded-lg shadow-sm transition duration-200 ease-in-out ${
                          selectedUsers.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        onClick={() => setIsDeleteModalOpen(true)}
                        aria-label="Delete selected users"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Trash2 size={24} className="mr-2" />
                        Delete Selected
                      </motion.button>
                      <motion.button
                        type="button"
                        className="flex px-4 py-2 text-lg font-bold text-white items-center bg-[#2C3E50] rounded-lg shadow-sm hover:bg-[#34495E] transition duration-200 ease-in-out"
                        onClick={() => {
                          setSelectedUsers([]);
                          setShowCheckboxes(false);
                        }}
                        aria-label="Cancel selected users"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X size={24} className="mr-2" />
                        Cancel
                      </motion.button>
                    </>
                  ) : (
                    <motion.button 
                      type="button" 
                      className="flex px-4 py-2 text-lg font-bold text-white items-center bg-[#2C3E50] rounded-lg shadow-sm hover:bg-[#34495E] transition duration-200 ease-in-out"
                      onClick={() => setShowAddUser(!showadduser)}
                      aria-label="Add users"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <UserRoundPlus size={24} className="mr-2" />
                      Add User
                    </motion.button>
                  )}
                </div>
              </div>
              {/* Users Table */}
              <div className="rounded-xl border-1 border-gray-200 shadow-sm h-[65vh] max-h-[65vh] overflow-y-auto">
                <div className="p-1">
                  <table className="min-w-full divide-y divide-gray-200 caption-bottom ">
                    <thead className="[&_tr]:border-b sticky top-0 z-10 bg-white">
                      <tr className="border-b border-gray-200 text-left font-medium">
                        {showCheckboxes && (
                          <th scope="col" className="p-4 whitespace-nowrap">
                            <input
                              title="Select all users"
                              type="checkbox"
                              className="w-4 h-4"
                              checked={selectedUsers.length === paged?.length}
                              onChange={() => {
                                if (selectedUsers.length === paged?.length) {
                                  setSelectedUsers([]);
                                } else {
                                  setSelectedUsers(paged?.map((user) => user.uid) || []);
                                }
                              }}
                            />
                          </th>
                        )}
                        <th scope="col" className="p-4 text-left font-medium tracking-wider">Name</th>
                        <th scope="col" className="p-4 text-left font-medium tracking-wider">Email</th>
                        <th scope="col" className="p-4 text-left font-medium tracking-wider">Grade</th>
                        <th scope="col" className="p-4 text-left font-medium tracking-wider">Role</th>
                        <th scope="col" className="p-4 text-left font-medium tracking-wider">Joined</th>
                        <th scope="col" className="p-4 text-left font-medium tracking-wider">Status</th>
                        <th scope="col" className="p-4 text-left font-medium tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white text-left divide-y divide-gray-200">
                      {paged?.map((user, index) => (
                        <motion.tr
                          key={index}
                          className="hover:bg-gray-100 transition duration-200 ease-in-out cursor-pointer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          {...longPressHandlers}
                        >
                          {showCheckboxes && (
                            <td className="p-4 whitespace-nowrap">
                              <input
                                title="Select user"
                                type="checkbox"
                                className="w-4 h-4"
                                checked={selectedUsers.includes(user.uid)}
                                onChange={() => {
                                  setSelectedUsers((e) =>
                                    e.includes(user.uid)
                                      ? e.filter((id) => id !== user.uid)
                                      : [...e, user.uid]
                                  );
                                }}
                              />
                            </td>
                          )}
                          <td className="p-4 whitespace-nowrap flex items-center space-x-4">
                            <img className="w-10 h-10 rounded-full object-contain" src={man} alt="user" />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-gray-900">{user.displayName}</span>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              {user.emailVerified ? (
                                <MailCheck size={20} className="text-green-500" />
                              ) : (
                                <MailX size={20} className="text-red-500" />
                              )}
                              <span className="text-sm ">{user.email}</span>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <School size={20} className="" />
                              <span className="text-sm">{user.grade}</span>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <UserRound size={20} className="" />
                              <span className="text-sm">{user.role}</span>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Calendar size={20} />
                              <span className="text-sm">
                                {formatUserDate(user.creationTime)}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {user.disabled ? (
                              <span className="px-2 py-0.5 text-sm bg-red-100 text-red-800 rounded-full">Inactive</span>
                            ) : (
                              <span className="px-2 py-0.5 text-sm bg-green-100 text-green-800 rounded-full">Active</span>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <div className="relative ml-2">
                              <Popup
                                trigger={
                                  <button
                                    title="Action"
                                    aria-label="Action"
                                    type="button"
                                    className="p-2 text-gray-600 hover:bg-[#2C3E50] hover:text-white rounded-full transition duration-200 ease-in-out"
                                    tabIndex={0}
                                  >
                                    <Ellipsis size={24} />
                                  </button>
                                }
                                position="bottom right"
                                on="click"
                                closeOnDocumentClick
                                arrow={false}
                                contentStyle={{ padding: 0, border: 'none', background: 'transparent', boxShadow: 'none' }}
                                overlayStyle={{ background: 'rgba(0,0,0,0.05)' }}
                                nested
                                lockScroll
                                children={((close: () => void) => (
                                  <motion.div
                                      initial={{ opacity: 0, scale: 0.95 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="flex flex-col bg-white shadow-xl rounded-lg mt-2 border border-gray-200 min-w-[160px] focus:outline-none"
                                      tabIndex={-1}
                                      onKeyDown={e => {
                                          if (e.key === 'Escape') close();
                                      }}
                                  >
                                      <button 
                                        type="button" 
                                        className="flex text-blue-600 hover:bg-gray-200 hover:text-blue-700 rounded-tl-lg rounded-tr-lg items-center px-6 py-4 space-x-2"
                                        onClick={() => {
                                          setSelectedUserData(user); // Set the selected user for editing
                                          setShowUpdateUser(!showUpdateUser); // Show edit user modal
                                          close(); // Close the dropdown
                                        }}
                                      >
                                        <SquarePen size={20} />
                                        <span>Edit account</span>
                                      </button>
                                      <button 
                                        type="button" 
                                        aria-label="Delete user"
                                        className="flex text-red-600 hover:bg-gray-200 hover:text-red-700 items-center px-6 py-3 space-x-2"
                                        onClick={() => {
                                          setSelectedUsers([user.uid]); // Set the selected user for deletion
                                          setIsDeleteModalOpen(true);
                                          close(); // Close the dropdown
                                        }}
                                      >
                                        <Trash2 size={20} />
                                        <span>Delete account</span>
                                      </button>
                                      <button 
                                        type="button"
                                        className={`flex text-[#2C3E50] ${userStatus ? '' : 'hover:bg-gray-200 hover:text-[#2C3E50]'} rounded-bl-lg rounded-br-lg items-center px-6 py-4 space-x-2`}
                                        onClick={async (e) => {
                                          e.stopPropagation(); // Prevent row click event
                                          await handleStatusChange(user.uid, user.disabled ? false : true);
                                          close(); // Close the dropdown
                                        }}
                                      >
                                        {userStatus ? (
                                          <div className="flex items-center justify-center gap-2">
                                              <SpinLoadingColored />
                                              {user.disabled ? 'Enabling...' : 'Disabling...'}
                                          </div>
                                        ) : (
                                          <>
                                            <UserLock size={20} />
                                            <span>{user.disabled ? 'Enable account' : 'Disable account'}</span>
                                          </>
                                        )}
                                      </button>
                                  </motion.div>
                                )) as any}
                              />
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Pagination */}
              <div className="sticky bottom-0 z-10 flex items-center justify-between mt-4 p-4 bg-gray-50 border-t border-gray-200">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={`px-6 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2C3E50] text-white hover:bg-[#34495E]'}`}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className={`px-10 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#2C3E50] text-white hover:bg-[#34495E]'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
      {isDeleteModalOpen && (
        <div className={'fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center'}>
          <DeleteModal
            entityType="user"
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
            onDelete={async () => {
              try {
                // Send all selected user IDs in a single request
                const response = await doDeleteUser(currentUser?.uid || "", selectedUsers) as any;
                if (response?.success) {
                  toast.success(<CustomToast title="Congratulation!" subtitle="Selected users deleted successfully." />);
                  fetchAndSetUsers(); // Refresh user list
                  setSelectedUsers([]); // Clear selection
                  setIsDeleteModalOpen(false);
                } else {
                  toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to delete these users. Please try again." />);
                  setIsDeleteModalOpen(false);
                }
              } catch (error) {
                toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to delete these users. Please try again." />);
                setIsDeleteModalOpen(false);
              }
            }}
          />
        </div>
      )}
    </>
  );
}

export default AdminUsersTab;
