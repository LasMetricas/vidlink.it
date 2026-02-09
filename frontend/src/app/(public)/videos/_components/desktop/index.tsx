"use client";
import { Suspense, useEffect, useState } from "react";
import SubHeaderIn from "./subHeaders/subHeaderIn";
import Footer from "@/app/_components/layout/desktop/footer";
import SubHeaderOut from "./subHeaders/subHeaderOut";
import useVerifyAuth from "@/hooks/useVerifyAuth";
import Loading from "@/app/_components/ui/loading";
import dynamic from "next/dynamic";
import { Video } from "../../page";
const Videos = dynamic(() => import("./videos"));
interface Type {
  followingVideos: Video[];
  allVideos: Video[];
}

const VideosDesktop: React.FC<Type> = ({ followingVideos, allVideos }) => {
  const { loading, isAuth } = useVerifyAuth();
  const [nav, setNav] = useState<string>("you");
  const [videos, setVideos] = useState<Video[]>([]);
  const [isSearch, setIsSearch] = useState<string>("");

  useEffect(() => {
    if (nav === "you") {
      setVideos(allVideos);
    } else {
      setVideos(followingVideos);
    }
  }, [nav]);

  useEffect(() => {
    const key = isSearch.trim().toLowerCase();
    const videosToFilter = nav === "you" ? allVideos : followingVideos;
    if (videosToFilter.length > 0) {
      const filteredVideos = videosToFilter.filter(
        (video) =>
          video?.views?.toString().toLowerCase().includes(key) ||
          video?.videoLink?.toLowerCase().includes(key) ||
          video?.title?.toLowerCase().includes(key) ||
          video?.user?.userName?.toLowerCase().includes(key)
      );
      setVideos(filteredVideos);
    }
  }, [isSearch, nav]);

  if (loading) return <Loading />;
  return (
    <>
      <main className="flex flex-col justify-between min-h-screen">
        {isAuth ? (
          <SubHeaderIn
            setNav={setNav}
            setIsSearch={setIsSearch}
            nav={nav}
            isSearch={isSearch}
          />
        ) : (
          <SubHeaderOut />
        )}
        <div className={`mt-[78px] mb-[224px]`}>
          <Suspense fallback={<Loading />}>
            <Videos videos={videos} />
          </Suspense>
        </div>
        <Footer isFixed={false} />
      </main>
    </>
  );
};
export default VideosDesktop;
