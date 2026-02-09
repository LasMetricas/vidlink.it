"use client";
import Link from "next/link";
import Item from "./headerItem";
import { useEffect, useRef, useState } from "react";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import useClickOutside from "@/hooks/useClickOutside";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { tokenAtom } from "@/store";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { AlignJustify, X } from "lucide-react";

const HeaderMobile = () => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const [isAnimate, setIsAnimate] = useState<boolean>(false);
  const [isBlurred, setIsBlurred] = useState(false);
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, () =>
    setIsOpenMenu(false)
  );

  useEffect(() => {
    if (isOpenMenu) {
      setIsAnimate(true);
    } else {
      setIsAnimate(false);
    }
  }, [isOpenMenu]);

  // Don't show on home page - mobile home has its own header
  if (pathName === "/") return null;

  if (loading) return <></>;
  return !isOpenMenu ? (
    // Closed header
    <header className="fixed z-10 top-0 left-0 w-screen">
      <div
        className={`${
          isBlurred && pathName !== "/videos"
            ? "backdrop-blur-m "
            : "bg-transparent"
        } flex justify-between items-center mt-[27px] mx-[30px] max-[380px]:mx-[13px] px-[3px] py-[3px] rounded-full`}
      >
        <button onClick={() => setIsOpenMenu((prev) => !prev)}>
          {/* <Image
            width={32}
            height={32}
            className="size-[32px]"
            src="/icon/layout/menu.svg"
            alt=""
            loading="eager"
            priority
          /> */}
          <AlignJustify className="size-[31px] h-[35px]" />
        </button>
        <div className="flex gap-[9px] h-[32px] items-center">
          {isAuth ? (
            <>
              <Link href={"/"}>
                <Image
                  width={32}
                  height={32}
                  className="size-[32px]"
                  src="/icon/layout/alert.png"
                  alt=""
                  loading="eager"
                />
              </Link>
              <Link href={"/profile"}>
                <img
                  width={33.95}
                  height={33}
                  className="w-[33.95px] h-[33px] rounded-full"
                  src={pic ? pic : "/icon/layout/avatar.png"}
                  alt=""
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
              </Link>
            </>
          ) : (
            <Link
              href={"/login"}
              className="text-[16px] px-[5px] py-[1px] font-semibold border-foreground border-[2px] rounded-[7px]"
            >
              LOG IN
            </Link>
          )}
        </div>
      </div>
    </header>
  ) : (
    // Opened header
    <header ref={menuRef} className={` fixed z-10 top-0 left-0 w-screen `}>
      <div
        className={` pt-[27px] bg-transparent mx-[22px] max-[380px]:mx-[5px]`}
      >
        <button
          onClick={() => setIsOpenMenu((prev) => !prev)}
          className={`${
            isBlurred && pathName !== "/videos"
              ? "backdrop-blur-md "
              : "bg-transparent"
          } p-[3px] rounded-full ml-[7px] `}
        >
          {/* <Image
            width={32}
            height={32}
            className="size-[32px]"
            src="/icon/layout/close.svg"
            alt=""
            loading="eager"
            priority
          /> */}
          <X className="size-[35px]" />
        </button>
        <nav
          className={`${
            isAnimate ? "scale-y-[1] opacity-100" : "scale-y-[0]"
          } transition-all duration-100 mt-[4px] flex px-[10px] py-[8px] rounded-full justify-between
           ${
             isBlurred && pathName !== "/videos"
               ? "backdrop-blur-md "
               : "bg-transparent"
           }`}
        >
          <Item
            setIsOpenMenu={setIsOpenMenu}
            url={"/"}
            name="HOME"
            isAuth={true}
          />
          <Item
            setIsOpenMenu={setIsOpenMenu}
            url={"/videos"}
            name="VIDEOS"
            isAuth={true}
          />
          <Item
            setIsOpenMenu={setIsOpenMenu}
            url={"/upload"}
            name="UPLOAD"
            isAuth={isAuth}
          />
          <Item
            setIsOpenMenu={setIsOpenMenu}
            url={"/profile"}
            name="PROFILE"
            isAuth={isAuth}
          />
        </nav>
      </div>
    </header>
  );
};
export default HeaderMobile;
