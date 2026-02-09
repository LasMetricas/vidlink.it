import Link from "next/link";
import { CardType, UserInfoType, VideoType } from "../../page";
import { UserInfoViewerType } from ".";
import useExpert from "@/hooks/useExport";

interface Type {
  name: string;
  user: string;
  userInfo: UserInfoType | null;
  userInfoViewer: UserInfoViewerType | null;
  videos: VideoType[];
  cards: CardType[];
  views: number;
  likes: number;
  watchTime: number;
}
const BtnGroup: React.FC<Type> = ({
  name,
  user,
  userInfo,
  userInfoViewer,
  videos,
  cards,
  views,
  likes,
  watchTime,
}) => {
  const { handleCSV, loading } = useExpert();
  const handleExport = () => {
    if (loading) return;
    if (user === "creator") {
      const userData = {
        Videos: videos.length || 0,
        Likes: likes || 0,
        Views: views || 0,
        "Watch Time":
          watchTime < 60
            ? `${watchTime < 10 ? 0 : ""}${Math.floor(watchTime)}s`
            : watchTime < 3600
            ? `${Math.floor(watchTime / 60) < 10 ? 0 : ""}${Math.floor(
                watchTime / 60
              )}m ${Math.floor(watchTime % 60)}s`
            : `${Math.floor(watchTime / 3600) < 10 ? 0 : ""}${Math.floor(
                watchTime / 3600
              )}h ${Math.floor((watchTime % 3660) / 60)}m` ||
              0 ||
              0,
        "Total Card Created": cards.length || 0,
        "Total Cards Saved": userInfo?.savedCards || 0,
        "Total Cards Clicked": userInfo?.cardsClicks || 0,
        "Followers Gained": userInfo?.gainedFollowers || 0,
        "Followers Lost": userInfo?.lostFollowers || 0,
      };

      const videoData = videos?.map((video) => ({
        Title: video.title || "",
        Views: video.views || 0,
        Likes: video.likes || 0,
        Cards: video.card || 0,
      }));

      const cardData = cards?.map((card) => ({
        Name: card.name || "",
        "Video Title": card.title || "",
        Clicks: card.clicks || 0,
        Saved: card.saved || 0,
        Link: card.link || "",
      }));

      // Handle different sections separately
      handleCSV(userData, videoData, cardData, "creator_data");
    } else {
      const viewerData = {
        "Videos Liked": userInfoViewer?.likeVideos || "",
        "Cards Clicked": userInfoViewer?.cardsClicks || "",
        "Cards Saved": userInfoViewer?.savedCards || "",
      };
      handleCSV(viewerData, [], [], "viewer_data");
    }
  };

  return (
    <>
      <div className="font-semibold text-[20px] tracking-wider mt-[50px] mb-[140px] flex flex-col items-center gap-[20px]">
        <button
          onClick={handleExport}
          className="bg-blue rounded-[20.2px] w-[282.8px] h-[50px] flex justify-center items-center gap-[20.2px] py-[2px] "
        >
          {name.toUpperCase()}
          <img
            src="/icon/dashboard/download.png"
            className="size-[28px]"
            alt=""
          />
        </button>
        <Link
          href={"/profile"}
          className="border-[3px] rounded-[20.2px] w-[282.8px] h-[50px] flex justify-center items-center gap-[20.2px] py-[2px]"
        >
          BACK TO PROFILE
        </Link>
      </div>
    </>
  );
};
export default BtnGroup;
