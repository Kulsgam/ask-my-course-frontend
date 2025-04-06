import { Role } from "@/state";

export interface IMessage {
  id: number;
  content: string;
  role: Role;
  timestamp: Date;
}

export interface IChatMessageProps {
  message: IMessage;
}
