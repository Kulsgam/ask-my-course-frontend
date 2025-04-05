import axios from "axios";
import { fetchRequest, Result } from "@/api/utils";

export async function fetchUniversities(): Promise<Result<string[]>> {
  return fetchRequest(async () => {
    const response = await axios.get<string[]>("/api/universities");
    return response.data;
  });
}
