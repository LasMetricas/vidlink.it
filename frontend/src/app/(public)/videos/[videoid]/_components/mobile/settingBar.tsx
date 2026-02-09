"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReportModal from "./modal/reportModal";
import AddModal from "./modal/addModal";
import LoginModal from "./modal/loginModal";
import { UserInfo } from "../../page";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";

interface Type {
  handleLike(): void;
  setFollowStatus(value: boolean): void;
  isAuth: boolean;
  userInfo: UserInfo;
  cards: number;
  like: boolean;
  userId: string;
  followStatus: boolean;
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
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(false);
  const { followUser, loading } = useVideo();
  useEffect(() => {
    if (isAuth && isOpen && true) {
      const modal = setTimeout(() => {
        setHidden(true);
      }, 2000);
      return () => clearTimeout(modal);
    }
  }, [isOpen, isAuth]);

  const handleSuggest = () => {
    if (loading) return;
    if (userInfo.owner) {
      return errorModal("You can't do this because you are an owner.");
    }
    setIsOpen(!isOpen);
  };
  const handleFollow = async () => {
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
      <div className="h-[72.58px] w-full relative flex items-center justify-center">
        <div className="absolute top-[18.6px] left-[11px] flex gap-[10px] items-center">
          <Link href={`/profile/${userInfo.owner ? "" : userId.trim()}`}>
            {userInfo.picture ? (
              <img
                className="size-[35px] rounded-full"
                src={userInfo.picture}
                alt=""
                loading="eager"
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="size-[35px]"></span>
            )}
          </Link>
          <div className="flex flex-col gap-[7px] justify-between items-start">
            <div className="text-[12px] text-blue font-semibold ">
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
              } text-[12px] font-semibold  rounded-[3px] px-[10px] h-[22px] leading-none`}
            >
              {followStatus ? "FOLLOWED" : "FOLLOW"}
            </button>
          </div>
        </div>
        <button onClick={handleLike} className=" pl-[12px] pt-[4px] ">
          {like ? (
            <img
              src="/icon/detail/blueHeart.png"
              className="size-[32px]"
              alt=""
            />
          ) : (
            <img
              src="/icon/detail/whiteHeart.png"
              className="size-[32px]"
              alt=""
            />
          )}
        </button>
        <div className=" absolute right-[9.23px] top-[10.6px] flex gap-[12px]">
          <div className="flex flex-col items-center gap-[5px]">
            <h1 className="text-[8px] font-semibold">CARDS</h1>
            <button className="border-[1.43px] w-[43px] h-[34px] rounded-[4.76px] text-center">
              {cards}
            </button>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <h1 className="text-[8px] font-semibold">SUGGEST</h1>
            <div className="h-[34px] relative overflow-visible">
              <button
                onClick={handleSuggest}
                className="border-[1.43px] w-[43px] h-[34px] rounded-[4.76px] flex justify-center items-center"
              >
                <img src="/icon/detail/card/plus.svg" alt="" />
              </button>
              {isAuth && isOpen && (
                <>
                  {hidden ? (
                    <ReportModal setIsOpen={setIsOpen} setHidden={setHidden} />
                  ) : (
                    <AddModal setIsOpen={setIsOpen} setHidden={setHidden} />
                  )}
                </>
              )}
              {!isAuth && isOpen && <LoginModal setIsOpen={setIsOpen} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SettingBar;
