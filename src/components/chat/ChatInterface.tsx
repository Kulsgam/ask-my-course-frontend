import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { IMessage } from "@/components/chat/types";
import { Role } from "@/state";

// Sample chat history data

function ChatMessages({ messages }: { messages: IMessage[] | null }) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages ? (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      ) : (
        <div className="flex h-full items-center justify-center text-5xl text-gray-500">
          How can I help? 😊
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

export default function ChatInterface({
  userMessages,
}: {
  userMessages: IMessage[] | null;
}) {
  const [messages, setMessages] = useState<IMessage[] | null>(userMessages);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
