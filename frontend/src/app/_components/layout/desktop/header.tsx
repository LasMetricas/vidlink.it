"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { tokenAtom } from "@/store";
import { usePathname } from "next/navigation";

const HeaderDesktop = () => {
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

  if (loading) return <></>;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-gradient-to-b from-black/80 to-transparent">
      {/* Logo */}
      <Link href="/" className="text-xl font-bold">
        vidlink
      </Link>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-3">
        <Link
          href="/upload"
          className="bg-blue px-6 py-2 rounded-full text-sm font-semibold hover:bg-blue/80 transition-colors"
        >
          CREATE
        </Link>
        <Link
          href="/videos"
          className="bg-white/20 px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/30 transition-colors"
        >
          WATCH
        </Link>
        {isAuth ? (
          <Link href="/profile" className="ml-2">
            <img
              className="w-10 h-10 rounded-full border-2 border-white/50 hover:border-white transition-colors"
              src={pic || "/icon/layout/avatar.png"}
              alt="Profile"
            />
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-white/10 px-6 py-2 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors"
          >
            LOG IN
          </Link>
        )}
      </div>
    </header>
  );
};

export default HeaderDesktop;
