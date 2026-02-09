"use client";

import { useEffect, useState } from "react";
import VideoItem from "./videoItem";
import InfiniteScrolling from "@/app/_components/ui/infinitScrolling";
import { VideoType } from "../../page";
import useVideo from "@/hooks/useVideo";
import { useRouter } from "next/navigation";
import { errorModal, successModal } from "@/utils/confirm";

interface Type {
  videos: VideoType[];
}

const DraftVideos: React.FC<Type> = ({ videos }) => {
  const { deleteDraft, loading } = useVideo();
  const [allVideos, setAllVideos] = useState<VideoType[]>(videos);
  const [displayedVideos, setDisplayedVideos] = useState<VideoType[]>(
    videos.slice(0, 15)
  );
  const [hasMore, setHasMore] = useState<boolean>(videos.length > 15);
  const router = useRouter();

  const loadMoreVideos = () => {
    const nextVideos = allVideos.slice(
      displayedVideos.length,
      displayedVideos.length + 5
    );
    setDisplayedVideos((prev) => [...prev, ...nextVideos]);
    setHasMore(displayedVideos.length + nextVideos.length < allVideos.length);
  };

  useEffect(() => {
    setAllVideos(videos);
    setDisplayedVideos(videos.slice(0, 15));
    setHasMore(videos.length > 15);
  }, [videos]);

  const handleDeleteVideo = async (videoId: string) => {
    const res = await deleteDraft(videoId);
    if (res.status === 200 && res.message === "Draft video deleted.") {
      const updatedVideos = allVideos.filter((video) => video._id !== videoId);
      setAllVideos(updatedVideos);
      setDisplayedVideos(updatedVideos.slice(0, 15));
      setHasMore(updatedVideos.length > 15);
      router.refresh();
      successModal("Video deleted successfully");
    } else {
      errorModal(res.message || "Something went wrong");
    }
  };
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
            handleDeleteVideo={handleDeleteVideo}
            src={item.videoLink}
            videoId={item._id}
            title={item.title}
            duration={item.duration}
            info={item.info}
            card={item.card}
            loading={loading}
            createdAt={item.createdAt}
          />
        ))}
      </ul>
    </InfiniteScrolling>
  );
};

export default DraftVideos;
