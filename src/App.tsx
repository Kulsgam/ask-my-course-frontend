import "./App.css";
import ChatInterface from "@/components/chat";

export default function App() {
  return (
    <div className="flex h-screen">
      <ChatInterface userMessages={null} />
    </div>
  );
}
