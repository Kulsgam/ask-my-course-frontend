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

const sampleChatHistory: IChatHistoryChat[] = [
  {
    id: 1,
    name: "Assignment Help",
    lastRole: Role.user,
    lastMessage: "Can you explain the assignment requirements?",
    courseName: "Mathematics",
    university: "RMIT",
    userId: 1,
  },
  {
    id: 1,
    name: "Project Questions",
    lastRole: Role.assistant,
    lastMessage: "Sure! What do you need help with?",
    courseName: "Mathematics",
    university: "RMIT",
    userId: 1,
  },
  {
    id: 3,
    name: "Exam Preparation",
    lastRole: Role.user,
    lastMessage: "What topics should I focus on for the exam?",
    courseName: "Physics",
    university: "RMIT",
    userId: 2,
  },
];


const sampleUserInfo: IUserInfo = {
  id: 1,
  name: "John Doe",
  email: "john.doe@gmail.com",
  avatar: "string",
  courses: ["Mathematics", "Physics"],
  university: "RMIT",
  chatHistory: sampleChatHistory,
};

export const selectedCourseAtom = atom<string | null>(null);
export const chatInfoAtom = atom<IChatInfo | null>(null);
export const activeChatIdAtom = atom<number | null>(null);
export const userInfoAtom = atom<IUserInfo | null>(sampleUserInfo);
