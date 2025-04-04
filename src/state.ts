import { atom } from "jotai";
import { IMessage } from "./components/chat/types";

export enum Role {
    user,
    assistant
}

interface IChatInfo {
  id: number;
  name: string;
  messages: IMessage[];
}

interface ICourse {
  id: number;
  name: string;
}

interface IChatHistoryChat extends Omit<IChatInfo, "messages"> {
    lastRole: Role;
    lastMessage: string;
}

interface IUserInfo {
    id: number;
    name: string;
    email: string;
    avatar: string;
    courses: ICourse[];
    chatHistory: IChatHistoryChat[];
}

export const selectedCourseAtom = atom<ICourse | null>(null);
export const chatInfoAtom = atom<IChatInfo | null>(null);
export const chatHistoryAtom = atom<IChatHistoryChat[]>([]);
export const userInfoAtom = atom<IUserInfo | null>(null);
