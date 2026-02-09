"use client";
import Link from "next/link";
import { basicBold } from "@/style/fonts/fonts";
import Footer from "@/app/_components/layout/desktop/footer";
import { useEffect, useState } from "react";
import { Video } from "../../ui/video";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Videos from "./videos";
import useVideo from "@/hooks/useVideo";
import { LoadingTop } from "../../ui/loading";
import { errorModal } from "@/utils/confirm";

export type Video = {
  _id: string;
  videoLink: string;
  title: string;
  info: string;
  duration: number;
  views: number;
  user: { _id: string; userName: string; picture: string };
  createdAt: string;
};

export default function HomeMobile() {
  const [isPlay, setIsPLay] = useState<boolean>(false);

  const [homeVideos, setHomeVideos] = useState<Video[]>([]);
  const { getHomeVideos, loading } = useVideo();
  useEffect(() => {
    const fetchVideos = async () => {
      const res = await getHomeVideos();
      if (res.status === 200 && "homeVideos" in res) {
        setHomeVideos(res.homeVideos || []);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    };
    fetchVideos();
  }, []);

  const videoPlay = () => {
    setIsPLay(true);
  };
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    vertical: true,
    autoplay: true,
    autoplaySpeed: 1000,
    arrows: false,
    adaptiveHeight: true,
  };
  const images = [
    { name: "youtube", src: "/icon/desktop/home/youtube.png" },
    { name: "max", src: "/icon/desktop/home/max.png" },
    { name: "spotify", src: "/icon/desktop/home/spotify.png" },
    { name: "wikipedia", src: "/icon/desktop/home/wikipedia.png" },
    { name: "linkedin", src: "/icon/desktop/home/linkedin.png" },
    { name: "imdb", src: "/icon/desktop/home/imdb.png" },
  ];
  return (
    <>
      <div className=" relative">
        <div className="h-screen">
          {process.env.NEXT_PUBLIC_PRODUCTION === "production" ? (
            <Video src="/video/main.mp4" />
          ) : (
            <Video src="/video/home.mp4" />
          )}
        </div>
        <div className="absolute top-[42vh] w-full flex justify-center">
          <div>
            <img
              width={778}
              height={121}
              className="w-[778px] h-[121px]"
              src="/icon/desktop/home/title.png"
              alt=""
              loading="eager"
            />
            <div className="flex items-center gap-[27px] mt-[12px] pl-[40px]">
              <h1 className="text-[32px] text-white tracking-wider">
                CONNECT YOUR VIDEOS TO
              </h1>
              <Slider {...settings} className="w-[61px] ">
                {images.map((item, index) => (
                  <div key={index}>
                    <Image
                      width={61}
                      height={61}
                      className="pt-[2px]"
                      src={item.src}
                      alt=""
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
        <div className=" absolute text-[14px] bottom-[75px] left-[0px] right-[0px] text-center tracking-wider uppercase">
          <p className="pb-1 ">
            We fill videos with knowledge and actions thanks to our synchronized
            cards.
          </p>
          <p className="font-normal leading-[12px] ">
            Made for movie lovers, design aficionados, advertising pros, sports
            analytics and fans of Casablanca...
          </p>
        </div>
      </div>
      <div className="flex flex-col pt-[154px] px-[15.5px]">
        <h1
          className={`${basicBold.className} text-[154px] w-full text-center max-[393px]:text-[82px] pb-[28px]`}
        >
          HOW IT WORKS
        </h1>
        <div className="flex justify-center items-center w-full h-[452px] relative overflow-hidden">
          <div className="flex justify-center items-center  border-white border-[5px] rounded-[21px] w-[827px] h-full relative overflow-hidden">
            {isPlay && (
              <div className="h-[574px] w-full">
                {process.env.NEXT_PUBLIC_PRODUCTION === "production" ? (
                  <Video src="/video/main.mp4" />
                ) : (
                  <Video src="/video/home/home.mp4" />
                )}
              </div>
            )}
            {isPlay || (
              <button onClick={videoPlay}>
                <img
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  src="/icon/desktop/home/play.png"
                  alt=""
                />
              </button>
            )}
          </div>
          <div className="w-[365px] h-full ml-[48px] text-[16px] font-semibold flex flex-wrap content-between tracking-wider">
            <Link
              href={"/login"}
              className="bg-blue rounded-[12px] uppercase text-[29px] w-full h-[79px] tracking-wider flex flex-wrap items-center gap-[12px] justify-center"
            >
              log in google
              <img src="/icon/desktop/home/google.png" alt="" />
            </Link>
            <p className="">
              1. UPLOAD A VIDEO FROM YOUR DEVICE OR PASTE THE LINK.
            </p>
            <p>
              2. SET THE CARDS ON THE EXACT TIME YOU WANT TO POP UP DOWN BELOW
              THE VIDEO. NO INTRUSIVE LAYOUT.
            </p>
            <p>
              3. LINK YOUR FAVORITE SONGS, PRODUCTS & ANYTHING YOU WANT TO
              HIGHLIGHT.
            </p>
            <p>
              4. PUBLISH AND INTERACT WITH THE VIEWERS. LET THEM SUGGEST NEW
              CARDS TO IMPROVE THE EXPERIENCE.
            </p>
          </div>
        </div>
        <div>
          <h1
            className={`${basicBold.className} text-[154px] w-full text-center max-[393px]:text-[82px] pb-[38px] pt-[174px]`}
          >
            ALL VIDEOS
          </h1>
        </div>
        {loading ? <LoadingTop /> : <Videos videos={homeVideos} />}
        <Link
          href={"/videos"}
          className="flex justify-center items-center border-[2px] border-white h-[40px] w-[180px] rounded-[7px] text-[20px] mb-[161px] mt-[174px] mx-auto font-semibold tracking-wider"
        >
          ALL VIDEOS
        </Link>
      </div>
      <Footer isFixed={false} />
    </>
  );
}
