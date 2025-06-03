import { useEffect, useState } from "react";
import { X, ChevronRight, ChevronDown, Trash2, Plus, Search } from 'lucide-react';
import { filterAndSortMembers, paginateMembers, useLongPress } from "../../utils/helpers";
import { doGetClassMembers, doUpdateClassMember, doDeleteClassMember } from '../../api/functions';
import { useAuth } from "../../hooks/authContext";
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CustomToast from "../Toast/CustomToast";
import AddMember from "./AddMember";
import MemberTable from "./MemberTable";
import DeleteModal from "../Modals/DeleteModal";


interface ManagerMembersProps {
    Tab: () => string;
    classId: string;
    classGrade: string;
}

const ManageMembers = ({ Tab, classId, classGrade }: ManagerMembersProps) => {

    const { currentUser, role } = useAuth();
    const [showAddMember, setShowAddMember] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [usersPerPage] = useState<number>(10); // Default to 10 users per page
    const [showOwners, setShowOwners] = useState(true);
    const [showMembers, setShowMembers] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [owners, setOwners] = useState<any[]>([]);
    const [members, setMembers] = useState<any[]>([]);
    const [titleChange, setTitleChange] = useState(false);
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [showOwnerCheckboxes, setShowOwnerCheckboxes] = useState(false);
    const [showMemberCheckboxes, setShowMemberCheckboxes] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchandSetUsers = async () => {
        try {
            const response = await doGetClassMembers(classId) as any;
            setUsers(response?.members);
            // separate the users base on title which owners and members
            const owners = response?.members.filter((user: any) => user.title === 'Owner');
            const members = response?.members.filter((user: any) => user.title === 'Member');
            setOwners(owners);
            setMembers(members);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    }

    useEffect(() => {
        fetchandSetUsers();
    }, [classId]);

    const handleTitleChange = async (memberId: string, title: string) => {
        try {
            setTitleChange(true);
            const response = await doUpdateClassMember(currentUser?.uid || "", classId, memberId, title) as any;
            if (response?.success) {
                toast.success(<CustomToast title="Congratulation!" subtitle="Member title updated successfully." />);
                fetchandSetUsers();
            } else {
                toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to update member title. Please try again." />);
            }
        } catch (error) {
            toast.error(<CustomToast title="Something went wrong!" subtitle="Error updating member title" />);
        } finally {
            setTitleChange(false);
        }
    };

    const filtered = filterAndSortMembers(users, searchQuery);
    const { paged, totalPages, safePage } = paginateMembers(filtered, currentPage, usersPerPage);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (currentPage !== safePage) {
            setCurrentPage(safePage);
        }
    }, [safePage, currentPage]);

    const handleRowHold = () => {
        setShowCheckboxes(true); // Show checkboxes when a row is held
        setShowOwnerCheckboxes(true);
        setShowMemberCheckboxes(true);
    };

    let longPressHandlers: any = {};
    if ( role !== 'Student' ) {
        longPressHandlers = useLongPress(handleRowHold);
    }

    const isOwner = owners.some((user) => user.id === currentUser?.uid);

    return (
        <>
            {showAddMember ? (
                <AddMember setShowAddMember={() => setShowAddMember(!showAddMember)} callFetchUsers={() => fetchandSetUsers()} classId={classId} classGrade={classGrade} />
            ): (
                <>
                    {Tab() === "manage-students" && (
                        <>
                            <div className="p-6 border-b-2 border-[#BDC3C7] shadow-sm bg-white">   
                                <h2 className="w-full text-2xl text-left font-semibold">Members</h2>
                            </div>
                            <motion.div 
                                className="px-6 py-2 overflow-y-scroll h-[calc(100vh-170px)]"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <div className="flex items-center justify-between">
                                    {selectedMembers.length > 0 || showCheckboxes || showOwnerCheckboxes || showMemberCheckboxes ? (
                                        <div className="flex items-center space-x-6">
                                            <motion.button
                                                type="button"
                                                disabled={selectedMembers.length === 0}
                                                className={`flex px-4 py-2 text-lg font-bold items-center rounded-lg shadow-sm transition duration-200 ease-in-out ${
                                                selectedMembers.length === 0
                                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    : 'bg-red-500 text-white hover:bg-red-600'
                                                }`}
                                                onClick={() => setIsDeleteModalOpen(true)}
                                                aria-label="Delete selected users"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Trash2 size={20} className="mr-2" />
                                                Delete Selected
                                            </motion.button>
                                            <motion.button
                                                type="button"
                                                className="flex text-lg font-bold items-center transition duration-200 ease-in-out"
                                                onClick={() => {
                                                    setShowCheckboxes(false);
                                                    setShowOwnerCheckboxes(false);
                                                    setShowMemberCheckboxes(false);
                                                    setSelectedMembers([]);
                                                }}
                                                aria-label="Cancel"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <X size={24} className="mr-2" />
                                                Cancel
                                            </motion.button>
                                        </div>
                                    ) : (
                                        isOwner && (
                                            <motion.button 
                                                type="button"
                                                className="flex text-lg font-bold items-center transition duration-200 ease-in-out"
                                                onClick={() => setShowAddMember(!showAddMember)}
                                                aria-label="Add Student"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Plus size={24} className="mr-2" />
                                                Add member
                                            </motion.button>
                                        )
                                    )}
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
                                </div>
                                {searchQuery ? (
                                    <MemberTable
                                        users={paged}
                                        showCheckboxes={showCheckboxes}
                                        selectedMembers={selectedMembers}
                                        onSelect={(userId) =>
                                            setSelectedMembers((prev) =>
                                                prev.includes(userId)
                                                    ? prev.filter((id) => id !== userId)
                                                    : [...prev, userId]
                                            )
                                        }
                                        onSelectAll={() => {
                                            const pagedIds = paged
                                                .filter((user) => currentUser?.uid !== user.id)
                                                .map((user) => user.id);
                                            if (pagedIds.every((id) => selectedMembers.includes(id))) {
                                                setSelectedMembers((prev) =>
                                                    prev.filter((id) => !pagedIds.includes(id))
                                                );
                                            } else {
                                                setSelectedMembers((prev) => [
                                                    ...prev,
                                                    ...pagedIds.filter((id) => !prev.includes(id)),
                                                ]);
                                            }
                                        }}
                                        currentUserId={currentUser?.uid || ""}
                                        title={isOwner}
                                        titleChange={titleChange}
                                        onTitleChange={handleTitleChange}
                                        onDelete={(userId) => {
                                            setSelectedMembers([userId]);
                                            setIsDeleteModalOpen(true);
                                        }}
                                        longPressHandlers={longPressHandlers}
                                    />
                                ): (
                                    <div className="flex flex-col items-start justify-between">
                                        <motion.button
                                            type="button"
                                            className="flex items-center transition duration-200 ease-in-out mt-4"
                                            onClick={() => setShowOwners(!showOwners)}
                                            aria-label="Manage Owners"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {showOwners ? <ChevronDown size={22} className="mr-2" /> : <ChevronRight size={22} className="mr-2" />}
                                            Owners ({owners.length})
                                        </motion.button>
                                        {showOwners && (
                                            <MemberTable
                                                users={owners}
                                                showCheckboxes={showOwnerCheckboxes}
                                                selectedMembers={selectedMembers}
                                                onSelect={(userId) =>
                                                    setSelectedMembers((prev) =>
                                                        prev.includes(userId)
                                                            ? prev.filter((id) => id !== userId)
                                                            : [...prev, userId]
                                                    )
                                                }
                                                onSelectAll={() => {
                                                    const ownerIds = owners
                                                        .filter((user) => currentUser?.uid !== user.id)
                                                        .map((user) => user.id);
                                                    if (ownerIds.every((id) => selectedMembers.includes(id))) {
                                                        setSelectedMembers((prev) =>
                                                            prev.filter((id) => !ownerIds.includes(id))
                                                        );
                                                    } else {
                                                        setSelectedMembers((prev) => [
                                                            ...prev,
                                                            ...ownerIds.filter((id) => !prev.includes(id)),
                                                        ]);
                                                    }
                                                }}
                                                currentUserId={currentUser?.uid || ""}
                                                title={isOwner}
                                                titleChange={titleChange}
                                                onTitleChange={(userId) => handleTitleChange(userId, 'Member')}
                                                onDelete={(userId) => {
                                                    setSelectedMembers([userId]);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                longPressHandlers={longPressHandlers}
                                            />
                                        )}
                                        <motion.button
                                            type="button"
                                            className="flex items-center transition duration-200 ease-in-out mt-4"
                                            onClick={() => setShowMembers(!showMembers)}
                                            aria-label="Manage Members"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {showMembers ? <ChevronDown size={22} className="mr-2" /> : <ChevronRight size={22} className="mr-2" />}
                                            Members ({members.length})
                                        </motion.button>
                                        {showMembers && (
                                            <MemberTable
                                                users={members}
                                                showCheckboxes={showMemberCheckboxes}
                                                selectedMembers={selectedMembers}
                                                onSelect={(userId) =>
                                                    setSelectedMembers((prev) =>
                                                        prev.includes(userId)
                                                            ? prev.filter((id) => id !== userId)
                                                            : [...prev, userId]
                                                    )
                                                }
                                                onSelectAll={() => {
                                                    const memberIds = members
                                                        .filter((user) => currentUser?.uid !== user.id)
                                                        .map((user) => user.id);
                                                    if (memberIds.every((id) => selectedMembers.includes(id))) {
                                                        setSelectedMembers((prev) =>
                                                            prev.filter((id) => !memberIds.includes(id))
                                                        );
                                                    } else {
                                                        setSelectedMembers((prev) => [
                                                            ...prev,
                                                            ...memberIds.filter((id) => !prev.includes(id)),
                                                        ]);
                                                    }
                                                }}
                                                currentUserId={currentUser?.uid || ""}
                                                title={isOwner}
                                                titleChange={titleChange}
                                                onTitleChange={(userId) => handleTitleChange(userId, 'Owner')}
                                                onDelete={(userId) => {
                                                    setSelectedMembers([userId]);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                longPressHandlers={longPressHandlers}
                                            />
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </>
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
                                const response = await doDeleteClassMember(currentUser?.uid || "", classId, selectedMembers) as any;
                                if (response) {
                                    toast.success(<CustomToast title="Congratulation!" subtitle="Selected member(s) deleted successfully." />);
                                    fetchandSetUsers(); // Refresh user list
                                    setSelectedMembers([]); // Clear selection
                                    setIsDeleteModalOpen(false); // Close modal
                                    setShowCheckboxes(false); // Hide checkboxes
                                    setShowOwnerCheckboxes(false); // Hide owner checkboxes
                                    setShowMemberCheckboxes(false); // Hide member checkboxes
                                } else {
                                    toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to delete these members. Please try again." />);
                                    setIsDeleteModalOpen(false);
                                }
                            } catch (error) {
                                toast.error(<CustomToast title="Something went wrong!" subtitle="Failed to delete these members. Please try again." />);
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}

export default ManageMembers;
