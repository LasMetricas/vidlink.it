"use client";
import { useEffect, useState } from "react";
import { Video } from "../index";
import VideoItem from "./videoItem";
import InfiniteScrolling from "@/app/_components/ui/infinitScrolling";

interface Type {
  videos: Video[];
}

const Index: React.FC<Type> = ({ videos }) => {
  const [displayedVideos, setDisplayedVideos] = useState<Video[]>(
    videos?.slice(0, 25)
  );
  const [hasMore, setHasMore] = useState<boolean>(videos.length > 25); // Check if more videos exist

  const loadMoreVideos = () => {
    const nextVideos = videos.slice(
      displayedVideos.length,
      displayedVideos.length + 10
    );
    setDisplayedVideos((prev) => [...prev, ...nextVideos]);
    setHasMore(displayedVideos.length + nextVideos.length < videos.length);
  };

  useEffect(() => {
    setDisplayedVideos(videos?.slice(0, 25));
    setHasMore(videos.length > 25);
  }, [videos]);

  return (
    <InfiniteScrolling
      next={loadMoreVideos}
      dataLength={displayedVideos.length}
      hasMore={hasMore}
    >
      <ul className="gap-x-[2%] gap-y-[150px] flex flex-wrap items-start mx-[3.5%]">
        {displayedVideos?.map((item) => (
          <VideoItem
            key={item._id}
            videoId={item._id}
            src={item.videoLink}
            title={item.title}
            info={item.info}
            duration={item.duration}
            views={item.views}
            createdAt={item.createdAt}
            userName={item.user.userName}
            userId={item.user._id}
            picture={item.user.picture}
          />
        ))}
      </ul>
    </InfiniteScrolling>
  );
};

export default Index;
