import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { IChatInfo, IUserInfo } from "@/state";
import { fetchRequest, Result } from "@/api/utils";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../firebase-config.json";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export function isLoggedIn() {
  return !!auth.currentUser;
}

export async function fetchUserInfo(): Promise<Result<IUserInfo | null>> {
  const user = auth.currentUser;
  if (!user) {
    return { success: true, data: null };
  }

  return fetchRequest(async () => {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }
    return userDoc.data() as IUserInfo;
  });
}

export async function fetchChat(chatId: number): Promise<Result<IChatInfo>> {
  return fetchRequest(async () => {
    const chatQuery = query(collection(db, "chats"), where("id", "==", chatId));
    const querySnapshot = await getDocs(chatQuery);
    if (querySnapshot.empty) {
      throw new Error(`Chat with ID ${chatId} not found`);
    }
    return querySnapshot.docs[0].data() as IChatInfo;
  });
}

export async function logIn(
  email: string,
  password: string,
): Promise<Result<IUserInfo>> {
  return fetchRequest(async () => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", cred.user.uid));
    if (!userDoc.exists()) {
      throw new Error("User data not found");
    }
    return userDoc.data() as IUserInfo;
  });
}

export async function logOut(): Promise<Result<void>> {
  try {
    await signOut(auth);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Example: Update avatar
// Uncomment and use this function if needed
/*
export async function changeAvatar(avatar: string): Promise<Result<IUserInfo>> {
  return fetchRequest(async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { avatar });

    const updatedDoc = await getDoc(userRef);
    return updatedDoc.data() as IUserInfo;
  });
}
*/
