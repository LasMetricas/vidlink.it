"use client";

import { VideoType } from "../../../../page";
import Chart from "./chart";
import DetailItem from "./detailItem";
import { SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Type {
  totalVideos: number;
  totalCards: number;
  videoViews: number;
  cardClicks: number;
  videoLikes: number;
  newFollowers: number;
  profileViews: number;
  totalShares: number;
  bestVideo?: VideoType;
  videoViewsChartData?: { labels: string[]; values: number[] } | null;
  cardClicksChartData?: { labels: string[]; values: number[] } | null;
  period: string;
}

const TotalStats: React.FC<Type> = ({
  totalVideos,
  totalCards,
  videoViews,
  cardClicks,
  videoLikes,
  newFollowers,
  profileViews,
  totalShares,
  bestVideo,
  videoViewsChartData,
  cardClicksChartData,
  period,
}) => {
  const [chartType, setChartType] = useState<"videoViews" | "cardClicks">("videoViews");

  // Get the appropriate chart data based on selection
  const getChartData = () => {
    if (chartType === "videoViews") {
      return videoViewsChartData || { labels: [], values: [] };
    } else {
      return cardClicksChartData || { labels: [], values: [] };
    }
  };

  const currentChartData = getChartData();
  const labels = currentChartData.labels || [];
  const solidValues = currentChartData.values || [];


  return (
    <>
      <div className=" uppercase mt-[43px] tracking-wider flex justify-around gap-[52px]">
        <div>
          <div className="flex justify-between items-center gap-[31px] text-blue font-semibold text-[24px] mb-[33px]">
            <h1>total stats</h1>
            <div className="h-0 border border-blue w-full flex flex-1"></div>
          </div>
          <div className="flex gap-9">
            <div className="flex flex-col gap-6">
              <DetailItem name="videos uploaded" amount={totalVideos} />
              <DetailItem name="videos views" amount={videoViews} />
              <DetailItem name="likes" amount={videoLikes} />
              <DetailItem name="total shares" amount={totalShares} />
            </div>
            <div className="flex flex-col gap-6">
              <DetailItem name="cards" amount={totalCards} />
              <DetailItem name="cards clicks" amount={cardClicks} />
              <DetailItem name="new followers" amount={newFollowers} />
              <DetailItem name="profile views" amount={profileViews} />
            </div>
          </div>
          <div className="font-bold text-[16px] flex items-center mt-[38px]">
            VIDEO MOST REPRODUCED -{" "}
            <span className="text-blue italic font-semibold mr-[30px]">
              {`"${bestVideo?.title ?? ""} - ${bestVideo?.info ?? ""}"`}
            </span>
            <Link href={bestVideo?.videoLink ?? ""} target="_blank">
              <SquareArrowOutUpRight className="size-[19px]" />
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <style dangerouslySetInnerHTML={{
            __html: `
              select[name="chartType"] option {
                background: #0a0a0a;
                color: white;
              }
              select[name="chartType"] option:hover,
              select[name="chartType"] option:focus,
              select[name="chartType"] option:checked {
                background: #2e2e2e !important;
              }
            `
          }} />
          <select
            name="chartType"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as "videoViews" | "cardClicks")}
            className="w-[184px] h-[36px] rounded-[7px] border-[2px] border-white text-white text-[16px] font-semibold bg-transparent px-2 cursor-pointer uppercase tracking-wider focus:outline-none focus:ring-0"
            style={{ 
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              paddingRight: '32px'
            }}
          >
            <option value="videoViews" className="bg-[#0a0a0a] text-white uppercase">VIDEO VIEWS</option>
            <option value="cardClicks" className="bg-[#0a0a0a] text-white uppercase">CARD CLICKS</option>
          </select>
          <Chart
            labels={labels}
            dataset1={solidValues}
            period={period}
            // dataset2={dashedValues}
          />
        </div>
      </div>
    </>
  );
};
export default TotalStats;
