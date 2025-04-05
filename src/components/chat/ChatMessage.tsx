import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { IChatMessageProps } from "@/components/chat/types";
import { Role } from "@/state";

export default function ChatMessage({ message }: IChatMessageProps) {
  const isUser = message.role === Role.user;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex w-full gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        <Avatar className={isUser ? "bg-primary" : "bg-muted"}>
          <AvatarFallback>
            {isUser ? (
              <User className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="max-w-[80%] break-words">
          <div>
            <div
              className={`rounded-lg p-3 text-left whitespace-pre-wrap ${isUser ? "dark:bg-primary bg-zinc-300 dark:text-primary-foreground text-black" : "bg-muted text-foreground"}`}
            >
              {message.content}
            </div>
            <div
              className={`text-muted-foreground mt-1 w-full text-xs ${
                isUser ? "pr-2 text-right" : "pl-2 text-left"
              }`}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
