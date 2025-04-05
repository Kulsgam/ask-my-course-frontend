import axios from "axios";
import { fetchRequest, Result, API_URL } from "@/api/utils";

export async function fetchUniversities(): Promise<Result<string[]>> {
  return fetchRequest(async () => {
    const response = await axios.get<string[]>(`${API_URL}/api/universities`);
    return response.data;
  });
}
