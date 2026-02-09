"use client";
import Link from "next/link";
import Item from "./headerItem";
import { useEffect, useRef, useState } from "react";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { tokenAtom } from "@/store";
import { usePathname } from "next/navigation";
import { Upload } from "lucide-react";

const HeaderDesktop = () => {
  const [pic, setPic] = useState<string>("/icon/layout/avatar.png");
  const menuRef = useRef<HTMLHeadElement>(null);
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
    <header
      ref={menuRef}
      className={`${
        isAuth ? "pt-[14.5px]" : "pt-[31px]"
      } absolute top-0 left-0 right-0 z-50 bg-transparent flex px-[40px]  justify-between`}
    >
      <div className="flex items-center gap-[25px]">
        <Link href={"/"}>
          <img
            className="w-[153px]"
            src="/icon/desktop/layout/logo.png"
            alt=""
          />
        </Link>
        <a
          href="https://www.falca.com"
          target="_blank"
          rel="noopener noreferrer"
          className="uppercase text-[14px] font-semibold hover:underline"
        >
          powered by falca
        </a>
      </div>
      {isAuth ? (
        <div className="flex items-center gap-[50px] ">
          <Item url={"/videos"} name="VIDEOS" />
          <div className="flex items-center gap-[7px]">
            <Item url={"/upload"} name="UPLOAD" />
            <Upload className="size-[19px]" />
          </div>
          <Item url={"/drafts"} name="DRAFTS" />
          <img
            className="w-[32px]"
            src="/icon/desktop/layout/notify.png"
            alt=""
            loading="eager"
          />
          <Link href={"/profile"}>
            <img
              className="size-[55px] rounded-full"
              src={pic ? pic : "/icon/desktop/layout/avatar.png"}
              alt=""
              loading="eager"
            />
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-[100px]">
          <Item url={"/videos"} name="VIDEOS" />
          <Item url={"/login"} name="LOG IN" />
        </div>
      )}
    </header>
  );
};
export default HeaderDesktop;
