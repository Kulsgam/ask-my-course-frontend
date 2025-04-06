import { useState } from "react";
import { SearchIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import { chatInfoAtom, userInfoAtom } from "@/state";
import { useNavigate } from "react-router-dom";

interface ChatSidebarProps {
  isOpen: boolean;
}

export default function ChatSidebar({ isOpen }: ChatSidebarProps) {
  const [userInfo] = useAtom(userInfoAtom);
  const [chatInfo] = useAtom(chatInfoAtom);
  const chatHistory = userInfo?.chatHistory ?? [];
  const [searchQuery, setSearchQuery] = useState("");

  // Filter chats based on search query
  const filteredChats = chatHistory
    .filter(
      (chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort(
      (a, b) =>
        b.lastMessageTimestamp.getTime() - a.lastMessageTimestamp.getTime(),
    );

  const selectedChatId = chatInfo?.id;

  const navigate = useNavigate();

  return (
    <div
      className={`bg-background border-r transition-all duration-300 ${
        isOpen ? "w-80" : "w-0 overflow-hidden"
      }`}
    >
      <div className="space-y-4 p-4">
        <div className="space-y-1">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => (window.location.href = "/")}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div>
          <div className="flex items-center justify-between py-2">
            <h3 className="text-muted-foreground text-sm font-medium">
              Recent Conversations
            </h3>
          </div>

          {/* Search Input */}
          <div className="mb-2">
            <div className="relative">
              <SearchIcon className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="max-h-[calc(100vh-200px)] space-y-1 overflow-y-auto">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat, idx) => {
                const isSelected = chat.id === selectedChatId;
                return (
                  <Button
                    key={idx}
                    variant="ghost"
                    className={`relative w-full justify-start overflow-hidden py-6 font-normal ${
                      isSelected ? "bg-accent" : ""
                    }`}
                    onClick={() => {
                      navigate(`/chat/${chat.id}`);
                    }}
                  >
                    <div className="flex w-full flex-col items-start overflow-hidden text-left">
                      <div className="flex w-full justify-between overflow-hidden">
                        <span className="truncate font-medium">
                          {chat.name}
                        </span>
                      </div>
                      <span className="text-muted-foreground w-full truncate text-xs">
                        {chat.lastRole}: {chat.lastMessage}
                      </span>
                    </div>
                  </Button>
                );
              })
            ) : (
              <p className="text-muted-foreground pt-4 text-center text-sm">
                No conversations found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
