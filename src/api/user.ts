import { createClient } from "@supabase/supabase-js";
import { IChatInfo, IUserInfo } from "@/state";
import { Result } from "@/api/utils";

const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  throw new Error("Supabase URL or Anon Key is not defined");
}

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

// ✅ Checks if a user is logged in
export async function isLoggedIn() {
  const user = await supabase.auth.getUser();
  console.log(user);
  return user.error === null;
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

  const { data, error: userError } = await supabase
    .from("User")
    .select("*")
    .eq("userid", user.id)
    .single();

  if (userError) return { success: false, error: userError };
  return { success: true, data };
}

// ✅ Fetch a chat by chatId
export async function fetchChat(chatId: number): Promise<Result<IChatInfo>> {
  const { data, error } = await supabase
    .from("chat")
    .select("*, message(*), messageSequence(*)") // include related messages if needed
    .eq("id", chatId)
    .single();

  if (error) return { success: false, error };
  return { success: true, data };
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

  // Fetch user info from `User` table
  const { data: userInfo, error: userError } = await supabase
    .from("User")
    .select("*")
    .eq("userid", data.user.id)
    .single();

  if (userError) return { success: false, error: userError };
  return { success: true, data: userInfo };
}

// ✅ Log out
export async function logOut(): Promise<Result<void>> {
  const { error } = await supabase.auth.signOut();

  if (error) return { success: false, error };
  return { success: true, data: undefined };
}
