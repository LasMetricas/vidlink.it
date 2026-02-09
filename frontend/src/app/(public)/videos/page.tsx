"use client";
import Loading from "@/app/_components/ui/loading";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
const VideosDesktop = dynamic(() => import("./_components/desktop"));
const VideosMobile = dynamic(() => import("./_components/mobile"));

export type Video = {
  _id: string;
  videoLink: string;
  title: string;
  info: string;
  duration: number;
  views: number;
  card: number;
  user: { _id: string; userName: string; picture: string };
  createdAt: string;
};
const Page = () => {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [followingVideos, setFollowingVideos] = useState<Video[]>([]);
  const { getVideos, loading } = useVideo();
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await getVideos();
      if (
        res.status === 200 &&
        "allVideos" in res &&
        "followingVideos" in res
      ) {
        setAllVideos(res.allVideos || []);
        setFollowingVideos(res.followingVideos || []);
        return;
      } else if ("allVideos" in res) {
        setAllVideos(res.allVideos || []);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    };
    fetchVideos();
  }, []);
  if (loading) return <Loading />;
  return (
    <>
      {isMobile ? (
        <VideosMobile followingVideos={followingVideos} allVideos={allVideos} />
      ) : (
        <VideosDesktop
          followingVideos={followingVideos}
          allVideos={allVideos}
        />
      )}
    </>
  );
};

export default Page;
