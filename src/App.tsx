import { useEffect } from "react";
import "./App.css";
import ChatInterface from "@/components/chat";
import { fetchUserInfo } from "@/api/user";
import { useAtom } from "jotai";
import { userInfoAtom, chatInfoAtom } from "./state";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import { fetchChat } from "@/api/user";
import Login from "@/components/user/Login";
import Logout from "@/components/user/Logout";

function ChatWithIdWrapper() {
  const { chatId } = useParams();
  const [, setChatInfo] = useAtom(chatInfoAtom);
  const navigate = useNavigate();

  const chatIdNumber = Number(chatId);
  const isInvalidChatId = !chatId || isNaN(chatIdNumber) || chatIdNumber <= 0;

  useEffect(() => {
    if (isInvalidChatId) {
      return;
    }
    (async function () {
      const result = await fetchChat(chatIdNumber);
      if (result.success) {
        const chatInfo = result.data;
        if (chatInfo) {
          setChatInfo(chatInfo);
        }
      } else {
        navigate("/");
      }
    })();
  }, [chatId]);

  if (isInvalidChatId) {
    return <Navigate to="/" />;
  }

  return <ChatInterface />;
}

function HomeWrapper() {
  return <ChatInterface />;
}

export default function App() {
  const [, setUserInfo] = useAtom(userInfoAtom);
  const navigate = useNavigate();

  useEffect(() => {
    (async function () {
      const result = await fetchUserInfo();
      const userInfo = result.success ? result.data : null;
      if (userInfo) {
        setUserInfo(userInfo);
      } else {
        navigate("/login");
      }
    })();
  }, []);

  return (
    <div className="flex h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeWrapper />} />
        <Route path="/chat/:chatId" element={<ChatWithIdWrapper />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
