"use client";
import useClickOutside from "@/hooks/useClickOutside";
import Link from "next/link";
import React, { useRef } from "react";

interface Type {
  setIsOpen(value: boolean): void;
}

const EditPic: React.FC<Type> = ({ setIsOpen }) => {
  const menuRef = useRef<HTMLUListElement>(null);

  // Close menu on outside click
  useClickOutside(menuRef as React.RefObject<HTMLElement>, () =>
    setIsOpen(false)
  );

  return (
    <>
      <ul
        ref={menuRef}
        className=" absolute top-[30px] right-1/2 translate-x-1/2  flex flex-col justify-between bg-[#191919] text-[13px] font-semibold w-[227px] h-[104px] px-[15px] py-[10px] border-[1px] rounded-[9.1px]"
      >
        <li className=" flex items-center gap-[10px]">
          <img className="size-[18px]" src="/icon/profile/library.png" alt="" />
          <label htmlFor="upload">CHOOSE FROM LIBRARY</label>
        </li>
        <input type="file" id="upload" className=" hidden" />
        <li className="flex items-center gap-[10px]">
          <img className="size-[18px]" src="/icon/profile/take.png" alt="" />
          <Link href={"/camera"}>TAKE A PHOTO</Link>
        </li>
        <li className="text-[#EA003B] flex items-center gap-[10px]">
          <img className="size-[18px]" src="/icon/profile/remove.png" alt="" />
          REMOVE PICTURE
        </li>
      </ul>
    </>
  );
};
export default EditPic;
