import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { IMessage } from "@/components/chat/types";
import { Role, selectedCourseAtom } from "@/state";
import { useAtom } from "jotai";

// Sample chat history data

function ChatMessages({ messages }: { messages: IMessage[] | null }) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      ) : (
        <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-gray-500 select-none">
          <img
            src="./favicon.png"
            alt="Logo"
            width={100}
            height={100}
          />
          <div className="text-3xl font-medium">
            Ready to chat whenever you are! 😊
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
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
          className="min-h-[48px] flex-1 resize-none rounded-xl bg-zinc-800 text-white placeholder-zinc-400 focus-visible:ring-1 focus-visible:ring-zinc-500"
          rows={1}
        />
        <Button type="submit" className="h-[48px] w-[48px] rounded-xl p-0">
          <Send className="mx-auto h-5 w-5" />
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
