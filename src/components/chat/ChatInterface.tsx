import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ChatSidebar from "./ChatSidebar";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import { IMessage } from "@/components/chat/types";

// Sample chat history data

function ChatMessages({ messages }: { messages: IMessage[] | null }) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      {messages ? (
        messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))
      ) : (
        <div className="flex h-full items-center justify-center text-5xl text-gray-500 select-none">
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
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(inputValue);
              setInputValue("");
            }
          }}
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
  messages,
  courseName,
  handleSendMessage,
}: {
  messages: IMessage[] | null;
  courseName: string | null;
  handleSendMessage: (inputValue: string) => void;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
