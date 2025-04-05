import axios from "axios";
import { getAuth, signOut } from "firebase/auth";
import { IChatInfo, IUserInfo } from "@/state";
import { fetchRequest, Result, API_URL } from "@/api/utils";

const auth = getAuth();

export function isLoggedIn() {
  return !!auth.currentUser;
}

export async function fetchUserInfo(): Promise<Result<IUserInfo | null>> {
  const user = auth.currentUser;
  if (!user) {
    return { success: true, data: null };
  }
  const token = await user.getIdToken();
  return fetchRequest(async () => {
    const response = await axios.get<IUserInfo>(`${API_URL}/api/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  });
}

export async function fetchUserCourses(): Promise<Result<string[]>> {
  return fetchRequest(async () => {
    const response = await axios.get<string[]>(`${API_URL}/api/courses/`);
    return response.data;
  });
}

export async function fetchChat(chatId: number): Promise<Result<IChatInfo>> {
  return fetchRequest(async () => {
    const response = await axios.get<IChatInfo>(
      `${API_URL}/api/chat/${chatId}`,
    );
    return response.data;
  });
}

export async function logIn(
  email: string,
  password: string,
): Promise<Result<IUserInfo>> {
  return fetchRequest(async () => {
    const response = await axios.post<IUserInfo>(`${API_URL}/api/login`, {
      email,
      password,
    });
    return response.data;
  });
}

export async function logOut(): Promise<Result<void>> {
  // Just sign out the user using Firebase
  try {
    await signOut(auth);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

export async function changeAvatar(avatar: string): Promise<Result<IUserInfo>> {
  return fetchRequest(async () => {
    const response = await axios.post<IUserInfo>(`${API_URL}/api/user/avatar`, {
      avatar,
    });
    return response.data;
  });
}
