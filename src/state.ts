import { atom } from "jotai";
import { IMessage } from "./components/chat/types";

export enum Role {
  user = "User",
  assistant = "Assistant",
}

export interface IChatInfo {
  id: number;
  name: string;
  messages: IMessage[];
  courseName: string;
  university: string;
  userId: number;
}

export interface ICourse {
  name: string;
  university: string;
}

interface IChatHistoryChat extends Omit<IChatInfo, "messages"> {
  lastRole: Role;
  lastMessage: string;
}

export interface IUserInfo {
  id: number;
  name: string;
  email: string;
  avatar: string;
  courses: string[];
  university: string;
  chatHistory: IChatHistoryChat[];
}

export const selectedCourseAtom = atom<string | null>(null);
export const chatInfoAtom = atom<IChatInfo | null>(null);
export const userInfoAtom = atom<IUserInfo | null>(null);
