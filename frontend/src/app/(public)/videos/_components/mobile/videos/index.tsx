"use client";
import { useEffect, useState } from "react";
import { Video } from "../../../page";
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
      <ul className="flex flex-col gap-[50px]">
        {displayedVideos.map((item, index) => (
          <VideoItem
            title={item.title}
            cards={item.card}
            userId={item.user._id}
            picture={item.user.picture}
            views={item.views}
            src={item.videoLink}
            no={index + 1}
            key={item._id}
            videoId={item._id}
          />
        ))}
      </ul>
    </InfiniteScrolling>
  );
};

export default Index;
