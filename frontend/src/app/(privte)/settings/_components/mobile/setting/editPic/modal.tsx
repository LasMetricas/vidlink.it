"use client";
import useClickOutside from "@/hooks/useClickOutside";
import { errorModal } from "@/utils/confirm";
import React, { ChangeEvent, useRef } from "react";

interface Type {
  setEdit(value: string): void;
  setImgUrl(value: string): void;
  setImgBase64(value: string): void;
  setImgFile(value: File | null): void;
  picture: string;
}

const Modal: React.FC<Type> = ({
  setEdit,
  setImgUrl,
  setImgFile,
  setImgBase64,
  picture,
}) => {
  const menuRef = useRef<HTMLUListElement>(null);

  useClickOutside(menuRef as React.RefObject<HTMLElement>, () => setEdit(""));

  const handleOpenCamera = () => {
    setEdit("camera");
  };
  const handleRemove = () => {
    setEdit("");
    setImgUrl(picture);
    setImgFile(null);
  };

  function handleUploadImg(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/webp",
        "image/svg+xml",
        "image/bmp",
      ];

      if (!allowedTypes.includes(file.type)) {
        errorModal("Invalid file type. Please upload an image.");
        return;
      }

      setImgFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImgBase64(reader.result as string); // Set Base64 data
      };
      reader.readAsDataURL(file);
      setEdit("process");
    }
  }

  return (
    <>
      <ul
        ref={menuRef}
        className="absolute top-[0px] -left-[5px] flex flex-col justify-between bg-[#191919] text-[13px] tracking-normal font-semibold w-[235px] h-[104px] px-[15px] py-[10px] border-[1px] rounded-[9.1px]"
      >
        <li className="flex items-center gap-[10px]">
          <img className="size-[18px]" src="/icon/profile/library.png" alt="" />
          <label htmlFor="upload">CHOOSE FROM LIBRARY</label>
        </li>
        <input
          onChange={handleUploadImg}
          type="file"
          id="upload"
          className=" hidden"
          accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/svg+xml, image/bmp"
        />
        <li className="flex items-center gap-[10px]">
          <img className="size-[18px]" src="/icon/profile/take.png" alt="" />
          <button onClick={handleOpenCamera}>TAKE A PHOTO</button>
        </li>
        <button onClick={handleRemove}>
          <li className="text-[#EA003B] flex items-center gap-[10px]">
            <img
              className="size-[18px]"
              src="/icon/profile/remove.png"
              alt=""
            />
            REMOVE PICTURE
          </li>
        </button>
      </ul>
    </>
  );
};
export default Modal;
