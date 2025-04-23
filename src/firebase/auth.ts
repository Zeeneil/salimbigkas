// firebaseAuth.tsx
import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  updateEmail,
  updateProfile,
  User,
  AuthProvider,
  UserCredential,
  setPersistence,
  browserSessionPersistence,
  browserLocalPersistence,
  UserProfile
} from 'firebase/auth';
import {
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  DocumentReference,
  DocumentData,
} from 'firebase/firestore';

// Additional types
interface AdditionalUserData {
  [key: string]: any;
}

interface ProfileUpdate {
  displayName?: string | null;
  photoURL?: string | null;
}

// Initialize Firebase Authentication and Firestore
const applyPersistence = async (
  rememberMe: boolean = true
): Promise<void> => {
  const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
  await setPersistence(auth, persistence);
};

// Create a new user
export const doCreateUserWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string,
  rememberMe: boolean = true
): Promise<User> => {

  await applyPersistence(rememberMe);

  const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await doUpdateProfile({ displayName: name });
  await createUserDocumentfromAuth(user, { displayName: name });

  try {
    await doSendEmailVerification();
  }
  catch (error) {
    console.error('Error sending email verification:', error);
  }

  return user;
};

// Sign in user
export const doSignInWithEmailAndPassword = async (
  email: string,
  password: string,
  rememberMe: boolean = true
): Promise<User> => {

  await applyPersistence(rememberMe);

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (!user.emailVerified) {
    await doSendEmailVerification();
  }

  await createUserDocumentfromAuth(user, {});
  return user;
};

// Sign in with provider
const doSignInWithProvider = async (
  provider: AuthProvider,
  rememberMe: boolean = true
): Promise<User> => {
  await applyPersistence(rememberMe);
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  await createUserDocumentfromAuth(user, {});
  return user;
};

// Google redirect
export const doSignInWithGoogleRedirect = (): void => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  signInWithRedirect(auth, provider);
};

// Google popup
export const doSignInWithGoogle = async (
  rememberMe: boolean = true
): Promise<User> => {
  const provider = new GoogleAuthProvider();
  return await doSignInWithProvider(provider, rememberMe);
};

// Facebook sign-in
export const doSignInWithFacebook = async (
  rememberMe: boolean = true
): Promise<User> => {
  const provider = new OAuthProvider('facebook.com');
  return await doSignInWithProvider(provider, rememberMe);
};

// Apple sign-in
export const doSignInWithApple = async (
  rememberMe: boolean = true
): Promise<User> => {
  const provider = new OAuthProvider('apple.com');
  return await doSignInWithProvider(provider, rememberMe);
};

// Microsoft sign-in
export const doSignInWithMicrosoft = async (
  rememberMe: boolean = true
): Promise<User> => {
  const provider = new OAuthProvider('microsoft.com');
  provider.setCustomParameters({ prompt: 'consent' });
  return await doSignInWithProvider(provider, rememberMe);
};

// Create or update Firestore document
export const createUserDocumentfromAuth = async (
  userAuth: User | null,
  additionalData: AdditionalUserData = {}
): Promise<DocumentReference<DocumentData> | void> => {
  if (!userAuth) return;

  const userRef = doc(db, 'users', userAuth.uid);
  const snapshot = await getDoc(userRef);
  const tokenResult = await userAuth.getIdTokenResult();
  const defaultData: Record<string, any> = {
    uid: userAuth.uid,
    role: tokenResult.claims.role || 'student',
    displayName: userAuth.displayName || 'User',
    email: userAuth.email,
    emailVerified: userAuth.emailVerified || false,
    photoURL: userAuth.photoURL || null,
    phoneNumber: userAuth.phoneNumber || null,
    metadata: {
      creationTime: userAuth.metadata.creationTime,
      lastSignInTime: userAuth.metadata.lastSignInTime,
    },
    updatedAt: serverTimestamp(),
    ...additionalData,
  };

  // Only add `createdAt` if the document does not exist
  if (!snapshot.exists()) {
    defaultData.createdAt = serverTimestamp();
  }

  try {
    await setDoc(userRef, defaultData, { merge: true });
  } catch (error) {
    console.error('Error creating/updating user document:', error);
    throw error;
  }

  return userRef;
};

// Auth state listener
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Call createUserDocumentfromAuth to handle Firestore updates
        await createUserDocumentfromAuth(user);

        // Pass the user object to the callback
        callback(user);
      } catch (error) {
        console.error('Error updating user document on auth state change:', error);
      }
    } else {
      // Pass null to the callback when the user is signed out
      callback(null);
    }
  });
};

const requireCurrentUser = (): User => {
  const user = auth.currentUser;
  if (!user) throw new Error('No authenticated user.');
  return user;
};

// Send email verification
export const doSendEmailVerification = (): Promise<void> => {
  const user = requireCurrentUser();
  return sendEmailVerification(user, {
    url: `${window.location.origin}/home`,
  });
};

// Sign out
export const doSignOut = (): Promise<void> => {
  return auth.signOut();
};

// Password reset
export const doPasswordReset = async (
  email: string
): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
  // const userRef = doc(db, 'users', email);
  // const snapshot = await getDoc(userRef);

  // if (snapshot.exists()) {
  //   const userData = snapshot.data();
  //   if (!userData.emailVerified) {
  //     await doSendEmailVerification();
  //   } else {
  //     return sendPasswordResetEmail(auth, email);
  //   }
  // } else {
  //   throw new Error('User does not exist.');
  // }
};

// Change password
export const doPasswordChange = (
  password: string
): Promise<void> => {
  const user = requireCurrentUser();
  return updatePassword(user, password);
};

// Reauthenticate with email
export const doReauthenticateWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  const credential = EmailAuthProvider.credential(email, password);
  const user = requireCurrentUser();
  await reauthenticateWithCredential(user, credential);
};

// Delete user
export const doDeleteUser = async (
  email: string,
  password: string
): Promise<void> => {
  const user = requireCurrentUser();
  try {
    await doReauthenticateWithEmail(email, password);
    await setDoc(doc(db, 'users', user.uid), {}, { merge: false });
    await deleteUser(user);
  } catch (error) {
    console.error('Error during account deletion:', error);
    throw error;
  }
};

// Update email
export const doUpdateEmail = async (
  newEmail: string
): Promise<void> => {
  const user = requireCurrentUser();
  await updateEmail(user, newEmail);
};

// Update profile
export const doUpdateProfile = async (
  profile: ProfileUpdate
): Promise<void> => {
  const user = requireCurrentUser();
  await updateProfile(user, profile);
};
