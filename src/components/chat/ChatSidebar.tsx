import { useState } from "react";
import { SearchIcon, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAtom } from "jotai";
import { selectedCourseAtom } from "@/state";
import { userInfoAtom } from "@/state";

interface ChatSidebarProps {
  isOpen: boolean;
}


export default function ChatSidebar({ isOpen }: ChatSidebarProps) {
  const [userInfo] = useAtom(userInfoAtom);
  const chatHistory = userInfo?.chatHistory ?? [];
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div
      className={`bg-background border-r transition-all duration-300 ${isOpen ? "w-80" : "w-0 overflow-hidden"}`}
    >
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Button variant="outline" className="w-full justify-start">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between py-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              Recent Conversations
            </h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <SearchIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {chatHistory.map((chat, idx) => (
              <Button
                key={idx}
                variant="ghost"
                className="relative w-full justify-start overflow-hidden pb-4 font-normal"
              >
                <div className="flex w-full flex-col items-start overflow-hidden text-left">
                  <div className="flex w-full justify-between overflow-hidden">
                    <span className="truncate font-medium">{chat.name}</span>
                  </div>
                  <span className="text-muted-foreground w-full truncate text-xs">
                    {chat.lastRole}: {chat.lastMessage}
                  </span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
