"use client";
import Loading from "@/app/_components/ui/loading";
import useVideo from "@/hooks/useVideo";
import { useParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MyVideoDesktop from "./_components";
import { errorModal } from "@/utils/confirm";

export interface CardT {
  _id?: string;
  link: string;
  name: string;
  // icon: string;
  start: number;
  no: number;
  isSaved: boolean;
}
export interface VideoInfo {
  _id: string;
  videoLink: string;
  title: string;
  description: string;
  info: string;
  duration: number;
  likes: number;
  views: number;
  cards: CardT[];
}
export interface VideoType {
  _id: string;
  videoLink: string;
  title: string;
  info: string;
  duration: number;
  views: number;
  card: number;
  user: { _id: string; userName: string; picture: string };
  createdAt: string;
}

const Page = () => {
  const params = useParams();
  const videoId: string | undefined = Array.isArray(params.videoid)
    ? params.videoid[0]
    : params.videoid;
  const { getMyVideo, loading } = useVideo();

  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [moreVideos, setMoreVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    if (!videoId) return;
    const fetchFunc = async () => {
      const res = await getMyVideo(videoId);
      if (res.status === 200 && "videoInfo" in res && "moreVideos" in res) {
        setVideoInfo(res.videoInfo);
        setMoreVideos(res.moreVideos);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    };
    fetchFunc();
  }, []);
  if (loading || !videoInfo || videoInfo?.cards.length < 1) return <Loading />;
  // if (!videoInfo.videoLink) return <></>;
  return (
    <Suspense fallback={<Loading />}>
      <MyVideoDesktop videoInfo={videoInfo} moreVideos={moreVideos} />
    </Suspense>
  );
};
export default Page;
