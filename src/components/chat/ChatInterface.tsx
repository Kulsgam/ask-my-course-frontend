import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { Message } from "@/components/chat/types";

// Sample chat history data
const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! How can I help you with your course today?",
    role: "assistant",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: "2",
    content: "I'm having trouble with the assignment in module 3.",
    role: "user",
    timestamp: new Date(Date.now() - 1000 * 60 * 4),
  },
  {
    id: "3",
    content:
      "I'd be happy to help with that. What specific part of the assignment are you struggling with?",
    role: "assistant",
    timestamp: new Date(Date.now() - 1000 * 60 * 3),
  },
];

function ChatMessages({ messages }: { messages: Message[] }) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  );
}

function ChatInput({
  handleSendMessage,
}: {
  handleSendMessage: (inputValue: string) => void;
}) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="border-t p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
          setInputValue("");
        }}
        className="flex space-x-2"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSendMessage = (inputValue: string) => {
    if (!inputValue.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newUserMessage]);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm processing your question. Let me help you with that.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev: Message[]) => [...prev, assistantMessage]);
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <ChatSidebar isOpen={isSidebarOpen} />
      <div className="flex h-full flex-1 flex-col">
        <ChatHeader toggleSidebar={toggleSidebar} />
        <ChatMessages messages={messages} />
        <ChatInput handleSendMessage={handleSendMessage} />
      </div>
    </>
  );
}
