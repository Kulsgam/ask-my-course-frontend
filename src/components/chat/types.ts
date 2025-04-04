import { Role } from "@/state";

export interface IMessage {
  id: string;
  content: string;
  role: Role;
  timestamp: Date;
}

export interface IChatMessageProps {
  message: IMessage;
}
