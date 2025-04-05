import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { IMessage } from "@/components/chat/types";
import { Role, selectedCourseAtom } from "@/state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/state";
// Sample chat history data
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function CourseSelector() {
  const [userInfo] = useAtom(userInfoAtom);
  const courses = userInfo?.courses ?? [];
  const [selectedCourse, setSelectedCourse] = useAtom(selectedCourseAtom);

  const isCourseSelected =
    !!selectedCourse && selectedCourse.name !== "__none__";

  const selectTrigger = (
    <SelectTrigger className="w-full">
      {!isCourseSelected ? (
        <p className="text-gray-400 italic">Select a course</p>
      ) : (
        <p className="text-black dark:text-white">{selectedCourse.name}</p>
      )}
    </SelectTrigger>
  );

  return (
    <Select
      value={selectedCourse?.name ?? "__none__"}
      onValueChange={(value) => {
        if (value === "__none__") {
          setSelectedCourse(null);
        } else {
          const course = courses.find((c) => c.name === value) ?? null;
          setSelectedCourse(course);
        }
      }}
    >
      {isCourseSelected ? (
        selectTrigger
      ) : (
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>{selectTrigger}</TooltipTrigger>
            <TooltipContent>
              Please select a course to get started
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <SelectContent>
        <SelectItem
          className="text-gray-400 italic hover:bg-gray-100 dark:hover:bg-gray-800"
          value="__none__"
          key="__none__"
        >
          Select a course
        </SelectItem>
        {courses.map((course) => (
          <SelectItem key={course.id} value={course.name}>
            {course.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ChatMessages({ messages }: { messages: IMessage[] | null }) {
  const puns = [
    "Was that in a tute? Let me check",
    "Syllabus memorised better than you",
    "Chatbot or secret course weapon?",
    "Got a course question, or just testing my genius?",
    "Course content? I'm basically the answer key",
  ];

  // Only choose pun when reloaded using hooks
  const pun = useMemo(
    () => puns[Math.floor(Math.random() * puns.length)],
    [messages],
  );

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-gray-500 select-none">
          <img src="./favicon.png" alt="Logo" width={100} height={100} />
          <div className="text-3xl font-medium">{pun}</div>
          <div>
            <CourseSelector />
          </div>
        </div>
      )}
    </div>
  );
}

function ChatInput({
  handleSendMessage,
}: {
  handleSendMessage: (inputValue: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [selectedCourse] = useAtom(selectedCourseAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || selectedCourse?.name === "__none__" || !selectedCourse) {
      return;
    }
    handleSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="border-t px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your message..."
          className="min-h-[48px] flex-1 resize-none rounded-xl bg-gray-200 text-black placeholder-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-500 dark:bg-zinc-800 dark:text-white"
          rows={1}
        />
        <Button type="submit" className="h-[48px] w-[48px] rounded-xl p-0">
          <Send className="dark:bg-primary bg-[oklch(0.205 0 0)] mx-auto h-5 w-5 text-white dark:text-black" />
        </Button>
      </form>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<IMessage[] | null>(null);
  const [selectedCourse] = useAtom(selectedCourseAtom);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const courseName = selectedCourse?.name ?? null;

  const handleSendMessage = (inputValue: string) => {
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage: IMessage = {
      id: Date.now().toString(),
      content: inputValue,
      role: Role.user,
      timestamp: new Date(),
    };

    setMessages([...(messages ?? []), newUserMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: IMessage = {
        id: (Date.now() + 1).toString(),
        content: "I'm processing your question. Let me help you with that.",
        role: Role.assistant,
        timestamp: new Date(),
      };
      setMessages((prev: IMessage[] | null) => [
        ...(prev ?? []),
        assistantMessage,
      ]);
    }, 1000);
  };

  return (
    <>
      <ChatSidebar isOpen={isSidebarOpen} />
      <div className="flex h-full flex-1 flex-col">
        <ChatHeader courseName={courseName} toggleSidebar={toggleSidebar} />
        <ChatMessages messages={messages} />
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </>
  );
}
