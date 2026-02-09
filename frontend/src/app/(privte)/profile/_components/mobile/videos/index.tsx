'use client'
import Link from "next/link";
import { VideoType } from "../../../page";
import VideoItem from "./videoItem";
import { useState } from "react";
import InfiniteScrolling from "@/app/_components/ui/infinitScrolling";

interface Type {
  myVideos: VideoType[];
  totalVideos?: number | null;
}
const Videos: React.FC<Type> = ({ myVideos, totalVideos }) => {
  const [displayedVideos, setDisplayedVideos] = useState<VideoType[]>(
    myVideos?.slice(0, 18)
  );
  const [hasMore, setHasMore] = useState<boolean>(myVideos.length > 18); // Check if more videos exist

  const loadMoreVideos = () => {
    const nextVideos = myVideos.slice(
      displayedVideos.length,
      displayedVideos.length + 10
    );
    setDisplayedVideos((prev) => [...prev, ...nextVideos]);
    setHasMore(displayedVideos.length + nextVideos.length < myVideos.length);
  };

  return (
    <>
      <div className="flex justify-between items-center text-[8px] mx-[11px] mt-[24px] mb-[14px] font-semibold tracking-wider">
        <div className="flex gap-[7px] ">
          <span>{totalVideos || 0}&nbsp;VIDEOS</span>
          <img className="size-[10px]" src="/icon/profile/video.png" alt="" />
        </div>
        <div className="flex gap-[7px]">
          <span>NEWEST</span>
          <img className="size-[10px]" src="/icon/profile/arrow.png" alt="" />
        </div>
      </div>
      <InfiniteScrolling
        next={loadMoreVideos}
        dataLength={displayedVideos.length}
        hasMore={hasMore}
      >
        <ul className="gap-x-[2%] gap-y-[15px] flex flex-wrap items-start">
          {displayedVideos?.map((item, index) => (
            <Link href={`/videos/${item._id}`} key={index} className="w-[32%]">
              <VideoItem videoLink={item.videoLink} />
            </Link>
          ))}
        </ul>
      </InfiniteScrolling>
    </>
  );
};
export default Videos;
