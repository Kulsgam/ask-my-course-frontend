import { createClient } from "@supabase/supabase-js";
import { IChatInfo, IUserInfo } from "@/state";
import { fetchRequest, Result } from "@/api/utils";
import axios from "axios";

const { VITE_SUPABASE_URL, VITE_SUPABASE_API, VITE_API_URL } = import.meta.env;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_API || !VITE_API_URL) {
  throw new Error(
    "Supabase URL or Anon Key is not defined or API URL is not defined",
  );
}

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_API);

// ✅ Checks if a user is logged in
export async function isLoggedIn() {
  const user = await supabase.auth.getUser();
  return user.error === null;
}

async function getUser(userId: string) {
  const { data: userData, error: userError } = await supabase
    .from("User")
    .select("*")
    .eq("userid", userId)
    .single();

  if (userError) {
    return null;
  }

  // Find the courses for the user
  const { data: courses, error: courseError } = await supabase
    .from("usercourse")
    .select("*")
    .eq("userid", userId)
    .eq("university", userData?.university);

  if (courseError) {
    return null;
  }

  // Make it a course name list
  const courseNames = courses.map((course) => course.coursename);

  const { data: chatData, error: chatError } = await supabase
    .from("chat")
    .select(
      `id,
        coursename,
        name,
        university,
        userid,
        message (
            id,
            content,
            role,
            timestamp
        )`,
    )
    .in("coursename", courseNames)
    .eq("university", userData.university);

  if (chatError) {
    return null;
  }

  const userInfo: IUserInfo = {
    uuid: userData.userid,
    name: userData.name,
    email: userData.email,
    avatar: userData.avatar,
    courses: courseNames,
    university: userData.university,
    chatHistory: chatData.map((chat) => ({
      id: chat.id,
      name: chat.name,
      courseName: chat.coursename,
      university: chat.university,
      userId: chat.userid,
      lastMessageTimestamp: new Date(
        chat.message[chat.message.length - 1]?.timestamp,
      ),
      lastMessage: chat.message[chat.message.length - 1]?.content || "",
      lastRole: chat.message[chat.message.length - 1]?.role || "user",
    })),
  };

  return userInfo;
}

// ✅ Fetch user info from the Supabase 'User' table
export async function fetchUserInfo(): Promise<Result<IUserInfo | null>> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { success: true, data: null };
  }

  const userInfo = await getUser(user.id);
  if (!userInfo) {
    return { success: false, error: new Error("Failed to fetch user info") };
  }

  return { success: true, data: userInfo };
}

// ✅ Fetch a chat by chatId
export async function fetchChat(chatId: number): Promise<Result<IChatInfo>> {
  const { data, error } = await supabase
    .from("chat")
    .select("*, message(*), messagesequence(*)") // include related messages if needed
    .eq("id", chatId)
    .single();

  if (error) return { success: false, error };

  const chatInfo: IChatInfo = {
    id: data.id,
    name: data.name,
    courseName: data.coursename,
    university: data.university,
    userId: data.userid,
    messages: data.message.map((message: any) => ({
      id: message.id,
      content: message.content,
      role: message.role,
      timestamp: new Date(message.timestamp),
    })),
  };

  return { success: true, data: chatInfo };
}

// ✅ Log in with Supabase auth
export async function logIn(
  email: string,
  password: string,
): Promise<Result<IUserInfo>> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error };

  const userInfo = await getUser(data.user.id);
  if (!userInfo) {
    return { success: false, error: new Error("Failed to fetch user info") };
  }

  return { success: true, data: userInfo };
}

// ✅ Log out
export async function logOut(): Promise<Result<void>> {
  const { error } = await supabase.auth.signOut();

  if (error) return { success: false, error };
  return { success: true, data: undefined };
}

export async function createNewChatOnServer(
  courseName: string,
  university: string,
  message: string,
  uuid: string,
): Promise<Result<IChatInfo>> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error("Failed to get session");
  }
  const token = session.access_token;
  return await fetchRequest<IChatInfo>(async () => {
    return await axios.post(
      `${VITE_API_URL}/api/chat`,
      {
        university,
        courseName,
        query: message,
        uuid,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  });
}

export async function sendQuery(
  chat_id: number,
  student_query: string,
  is_query_added: boolean = false,
): Promise<Result<string>> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error || !session) {
    throw new Error("Failed to get session");
  }
  const token = session.access_token;
  return await fetchRequest(async () => {
    return await axios.post(
      `${VITE_API_URL}/api/query`,
      {
        chat_id,
        student_query,
        is_query_added,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  });
}
