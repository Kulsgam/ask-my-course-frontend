import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAccountNav from "@/components/UserAccNav";

interface ChatHeaderProps {
  courseName: string | null;
  toggleSidebar: () => void;
}

export default function ChatHeader({
  courseName,
  toggleSidebar,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 font-medium">{courseName ?? ""}</h1>
      </div>

      <UserAccountNav />
    </header>
  );
}
