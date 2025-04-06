import { AxiosError, AxiosResponse } from "axios";

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: AxiosError | Error };

export async function fetchRequest<T>(
  func: () => Promise<AxiosResponse<T>>,
): Promise<Result<T>> {
  try {
    const res = await func();
    const data: T = res.data;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error as AxiosError | Error,
    };
  }
}
