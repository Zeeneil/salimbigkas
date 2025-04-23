import { functions } from "../firebase/firebase";
import { httpsCallable } from "firebase/functions";

// Call getAllUsers Cloud Function
export const dogetAllUsers = async () => {
  try {
    const getAllUsersFn = httpsCallable(functions, "getAllUsers");
    const response = await getAllUsersFn() as { data: { users: any[] } };
    return response.data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// Call setUserRole Cloud Function
export const doSetUserRole = async (uid: string, role: string) => {
  try {
    const setUserRole = httpsCallable(functions, "setUserRole");
    await setUserRole({ uid, role });
    return;
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
};

// Call deleteUser Cloud Function
export const deleteUser = async (uid: string) => {
  try {
    const deleteUserFn = httpsCallable(functions, "deleteUser");
    const response = await deleteUserFn({ uid }) as { data: { message: string } };
    return response.data.message;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

// Call getAdminStats Cloud Function
export const getAdminStats = async () => {
  try {
    const getAdminStatsFn = httpsCallable(functions, "getAdminStats");
    const response = await getAdminStatsFn();
    return response.data;
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  }
};