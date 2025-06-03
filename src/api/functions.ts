import { functions } from "../firebase/firebase";
import { httpsCallable } from "firebase/functions";

// Call getAllUsers Cloud Function
export const dogetAllUsers = async (signInUser: string, role: string) => {
  try {
    const getAllUsers = httpsCallable(functions, "getAllUsers");
    const response = await getAllUsers({ signInUser, role });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const doCreateUser = async (signInUser: string, displayName: string, email: string, password: string, role: string) => {
  try {
    const createUser = httpsCallable(functions, "setCreateUser");
    const response = await createUser({ signInUser, displayName, email, password, role });
    return response.data;
  }
  catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Call setUserRole Cloud Function
export const doSetUserRole = async (uid: string, role: string) => {
  try {
    const setUserRole = httpsCallable(functions, "setUserRole");
    const response = await setUserRole({ uid, role });
    return response.data;
  } catch (error) {
    console.error("Error setting user role:", error);
    throw error;
  }
};

export const doSetUserStatus = async (signInUser: string, uid: string, status: boolean) => {
  try {
    const setUserStatus = httpsCallable(functions, "setUserStatus");
    const response = await setUserStatus({ signInUser, uid, status });
    return response.data;
  } catch (error) {
    console.error("Error setting user status:", error);
    throw error;
  }
}

export const doUpdateUser = async (signInUser: string, uid: string, displayName: string, email: string, password: string, role: string) => {
  try {
    const setUpdateUser = httpsCallable(functions, "setUpdateUser");
    const response = await setUpdateUser({ signInUser, uid, displayName, email, password, role });
    return response.data;
  }
  catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Call deleteUser Cloud Function
export const doDeleteUser = async (signInUser: string, uid: string[]) => {
  try {
    const deleteUserFn = httpsCallable(functions, "setDeleteUser");
    const response = await deleteUserFn({ signInUser, uids: uid });
    return response.data;
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

// Call getAllTeacherClasses Cloud Function
export const doGetAllClasses = async (uid: string) => {
  try {
    const getAllClasses = httpsCallable(functions, "getAllClasses");
    const response = await getAllClasses({ uid });
    return response.data;
  } catch (error) {
    console.error("Error fetching teacher classes:", error);
    throw error;
  }
};

export const doCreateClass = async (signInUser: string, className: string, classDescription: string, classGrade: string, selectedDays: string[], time: string) => {
  try {
    const createClass = httpsCallable(functions, "setCreateTeacherClass");
    const response = await createClass({ signInUser, className, classDescription, classGrade, days: selectedDays, time });
    return response.data;
  }
  catch (error) {
    console.error("Error creating class:", error);
    throw error;
  }
};

export const doUpdateClass = async (signInUser: string, id: string, className: string, classDescription: string, classGrade: string, selectedDays: string[], time: string) => {
  try {
    const updateClass = httpsCallable(functions, "setUpdateTeacherClass");
    const response = await updateClass({ signInUser, id, className, classDescription, classGrade, days: selectedDays, time });
    return response.data;
  } catch (error) {
    console.error("Error updating class:", error);
    throw error;
  }
};

export const doDeleteClass = async (signInUser: string, id: string) => {
  try {
    const deleteClass = httpsCallable(functions, "setDeleteTeacherClass");
    const response = await deleteClass({ signInUser, id });
    return response.data;
  } catch (error) {
    console.error("Error deleting class:", error);
    throw error;
  }
};

export const doGetClassMembers = async (classId: string) => {
  try {
    const getClassMembers = httpsCallable(functions, "getClassMembers");
    const response = await getClassMembers({ classId });
    return response.data;
  } catch (error) {
    console.error("Error fetching class members:", error);
    throw error;
  }
}

export const doJoinClassByCode = async (signInUser: string, classCode: string) => {
  try {
    const joinByClassCode = httpsCallable(functions, "setJoinClassByCode");
    const response = await joinByClassCode({ signInUser, classCode });
    return response.data;
  } catch (error) {
    console.error("Error joining class by code:", error);
    throw error;
  }
};

export const doGetAllClassMembersGrade = async (classId: string, classGrade: string) => {
  try {
    const getAllClassMembersGrade = httpsCallable(functions, "getAllClassMembersGrade");
    const response = await getAllClassMembersGrade({ classId, classGrade });
    return response.data;
  } catch (error) {
    console.error("Error fetching all class members grade:", error);
    throw error;
  }
};

export const doAddClassMember = async (signInUser: string, classId: string, classGrade: string, memberIds: string[], title: string) => {
  try {
    const addClassMember = httpsCallable(functions, "setAddClassMember");
    const response = await addClassMember({ signInUser, classId, classGrade, memberIds, title });
    return response.data;
  } catch (error) {
    console.error("Error adding class member:", error);
    throw error;
  }
};

export const doUpdateClassMember = async (signInUser: string, classId: string, memberId: string, title: string) => {
  try {
    const updateClassMember = httpsCallable(functions, "setUpdateClassMember");
    const response = await updateClassMember({ signInUser, classId, memberId, title });
    return response.data;
  } catch (error) {
    console.error("Error updating class member:", error);
    throw error;
  }
};

export const doDeleteClassMember = async (signInUser: string, classId: string, memberIds: string[]) => {
  try {
    const deleteClassMember = httpsCallable(functions, "setDeleteClassMember");
    const response = await deleteClassMember({ signInUser, classId, memberIds });
    return response.data;
  } catch (error) {
    console.error("Error deleting class member:", error);
    throw error;
  }
};

export const doGetAllEvents = async (signInUser: string) => {
  try {
    const getAllEvents = httpsCallable(functions, "getAllEvents");
    const response = await getAllEvents({ signInUser });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const doCreateEvent = async (signInUser: string, selectedDate: string, time: string, eventname: string, eventdescription: string) => {
  try {
    const createEvent = httpsCallable(functions, "setCreateNewEvent");
    const response = await createEvent({ signInUser, selectedDate, time, eventname, eventdescription });
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const doUpdateEvent = async (signInUser: string, eventId: string, selectedDate: string, time: string, eventname: string, eventdescription: string) => {
  try {
    const updateEvent = httpsCallable(functions, "setUpdateEvent");
    const response = await updateEvent({ signInUser, eventId, selectedDate, time, eventname, eventdescription });
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const doDeleteEvent = async (signInUser: string, eventId: string) => {
  try {
    const deleteEvent = httpsCallable(functions, "setDeleteEvent");
    const response = await deleteEvent({ signInUser, eventId });
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const doGetAllYunits = async (signInUser: string, classId: string) => {
  try {
    const getAllYunits = httpsCallable(functions, "getAllYunits");
    const response = await getAllYunits({ signInUser, classId });
    return response.data;
  } catch (error) {
    console.error("Error fetching yunits:", error);
    throw error;
  }
};

export const doCreateYunit = async (signInUser: string, status: boolean, yunitnumber: number,  yunitname: string, imagepath: string, imageurl: string) => {
  try {
    const createYunit = httpsCallable(functions, "setCreateYunit");
    const response = await createYunit({ signInUser, status, yunitnumber, yunitname, imagepath, imageurl });
    return response.data;
  } catch (error) {
    console.error("Error creating yunit:", error);
    throw error;
  }
};

export const doCreatePersonalYunit = async (signInUser: string, status: boolean, classId: string, yunitnumber: number,  yunitname: string, imagepath: string, imageurl: string) => {
  try {
    const createYunit = httpsCallable(functions, "setCreatePersonalYunit");
    const response = await createYunit({ signInUser, status, classId, yunitnumber, yunitname, imagepath, imageurl });
    return response.data;
  } catch (error) {
    console.error("Error creating yunit:", error);
    throw error;
  }
};

export const doUpdateYunit = async (signInUser: string, yunitId: string, status: boolean, yunitnumber: number,  yunitname: string, imagepath: string, imageurl: string) => {
  try {
    const updateYunit = httpsCallable(functions, "setUpdateYunit");
    const response = await updateYunit({ signInUser, id: yunitId, status, yunitnumber, yunitname, imagepath, imageurl });
    return response.data;
  } catch (error) {
    console.error("Error updating yunit:", error);
    throw error;
  }
};

export const doUpdatePersonalYunit = async (signInUser: string, yunitId: string, classId: string, status: boolean, yunitnumber: number,  yunitname: string, imagepath: string, imageurl: string) => {
  try {
    const updateYunit = httpsCallable(functions, "setUpdatePersonalYunit");
    const response = await updateYunit({ signInUser, id: yunitId, classId, status, yunitnumber, yunitname, imagepath, imageurl });
    return response.data;
  } catch (error) {
    console.error("Error updating yunit:", error);
    throw error;
  }
};

export const doDeleteYunit = async (signInUser: string, yunitId: string) => {
  try {
    const deleteYunit = httpsCallable(functions, "setDeleteYunit");
    const response = await deleteYunit({ signInUser, id: yunitId });
    return response.data;
  } catch (error) {
    console.error("Error deleting yunit:", error);
    throw error;
  }
};

export const doDeletePersonalYunit = async (signInUser: string, yunitId: string) => {
  try {
    const deleteYunit = httpsCallable(functions, "setDeletePersonalYunit");
    const response = await deleteYunit({ signInUser, id: yunitId });
    return response.data;
  } catch (error) {
    console.error("Error deleting personal yunit:", error);
    throw error;
  }
};

export const doSetSaveLessonTimeSpent = async (signInUser: string, yunitId: string, lessonId: string, timeSpent: number) => {
  try {
    const saveLessonTime = httpsCallable(functions, "setSaveLessonTimeSpent");
    const response = await saveLessonTime({ signInUser, yunitId, lessonId, timeSpent });
    return response.data;
  } catch (error) {
    console.error("Error saving lesson time spent:", error);
    throw error;
  }
};

export const doGetAllLessons = async (signInUser: string, yunitId: string, classGrade: string) => {
  try {
    const getAllLessons = httpsCallable(functions, "getAllLessons");
    const response = await getAllLessons({signInUser, yunitId, classGrade});
    return response.data;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

export const doCreateLessonDraft = async (signInUser: string, yunitId: string, classGrade: string, isDraft: boolean, aralinNumero: string, aralinPamagat: string, aralinPaglalarawan: string | null = null, fileUrls: any) => {
  try {
    const createLessonDraft = httpsCallable(functions, "setCreateLessonDraft");
    const response = await createLessonDraft({ signInUser, yunitId, classGrade, isDraft, aralinNumero, aralinPamagat, aralinPaglalarawan, fileUrls });
    return response.data;
  } catch (error) {
    console.error("Error creating lesson draft:", error);
    throw error;
  }
};

export const dogetAllQuizzes = async (signInUser: string, yunitId: string, lessonId: string, classGrade: string) => {
  try {
    const getAllQuizzes = httpsCallable(functions, "getAllQuizzes");
    const response = await getAllQuizzes({ signInUser, yunitId, lessonId, classGrade });
    return response.data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};

export const doCreateQuiz = async (signInUser: string, yunitId: string, lessonId: string, classGrade: string, questions: any, category: string) => {
  try {
    const createQuiz = httpsCallable(functions, "setCreateQuiz");
    const response = await createQuiz({ signInUser, yunitId, lessonId, classGrade, questions, category });
    return response.data;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
};

export const doSubmitQuizAnswers = async (signInUser: string, yunitId: string, classId: string, lessonId: string, quizId: string, answers: any, score: number, total: number) => {
  try {
    const submitQuizAnswers = httpsCallable(functions, "submitQuizAnswers");
    const response = await submitQuizAnswers({ signInUser, yunitId, classId, lessonId, quizId, answers, score, total });
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz answers:", error);
    throw error;
  }
};

export const doGetDescriptiveAnalytics = async () => {
  try {
    const getDecriptiveAnalytics = httpsCallable(functions, "getDescriptiveAnalytics");
    const response = await getDecriptiveAnalytics();
    return response.data;
  } catch (error) {
    console.error("Error fetching descriptive analytics:", error);
    throw error;
  }
};
