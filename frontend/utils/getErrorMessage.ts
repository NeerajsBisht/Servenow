import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  const err = error as AxiosError<any>;
  return err?.response?.data?.message || "Something went wrong";
}
