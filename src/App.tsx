import { useState } from "react";
import "./App.css";
import ChatInterface from "@/components/chat";
import { Role } from "./state";
import { IMessage } from "./components/chat/types";
import { useAtom } from "jotai";
import { selectedCourseAtom } from "./state";

export default function App() {
  const [messages, setMessages] = useState<IMessage[] | null>(null);
  const [selectedCourse] = useAtom(selectedCourseAtom);
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
    <div className="flex h-screen">
      <ChatInterface
        messages={messages}
        courseName={selectedCourse?.name ?? null}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}
