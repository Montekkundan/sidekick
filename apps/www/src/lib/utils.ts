import { APP_URL } from "@/lib/config";

export function absoluteUrl(path: string) {
  return `${APP_URL}${path}`;
}
