import { CardType, UserInfoType, VideoType } from "../../page";
import { UserInfoViewer, TotalInfo, User } from ".";
import useExpert from "@/hooks/useExport";
import axios from "axios";
import Cookies from "js-cookie";
import { GETERRORS } from "@/utils/constant";

interface Type {
  name: string;
  user: string;
  userInfo: UserInfoType | null;
  userInfoViewer: UserInfoViewer | null;
  videos: VideoType[];
  cards: CardType[];
  views: number;
  likes: number;
  watchTime: number;
  // Admin data
  totalInfo?: TotalInfo | null;
  users?: User[];
  signupsChartData?: { labels: string[]; values: number[] } | null;
  visitorsChartData?: { labels: string[]; values: number[] } | null;
  videoViewsChartData?: { labels: string[]; values: number[] } | null;
  cardClicksChartData?: { labels: string[]; values: number[] } | null;
}
const Download: React.FC<Type> = ({
  name,
  user,
  userInfo,
  userInfoViewer,
  videos,
  cards,
  views,
  likes,
  watchTime,
  totalInfo,
  users,
  signupsChartData,
  visitorsChartData,
  videoViewsChartData,
  cardClicksChartData,
}) => {
  const { handleCSV, handleAdminCSV, loading } = useExpert();
  const handleExport = async () => {
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
        "Frofile Views": userInfo?.profileViews || 0,
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

      // Prepare chart data for creator
      const chartData = {
        videoViews: videoViewsChartData || undefined,
        cardClicks: cardClicksChartData || undefined,
      };

      // Handle different sections separately
      handleCSV(userData, videoData, cardData, `creator_data_${name}`, chartData);
    } else if (user === "admin") {
      // Fetch all errors for admin export
      const token = Cookies.get("token");
      let allErrors: Array<{
        _id?: string;
        userId?: string;
        userEmail?: string;
        errorMessage?: string;
        errorStack?: string;
        errorType?: string;
        url?: string;
        userAgent?: string;
        timestamp?: string;
        resolved?: boolean;
        resolvedAt?: string;
        resolvedBy?: string;
        metadata?: {
          componentStack?: string;
          lineNumber?: number;
          columnNumber?: number;
          filename?: string;
          [key: string]: string | number | boolean | undefined;
        };
      }> = [];
      
      try {
        // Fetch all errors (no filter, large limit)
        const errorRes = await axios.get(
          `${GETERRORS}?limit=10000`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        if (errorRes.data.status === 200) {
          allErrors = errorRes.data.errors || [];
        }
      } catch (error) {
        console.error("Failed to fetch errors for export:", error);
      }

      // Prepare analytics data
      const analyticsData = {
        Visitors: totalInfo?.visitors || 0,
        Videos: totalInfo?.videos || 0,
        Cards: totalInfo?.cards || 0,
        "Video Views": totalInfo?.videoViews || 0,
        "Card Clicks": totalInfo?.cardClicks || 0,
        Signups: totalInfo?.signups || 0,
        "Users Avg Time": totalInfo?.usersAvgTime || 0,
        "Visitors Avg Time": totalInfo?.visitorsAvgTime || 0,
      };

      // Prepare chart data
      const chartData = {
        signups: signupsChartData || undefined,
        visitors: visitorsChartData || undefined,
        videoViews: videoViewsChartData || undefined,
        cardClicks: cardClicksChartData || undefined,
      };

      // Prepare user data
      const userDataForExport = (users || []).map((u) => ({
        Email: u.email || "",
        Status: u.status || "active", // Default to "active" if status is missing
        "Signup Date": u.signupAt || "",
        "Last Login": u.lastLoginAt || "",
        Videos: u.videos || 0,
        Cards: u.cards || 0,
      }));

      // Prepare error data
      const errorDataForExport = allErrors.map((error) => ({
        "Error ID": error._id || "",
        "User ID": error.userId || "",
        "User Email": error.userEmail || "",
        "Error Message": error.errorMessage || "",
        "Error Type": error.errorType || "",
        URL: error.url || "",
        "User Agent": error.userAgent || "",
        Timestamp: error.timestamp || "",
        Resolved: error.resolved ? "Yes" : "No",
        "Resolved At": error.resolvedAt || "",
        "Resolved By": error.resolvedBy || "",
        "Error Stack": error.errorStack || "",
        Filename: error.metadata?.filename || "",
      }));

      handleAdminCSV(
        analyticsData,
        chartData,
        userDataForExport,
        errorDataForExport,
        `admin_data_${name}`
      );
    } else {
      const viewerData = {
        "Videos Reproduced": 0, // Currently not tracked in backend
        "Videos Liked": userInfoViewer?.likeVideos || 0,
        "Reported Videos": 0, // Currently not tracked in backend
        "Cards Clicked": userInfoViewer?.cardsClicks || 0,
        "Cards Saved": userInfoViewer?.savedCards || 0,
        "Cards Suggestions": 0, // Currently not tracked in backend
      };
      handleCSV(viewerData, [], [], `viewer_data_${name}`);
    }
  };

  return (
    <>
      <div className="font-normal text-[18px] tracking-wider mt-[152px] mb-[140px] flex flex-col gap-[21px] w-[633px]">
        <div className="flex items-center gap-[18px]">
          <button
            onClick={handleExport}
            className="bg-blue text-[19px] font-semibold rounded-[7px] w-[234px] h-[49px] flex justify-center items-center gap-[20.2px] uppercase"
          >
            download
            <img
              src="/icon/dashboard/download.png"
              className="size-[28px]"
              alt=""
            />
          </button>
          <div>
            Time frame:<span className=" italic"> ({name})</span>
          </div>
        </div>
        <p className="text-justify">
          Click the download button to export all stats to your device as a
          fully editable .xlsx or .csv file. Use the time frame selector in the
          upper right corner to download stats for a specific period.
        </p>
      </div>
    </>
  );
};
export default Download;
