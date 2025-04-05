import axios from "axios";
import { getAuth } from "firebase/auth";
import { IChatInfo, IUserInfo } from "@/state";
import { fetchRequest, Result } from "@/api/utils";

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
    const response = await axios.get<IUserInfo>("/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  });
}

export async function fetchUserCourses(): Promise<Result<string[]>> {
  return fetchRequest(async () => {
    const response = await axios.get<string[]>("/api/courses/");
    return response.data;
  });
}

export async function fetchChat(chatId: number): Promise<Result<IChatInfo>> {
  return fetchRequest(async () => {
    const response = await axios.get<IChatInfo>(`/api/chat/${chatId}`);
    return response.data;
  });
}

export async function logIn(
  email: string,
  password: string,
): Promise<Result<IUserInfo>> {
  return fetchRequest(async () => {
    const response = await axios.post<IUserInfo>("/api/login", {
      email,
      password,
    });
    return response.data;
  });
}

export async function logOut(): Promise<Result<void>> {
  return fetchRequest(async () => {
    await axios.post("/api/logout");
  });
}

export async function changeAvatar(
  avatar: string,
): Promise<Result<IUserInfo>> {
  return fetchRequest(async () => {
    const response = await axios.post<IUserInfo>("/api/user/avatar", {
      avatar,
    });
    return response.data;
  });
}

export async function changeNickname(
  nickname: string,
): Promise<Result<IUserInfo>> {
  return fetchRequest(async () => {
    const response = await axios.post<IUserInfo>("/api/user/nickname", {
      nickname,
    });
    return response.data;
  });
}
