"use client";
import Link from "next/link";
import { basicBold } from "@/style/fonts/fonts";
import Footer from "@/app/_components/layout/mobile/footer";
import { useState } from "react";
import { Video } from "../../ui/video";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HomeMobile() {
  const [isPlay, setIsPLay] = useState<boolean>(false);
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
    { name: "youtube", src: "/icon/home/youtube.png" },
    { name: "youtube", src: "/icon/home/max.png" },
    { name: "youtube", src: "/icon/home/spotify.png" },
    { name: "youtube", src: "/icon/home/wikipedia.png" },
    { name: "youtube", src: "/icon/home/linkedin.png" },
    { name: "youtube", src: "/icon/home/imdb.png" },
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
        <div className="absolute top-[332px] w-full flex justify-center">
          <div>
            <img
              width={356.54}
              height={54}
              className="w-[356.54px] h-[54px]"
              src="/icon/home/title.png"
              alt=""
              loading="eager"
            />
            <div className="flex items-center gap-[12.87px] mt-[13px] pl-[17.54px]">
              <h1 className="text-[15.06px] text-white">
                CONNECT YOUR VIDEOS TO
              </h1>
              <Slider {...settings} className="w-[45px] ">
                {images.map((item, index) => (
                  <div key={index}>
                    <Image width={28.7} height={28.7} className="pt-[2px]" src={item.src} alt="" />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
        <div className=" absolute text-[10px] bottom-[37px] left-[20px] right-[20px]">
          <h1 className="mb-[15.5px] font-bold ">POWERED BY HUMANS</h1>
          <p className="font-normal leading-[12px] text-justify tracking-normal">
            WE FILL VIDEOS WITH KNOWLEDGE AND ACTIONS THANKS TO OUR SYNCHRONIZED
            CARDS. MADE FOR MOVIE LOVERS, DESIGN AFICIONADOS, ADVERTISING PROS,
            SPORTS ANALYTICS AND FANS OF CASABLANCA...
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center pt-[22px] px-[15.5px]">
        <h1
          className={`${basicBold.className} text-[94.5px] w-full text-center max-[393px]:text-[82px]  leading-[85.39px] pb-[28px]`}
        >
          HOW IT WORKS
        </h1>
        <div className="flex justify-center items-center  border-white border-[2px] rounded-[9.42px] w-full h-[574px] relative overflow-hidden">
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
                src="/icon/home/play.svg"
                alt=""
              />
            </button>
          )}
        </div>
        <p className="text-[12px] w-full pt-[21px] px-[5px] text-justify leading-[14.4px]">
          A tool that allows you to insert content into your favorite videos.
          Thanks to its non intrusive design you can watch and interact or not.
          It is easy, clear and a bit surprising. The system is absolutely safe
          and spam free. Our team of editors curates the content and make sure
          you don’t click where you should not.
        </p>
        <Link
          href={"/videos"}
          className="border-[1.5px] border-white rounded-[3.2px] text-[14.91px] py-[1px] px-[2.13px] my-[43px] "
        >
          ALL VIDEOS
        </Link>
      </div>
      <Footer isFixed={false} />
    </>
  );
}
