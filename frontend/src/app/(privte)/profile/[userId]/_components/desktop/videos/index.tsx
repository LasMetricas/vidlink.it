"use client";
import { useEffect, useState } from "react";
import VideoItem from "./videoItem";
import InfiniteScrolling from "@/app/_components/ui/infinitScrolling";
import { VideoType } from "../../../../page";

interface Type {
  videos: VideoType[];
}

const Videos: React.FC<Type> = ({ videos }) => {
  const [displayedVideos, setDisplayedVideos] = useState<VideoType[]>(
    videos?.slice(0, 15)
  );
  const [hasMore, setHasMore] = useState<boolean>(videos.length > 25); // Check if more videos exist

  const loadMoreVideos = () => {
    const nextVideos = videos.slice(
      displayedVideos.length,
      displayedVideos.length + 5
    );
    setDisplayedVideos((prev) => [...prev, ...nextVideos]);
    setHasMore(displayedVideos.length + nextVideos.length < videos.length);
  };

  useEffect(() => {
    setDisplayedVideos(videos?.slice(0, 15));
    setHasMore(videos.length > 15);
  }, [videos]);

  return (
    <InfiniteScrolling
      next={loadMoreVideos}
      dataLength={displayedVideos.length}
      hasMore={hasMore}
    >
      <ul className="gap-x-[2%] gap-y-[50px] flex flex-wrap items-start">
        {displayedVideos?.map((item) => (
          <VideoItem
            key={item._id}
            videoId={item._id}
            src={item.videoLink}
            title={item.title}
            info={item.info ?? ""}
            duration={item.duration ?? 0}
            views={item.views ?? 0}
            card={item.card ?? 0}
            createdAt={item.createdAt}
          />
        ))}
      </ul>
    </InfiniteScrolling>
  );
};

export default Videos;
