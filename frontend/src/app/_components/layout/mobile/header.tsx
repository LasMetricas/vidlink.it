"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { tokenAtom } from "@/store";
import { usePathname } from "next/navigation";

const HeaderMobile = () => {
  const [pic, setPic] = useState<string>("/icon/layout/avatar.png");
  const [token] = useAtom<boolean>(tokenAtom);
  const { loading, isAuth } = useVerifyAuth();
  const pathName = usePathname();

  useEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setPic(parsedUser.picture);
    }
  }, [token, pathName]);

  // Don't show on home page - mobile home has its own header
  if (pathName === "/") return null;

  if (loading) return <></>;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
      {/* Logo */}
      <Link href="/" className="text-lg font-bold">
        vidlink
      </Link>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <Link
          href="/upload"
          className="bg-blue px-4 py-1.5 rounded-full text-xs font-semibold"
        >
          CREATE
        </Link>
        <Link
          href="/videos"
          className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-semibold"
        >
          WATCH
        </Link>
        {isAuth ? (
          <Link href="/profile" className="ml-1">
            <img
              className="w-8 h-8 rounded-full border-2 border-white/50"
              src={pic || "/icon/layout/avatar.png"}
              alt="Profile"
            />
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-white/10 px-4 py-1.5 rounded-full text-xs font-semibold"
          >
            LOG IN
          </Link>
        )}
      </div>
    </header>
  );
};

export default HeaderMobile;
