import { useEffect, useMemo, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { IMessage } from "@/components/chat/types";
import { chatInfoAtom, Role, selectedCourseAtom } from "@/state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/state";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { useNavigate } from "react-router-dom";
import { createNewChatOnServer, sendQuery } from "@/api/user";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

function CourseSelector({ tryTrigger }: { tryTrigger: boolean }) {
  const [userInfo] = useAtom(userInfoAtom);
  const courses = userInfo?.courses ?? [];
  const [selectedCourse, setSelectedCourse] = useAtom(selectedCourseAtom);
  const [showPopover, setShowPopover] = useState(false);

  const isCourseSelected = selectedCourse && selectedCourse !== "__none__";

  useEffect(() => {
    if (tryTrigger && !isCourseSelected) {
      setShowPopover(true);
    } else {
      setShowPopover(false);
    }
  }, [tryTrigger, isCourseSelected]);

  const selectComponent = (
    <Select
      value={selectedCourse ?? "__none__"}
      onValueChange={(value) => {
        if (value === "__none__") {
          setSelectedCourse(null);
        } else {
          const course = courses.find((c) => c === value) ?? null;
          setSelectedCourse(course);
        }
      }}
    >
      <SelectTrigger className="w-full">
        {!isCourseSelected ? (
          <p className="text-gray-400 italic">Select a course</p>
        ) : (
          <p className="text-black dark:text-white">{selectedCourse}</p>
        )}
      </SelectTrigger>
      <SelectContent>
        <SelectItem
          className="text-gray-400 italic hover:bg-gray-100 dark:hover:bg-gray-800"
          value="__none__"
          key="__none__"
        >
          Select a course
        </SelectItem>
        {courses.map((course, index) => (
          <SelectItem key={`${course}-${index}`} value={course}>
            {course}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <Popover open={showPopover}>
      <PopoverTrigger asChild>
        <div className="w-full">{selectComponent}</div>
      </PopoverTrigger>
      <PopoverContent className="text-sm text-gray-700">
        Please select a course to get started
      </PopoverContent>
    </Popover>
  );
}

function ChatMessages({
  messages,
  tryTrigger = false,
}: {
  messages: IMessage[] | null;
  tryTrigger: boolean;
}) {
  const puns = [
    "Was that in a tute? Let me check",
    "Syllabus memorised better than you",
    "Chatbot or secret course weapon?",
    "Got a course question, or just testing my genius?",
    "Course content? I'm basically the answer key",
  ];

  const pun = useMemo(
    () => puns[Math.floor(Math.random() * puns.length)],
    [messages],
  );

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => (
          // Ensure that each message has a unique key
          <ChatMessage key={`${message.role}-${message.timestamp}-${index}`} message={message} />
        ))
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-gray-500 select-none">
          <img src="/favicon.png" alt="Logo" width={100} height={100} />
          <div className="text-3xl font-medium">{pun}</div>
          <div>
            <CourseSelector tryTrigger={tryTrigger} />
          </div>
        </div>
      )}
    </div>
  );
}

function ChatInput({
  handleSendMessage,
  setTryTrigger,
}: {
  handleSendMessage: (inputValue: string) => void;
  setTryTrigger: (value: boolean) => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [selectedCourse] = useAtom(selectedCourseAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      return;
    }
    if (selectedCourse === "__none__" || !selectedCourse) {
      setTryTrigger(true);
      setTimeout(() => {
        setTryTrigger(false);
      }, 3000);
      return;
    }
    handleSendMessage(inputValue);
    setInputValue("");
  };

  return (
    <div className="border-t px-4 py-3">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <Textarea
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Type your message..."
          className="max-h-40 min-h-[48px] w-full max-w-full resize-none overflow-y-auto rounded-xl bg-gray-200 break-words break-all text-black placeholder-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-500 dark:bg-zinc-800 dark:text-white"
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
  const [tryTrigger, setTryTrigger] = useState(false);
  const [selectedCourse] = useAtom(selectedCourseAtom);
  const [chatInfo, setChatInfo] = useAtom(chatInfoAtom);
  const [userInfo] = useAtom(userInfoAtom);
  const university = userInfo?.university ?? "RMIT";
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const courseName = selectedCourse ?? null;
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    let isQueryAdded: boolean = false;
    let shouldNavigate: boolean = false;

    try {
      // Use a local variable to store the current chat info.
      let currentChatInfo = chatInfo;
      if (!currentChatInfo) {
        const response = await createNewChatOnServer(
          courseName ?? "MATH",
          university,
          message,
          userInfo?.uuid ?? "",
        );

        if (!response.success) {
          throw new Error(
            "Failed to create new chat: " + response.error.message,
          );
        }

        const _chatInfo = response.data;
        if (!_chatInfo) {
          throw new Error("Failed to create new chat");
        }
        isQueryAdded = true; // createNewChatOnServer already added the query
        shouldNavigate = true; // we are creating a new chat
        currentChatInfo = _chatInfo;
        setChatInfo(_chatInfo);
      }

      // Use the local variable (currentChatInfo) for sending the query.
      const chatbot_res = await sendQuery(
        currentChatInfo.id,
        message,
        isQueryAdded,
      );

      if (!chatbot_res.success) {
        throw new Error("Failed to send message: " + chatbot_res.error.message);
      }

      // Safely generate new message IDs based on the last message (or start at 1)
      const lastMessageId =
        currentChatInfo.messages && currentChatInfo.messages.length > 0
          ? currentChatInfo.messages[currentChatInfo.messages.length - 1].id
          : 0;

      const userMessage: IMessage = {
        id: lastMessageId + 1,
        content: message,
        role: Role.user,
        timestamp: new Date(),
      };

      const assistantMessage: IMessage = {
        id: lastMessageId + 2,
        content: chatbot_res.data,
        role: Role.assistant,
        timestamp: new Date(),
      };

      // Update messages in the local copy and then update state.
      currentChatInfo.messages.push(userMessage);
      currentChatInfo.messages.push(assistantMessage);
      // Create a new object for state update to trigger a re-render.
      setChatInfo({ ...currentChatInfo });

      if (shouldNavigate) {
        navigate(`/chat/${currentChatInfo.id}`);
      }
    } catch (error: any) {
      toast.error(error.message ?? "An error occurred");
      console.error("Error in handleSendMessage:", error);
    }
  };

  return (
    <>
      <ChatSidebar isOpen={isSidebarOpen} />
      <div className="flex h-full flex-1 flex-col">
        <ChatHeader courseName={courseName} toggleSidebar={toggleSidebar} />
        <ChatMessages
          messages={chatInfo?.messages ?? []}
          tryTrigger={tryTrigger}
        />
        <Toaster />
        <ChatInput
          handleSendMessage={handleSendMessage}
          setTryTrigger={setTryTrigger}
        />
      </div>
    </>
  );
}
