"use client";

import FooterDesktop from "@/app/_components/layout/desktop/footer";
import { VideoType } from "../page";
import DraftVideos from "./draftVideos";
import PublishedVideos from "./publishedVideos";
import Cookies from "js-cookie";
import { useLayoutEffect, useState } from "react";
import Link from "next/link";

interface Type {
  draftVideos: VideoType[];
  publishedVideos: VideoType[];
}
const DraftsDesktop: React.FC<Type> = ({ draftVideos, publishedVideos }) => {
  const [picture, setPicture] = useState<string>("");

  useLayoutEffect(() => {
    const user = Cookies.get("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setPicture(parsedUser.picture);
    }
  }, []);
  return (
    <div className="flex flex-col justify-between min-h-screen">
      <main className="mx-[70px] my-[172px]">
        <div className="font-semibold tracking-wider mb-[61px]">
          <h1 className="text-[40px] mb-[22px]">DRAFTS</h1>
          <p className="text-[18px] font-normal leading-normal">
            <span className="font-semibold">NOTE</span>: Draft videos will be
            kept for a period of 30 days. After this time, Vidlink will delete
            the archive and its progress. <br />
            Only you can access the draft videos. Vidlink will never share any
            details without your permission.
          </p>
        </div>
        {draftVideos.length > 0 ? (
          // <div className="max-h-[100svh] overflow-hidden">
            <DraftVideos videos={draftVideos} />
          // </div>
        ) : (
          <>
            <p className=" text-[20px] uppercase">No drafts</p>
          </>
        )}
        <div className="flex items-center gap-[13px] mt-[192px] mb-[21px] text-[18px] font-semibold">
          <Link href={"/profile"}>
            <img
              className="size-[55px] rounded-full"
              src={picture ? picture : "/icon/desktop/layout/avatar.png"}
              alt=""
              loading="eager"
            />
          </Link>
          PUBLISHED VIDEOS
        </div>
        <PublishedVideos videos={publishedVideos} />
      </main>
      <FooterDesktop isFixed={false} />
    </div>
  );
};

export default DraftsDesktop;
