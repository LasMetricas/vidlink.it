"use client";

import useVideo from "@/hooks/useVideo";
import { useEffect, useState } from "react";
import DraftsDesktop from "./_components";
import { isMobile } from "react-device-detect";
import LoadingMiddle from "@/app/_components/ui/loading";
import { errorModal } from "@/utils/confirm";

export interface VideoType {
  _id: string;
  videoLink: string;
  views?: number;
  duration: number;
  info: string;
  title: string;
  card: number;
  createdAt: string;
}

const Page = () => {
  const { getDrafts, loading } = useVideo();
  const [draftVideos, setDraftVideos] = useState<VideoType[]>([]);
  const [publishedVideos, setPublishedVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    (async () => {
      const res = await getDrafts();
      if (
        res.status === 200 &&
        "draftVideos" in res &&
        "publishedVideos" in res
      ) {
        setDraftVideos(res.draftVideos);
        setPublishedVideos(res.publishedVideos);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    })();
  }, []);

  if (loading) return <LoadingMiddle />;
  return (
    <>
      {isMobile ? null : (
        <DraftsDesktop
          draftVideos={draftVideos}
          publishedVideos={publishedVideos}
        />
      )}
    </>
  );
};
export default Page;
