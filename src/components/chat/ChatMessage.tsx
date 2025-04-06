import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { IChatMessageProps } from "@/components/chat/types";
import { Role } from "@/state";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/state";

export default function ChatMessage({ message }: IChatMessageProps) {
  const isUser = message.role === Role.user;
  const [userInfo] = useAtom(userInfoAtom);

  // Convert message.timestamp to a Date object, falling back to the current date if undefined.
  const date = message.timestamp ? new Date(message.timestamp) : new Date();
  const timeString = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex w-full gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
        <Avatar className={isUser ? "bg-primary" : "bg-muted"}>
          {userInfo?.avatar && isUser ? (
            <AvatarImage src={userInfo.avatar} alt="User" />
          ) : (
            <AvatarFallback>
              {isUser ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="max-w-[80%] break-words">
          <div>
            <div
              className={`rounded-lg p-3 text-left whitespace-pre-wrap ${
                isUser
                  ? "dark:bg-primary dark:text-primary-foreground bg-zinc-300 text-black"
                  : "bg-muted text-foreground"
              }`}
            >
              {message.content}
            </div>
            <div
              className={`text-muted-foreground mt-1 w-full text-xs ${
                isUser ? "pr-2 text-right" : "pl-2 text-left"
              }`}
            >
              {timeString}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
