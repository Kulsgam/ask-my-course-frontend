import { useState } from "react";
import { ChevronDown, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample course data
const courses = [
  { id: "1", name: "Introduction to Programming" },
  { id: "2", name: "Data Structures and Algorithms" },
  { id: "3", name: "Web Development Fundamentals" },
  { id: "4", name: "Machine Learning Basics" },
];

// Sample chat history data
const chatHistory = [
  {
    id: "1",
    title: "Assignment Help",
    preview: "I need help with my assignment...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    unread: false,
  },
  {
    id: "2",
    title: "Project Questions",
    preview: "How do I start the final project?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unread: true,
  },
  {
    id: "3",
    title: "Exam Preparation",
    preview: "What topics should I focus on?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unread: true,
  },
];

interface ChatSidebarProps {
  isOpen: boolean;
}

export default function ChatSidebar({ isOpen }: ChatSidebarProps) {
  const [selectedCourse, setSelectedCourse] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div
      className={`bg-background border-r transition-all duration-300 ${isOpen ? "w-80" : "w-0 overflow-hidden"}`}
    >
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <Select value={selectedCourse} onValueChange={setSelectedCourse}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {chatHistory.map((chat) => (
              <Button
                key={chat.id}
                variant="ghost"
                className="relative w-full justify-start font-normal"
              >
                <div className="flex flex-col items-start text-left">
                  <div className="flex w-full justify-between">
                    <span className="font-medium">{chat.title}</span>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(chat.timestamp)}
                    </span>
                  </div>
                  <span className="text-muted-foreground w-full truncate text-xs">
                    {chat.preview}
                  </span>
                </div>
                {chat.unread && (
                  <div className="bg-primary absolute top-1/2 right-2 h-2 w-2 -translate-y-1/2 rounded-full"></div>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
