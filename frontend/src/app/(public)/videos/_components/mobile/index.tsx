"use client";
import { Suspense, useEffect, useState } from "react";
import SubHeaderIn from "./subHeaders/subHeaderIn";
import Footer from "@/app/_components/layout/mobile/footer";
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

const VideosMobile: React.FC<Type> = ({ followingVideos, allVideos }) => {
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
      <main className="">
        {isAuth ? (
          <SubHeaderIn
            setNav={setNav}
            setIsSearch={setIsSearch}
            nav={nav}
            isSearch={isSearch}
          />
        ) : (
          <SubHeaderOut setIsSearch={setIsSearch} isSearch={isSearch} />
        )}
        <div className={`${isAuth ? "mt-[202px]" : "mt-[249px]"} h-[100vh] mx-[10px]`}>
          <Suspense fallback={<Loading />}>
            <Videos videos={videos} />
          </Suspense>
          {/* {videos.length > 0 && (
            <div className="flex justify-center">
              <Link
                href={"/videos"}
                className={`${
                  isAuth ? "bg-blue" : "bg-none"
                } rounded-xl font-semibold text-[18px] py-[7px] px-[10px] mt-[59.62px] mb-[109.23px] tracking-widest`}
              >
                VIEW MORE
              </Link>
            </div>
          )} */}
        </div>
        <Footer isFixed={true} />
      </main>
    </>
  );
};
export default VideosMobile;
