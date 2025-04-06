import { useEffect } from "react";
import "./App.css";
import ChatInterface from "@/components/chat";
import { fetchUserInfo } from "@/api/user";
import { useAtom } from "jotai";
import { userInfoAtom } from "./state";
// import { useNavigate } from "react-router-dom";

export default function App() {
  const [_, setUserInfo] = useAtom(userInfoAtom);
//   const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      const result = await fetchUserInfo();
      if (result.success) {
        const userInfo = result.data;
        if (userInfo) {
          setUserInfo(userInfo);
        }
      } else {
        // navigate("/login");
      }
    })();
  }, []);

  return (
    <div className="flex h-screen">
      <ChatInterface />
    </div>
  );
}
