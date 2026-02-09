"use client";

import { formatBigNum } from "@/utils/calculateBigNum";
import { Eye, FolderOpen, Heart, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Type {
  handleEdit(): void;
  confirmDelete(): void;
  cards: number;
  likes: number;
  views: number;
}

const SettingBar: React.FC<Type> = ({
  handleEdit,
  confirmDelete,
  cards,
  likes,
  views,
}) => {
  const [isOpen] = useState<boolean>(false);
  const [, setHidden] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const modal = setTimeout(() => {
        setHidden(true);
      }, 2000);
      return () => clearTimeout(modal);
    }
  }, [isOpen]);

  return (
    <div className="flex flex-wrap justify-between items-center h-[67px] w-full font-semibold">
      <div className="flex gap-[35px] items-center text-[24px]">
        <img
          src="/icon/desktop/myvideo/chart.png"
          alt="Shares"
          className="w-[28px] -mr-6"
        />
        <div className="flex items-center gap-[6px]">
          <Eye className="size-[22px]" />
          <span>{formatBigNum(views)}</span>
        </div>
        <div className="flex items-center gap-[6px]">
          <Heart className=" fill-foreground size-[22px]" />
          <span>{formatBigNum(likes)}</span>
        </div>
        <div className="flex items-center gap-[6px]">
          <img
            src="/icon/desktop/myvideo/forward.png"
            alt="Shares"
            className="size-[22px]"
          />
          <span>{cards}</span>
        </div>
      </div>
      <div className="flex gap-[15px] items-center text-[28px]">
        <button
          onClick={handleEdit}
          className="h-[43px] px-[16px] border border-white rounded-[6px] flex items-center gap-[14px]"
        >
          <Pencil />
          EDIT
        </button>
        <Link
          href={"/draft"}
          className="h-[43px] px-[16px] border border-white rounded-[6px] flex items-center gap-[14px]"
        >
          <FolderOpen />
          DRAFT
        </Link>
        <button
          onClick={confirmDelete}
          className="h-[43px] px-[16px] border border-white rounded-[6px] flex items-center gap-[14px]"
        >
          <Trash2 />
          DELETE VIDEO
        </button>
      </div>
    </div>
  );
};

export default SettingBar;
