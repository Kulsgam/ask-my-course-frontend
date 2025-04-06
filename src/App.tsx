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

  if (!chatId || isNaN(chatIdNumber) || chatIdNumber <= 0) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
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
      if (result.success) {
        const userInfo = result.data;
        if (userInfo) {
          setUserInfo(userInfo);
        }
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
        <Route path="/" element={<Logout />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
