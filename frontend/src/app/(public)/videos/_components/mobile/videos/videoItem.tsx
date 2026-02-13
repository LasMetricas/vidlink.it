import { Eye } from "lucide-react";
import Link from "next/link";
import ReactPlayer from "react-player";
interface Type {
  title: string;
  cards: number;
  userId: string;
  picture: string;
  views: number;
  src: string;
  no: number;
  videoId: string;
}
const VideoItem: React.FC<Type> = ({
  title,
  cards,
  userId,
  picture,
  views,
  src,
  videoId,
}) => {
  return (
    <>
      <li className="w-full flex flex-col items-center gap-[20px] justify-between">
        <div className="aspect-video w-full rounded-[8.37px] overflow-hidden bg-[#1a1a1a]">
          {src !== "" ? (
            <Link
              href={`/videos/${videoId}`}
              className="w-full h-full relative block"
            >
              <ReactPlayer
                url={src}
                muted
                loop
                width="100%"
                height="100%"
                progressInterval={1000}
                config={{
                  file: {
                    attributes: {
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      },
                    },
                  },
                }}
              />
              <div className="absolute inset-0 z-10"></div>
            </Link>
          ) : (
            <></>
          )}
        </div>
        <div className="flex gap-[10px] justify-start w-full">
          <Link href={`/profile/${userId.trim()}`}>
            {picture ? (
              <img
                className="size-[35px] rounded-full"
                src={picture}
                alt=""
                loading="eager"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="size-[35px]"></span>
            )}
          </Link>
          <div className="flex flex-col text-[14px] gap-[5px] items-start">
            <div className="text-blue font-semibold ">
              {title.toUpperCase()}
            </div>
            <div className="font-normal flex items-center gap-[16px]">
              <div className="flex gap-[5px] items-center">
                <Eye className="size-[15px]" />
                {views}
              </div>
              <div className="flex gap-[5px] items-center">
                <img
                  className="size-[15px]"
                  src="/icon/layout/alert.png"
                  alt=""
                  loading="eager"
                />
                {cards}
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
};
export default VideoItem;
