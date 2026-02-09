"use client";
import Link from "next/link";
import { VideoType } from "../../../page";
import VideoItem from "../videos/videoItem";
import { useState } from "react";
import InfiniteScrolling from "@/app/_components/ui/infinitScrolling";

interface Type {
  myLikesVideos: VideoType[];
}
const Likes: React.FC<Type> = ({ myLikesVideos }) => {
  const [displayedVideos, setDisplayedVideos] = useState<VideoType[]>(
    myLikesVideos?.slice(0, 18)
  );
  const [hasMore, setHasMore] = useState<boolean>(myLikesVideos.length > 18); // Check if more videos exist

  const loadMoreVideos = () => {
    const nextVideos = myLikesVideos.slice(
      displayedVideos.length,
      displayedVideos.length + 10
    );
    setDisplayedVideos((prev) => [...prev, ...nextVideos]);
    setHasMore(
      displayedVideos.length + nextVideos.length < myLikesVideos.length
    );
  };
  return (
    <>
      <InfiniteScrolling
        next={loadMoreVideos}
        dataLength={displayedVideos.length}
        hasMore={hasMore}
      >
        <ul className="overflow-hidden gap-x-[3.5%] gap-y-[15px] flex flex-wrap items-start mt-[48px]">
          {displayedVideos?.slice(0, 12)?.map((item, index) => (
            <Link key={index} href={`/videos/${item._id}`} className="w-[31%]">
              <VideoItem videoLink={item.videoLink} />
            </Link>
          ))}
        </ul>
      </InfiniteScrolling>
    </>
  );
};
export default Likes;
