import { SquareArrowOutUpRight } from "lucide-react";
import { UserInfoViewer } from "..";
import DetailItem from "./detailItem";
import Link from "next/link";
import { VideoType } from "../../../page";

interface Type {
  userInfo: UserInfoViewer | null;
  bestVideo?: VideoType;
}
const Viewer: React.FC<Type> = ({ userInfo, bestVideo }) => {
  return (
    <>
      <div className="uppercase mt-[43px] tracking-wider flex flex-col gap-[70px]">
        <div>
          <div className="flex justify-between items-center gap-[31px] text-blue font-semibold text-[24px] mb-[33px]">
            <h1>total stats</h1>
            <div className="h-0 border border-blue w-full flex flex-1"></div>
          </div>
          <div className="flex gap-9">
            <div className="flex flex-col gap-12">
              <DetailItem name="VIDEOS REPRODUCED" amount={0} />
              <DetailItem
                name="VIDEOS LIKED"
                amount={userInfo?.likeVideos ?? 0}
              />
              <DetailItem name="REPORTED VIDEOS" amount={0} />
            </div>
            <div className="flex flex-col gap-12">
              <DetailItem
                name="CARDS CLICKED"
                amount={userInfo?.cardsClicks ?? 0}
              />
              <DetailItem
                name="CARDS SAVED"
                amount={userInfo?.savedCards ?? 0}
              />
              <DetailItem name="CARDS SUGGESTIONS" amount={0} />
            </div>
          </div>
        </div>
        <div className="font-bold text-[16px] flex items-center">
          VIDEO MOST REPRODUCED -{" "}
          <span className="text-blue italic font-semibold mr-[30px]">
            {`"${bestVideo?.title ?? ""} - ${bestVideo?.info ?? ""}"`}
          </span>
          <Link href={bestVideo?.videoLink ?? ""} target="_blank">
            <SquareArrowOutUpRight className="size-[19px]" />
          </Link>
        </div>
      </div>
    </>
  );
};
export default Viewer;
