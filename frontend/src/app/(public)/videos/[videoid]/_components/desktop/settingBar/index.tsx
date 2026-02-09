"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
// import ReportModal from "../modal/reportModal";
// import AddModal from "../modal/addModal";
// import LoginModal from "../modal/loginModal";
import { UserInfo } from "../../../page";
import useVideo from "@/hooks/useVideo";
import SettingBtn from "./settingBtn";
import { errorModal, successModal } from "@/utils/confirm";

interface Type {
  handleLike(): void;
  setFollowStatus(value: boolean): void;
  isAuth: boolean;
  userInfo: UserInfo;
  cards: number;
  like: boolean;
  userId: string;
  followStatus: boolean;
  videoId?: string;
}
const SettingBar: React.FC<Type> = ({
  handleLike,
  setFollowStatus,
  isAuth,
  userInfo,
  cards,
  like,
  userId,
  followStatus,
  videoId,
}) => {
  const [isOpen] = useState<boolean>(false);
  const [, setHidden] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<string>("");
  const { followUser, loading } = useVideo();
  useEffect(() => {
    if (isAuth && isOpen && true) {
      const modal = setTimeout(() => {
        setHidden(true);
      }, 2000);
      return () => clearTimeout(modal);
    }
  }, [isOpen, isAuth]);

  const handleShare = async () => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }
    const url = videoId
      ? `${window.location.origin}/videos/${videoId}`
      : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      successModal("Video link copied to clipboard!");
    } catch {
      errorModal("Unable to copy the video link.");
    }
  };
  const handleFollow = async () => {
    if (loading) return;
    if (userInfo.owner) {
      return errorModal("You can't follow because you are an owner.");
    }
    if (isAuth) {
      const res = await followUser(userId);
      if (res.status === 200 && "followStatus" in res) {
        setFollowStatus(res.followStatus);
      } else {
        errorModal(res.message || "Something went wrong");
      }
    } else {
      errorModal("You must log in before the following.");
    }
  };
  return (
    <>
      <div className="h-[67px] w-full flex items-center justify-between">
        <div className="flex gap-[22px] items-center">
          <Link href={`/profile/${userInfo.owner ? "" : userId.trim()}`}>
            {userInfo.picture ? (
              <img
                className="size-[60px] rounded-full"
                src={userInfo.picture}
                alt=""
                loading="eager"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="size-[35px]"></span>
            )}
          </Link>
          <div className="flex flex-col justify-between h-[67px] items-start font-semibold">
            <div className="text-[18px] text-blue  ">
              {userInfo.userName.toUpperCase()}
            </div>
            {/* <div className="text-[8px] font-normal ">
              {userInfo.totalVideos || 0} VIDEOS
            </div> */}

            <button
              onClick={handleFollow}
              className={`${
                followStatus
                  ? "bg-blue border-none"
                  : "bg-background border-[0.41px]"
              } text-[20px] text-center font-semibold  rounded-[4px] w-[121px] py-[6px] leading-none`}
            >
              {followStatus ? "FOLLOWED" : "FOLLOW"}
            </button>
          </div>
        </div>
        <div className="w-[356px] flex justify-between">
          <SettingBtn
            handleSet={handleLike}
            setIsHovered={setIsHovered}
            name="like"
            value={like}
            isHovered={isHovered}
          />
          <SettingBtn
            handleSet={handleShare}
            setIsHovered={setIsHovered}
            name="share"
            value={false}
            isHovered={isHovered}
          />
          <a
            href="mailto:vid.link.vid@gmail.com"
            className="flex flex-col items-center gap-[10px] uppercase tracking-wide"
          >
            <img
              src={
                "report" === isHovered
                  ? `/icon/desktop/detail/report_blue_blank.png`
                  : `/icon/desktop/detail/report.png`
              }
              className="size-[47px]"
              alt="heart"
              onMouseEnter={() => setIsHovered("report")}
              onMouseLeave={() => setIsHovered("")}
            />
            REPORT
          </a>
        </div>
        <div className="flex items-center gap-[20px]">
          <img
            src={`/icon/desktop/detail/vector2.png`}
            className="size-[29px] "
            alt=""
          />
          <span className="text-[40px] pb-2"> {cards}</span>
        </div>
      </div>
    </>
  );
};
export default SettingBar;
