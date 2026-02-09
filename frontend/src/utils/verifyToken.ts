import { jwtVerify } from "jose";
import Cookies from "js-cookie";
export const verifyToken = async () => {
  const token = Cookies.get("token") as string;
  if (!token || typeof token !== "string") {
    return false;
  }
  const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET as string;
  if (!jwtSecret || typeof jwtSecret !== "string") {
    return false;
  }
  try {
    await jwtVerify(token, new TextEncoder().encode(jwtSecret));
    return true;
  } catch {
    return false;
  }
};
