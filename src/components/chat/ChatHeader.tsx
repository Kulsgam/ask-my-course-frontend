import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserAccountNav from "@/components/UserAccNav";
import { useAtom } from "jotai";
import { userInfoAtom } from "@/state";

interface ChatHeaderProps {
  courseName: string | null;
  toggleSidebar: () => void;
}

export default function ChatHeader({
  courseName,
  toggleSidebar,
}: ChatHeaderProps) {
  const [userInfo] = useAtom(userInfoAtom);
  const user = userInfo
    ? {
        name: userInfo.name,
        avatar: userInfo.avatar,
      }
    : null;
  return (
    <header className="flex items-center justify-between border-b p-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 font-medium">{courseName ?? ""}</h1>
      </div>

      <UserAccountNav user={user} />
    </header>
  );
}
