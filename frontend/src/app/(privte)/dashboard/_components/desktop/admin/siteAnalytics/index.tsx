"use client";

// import {Accordion, AccordionItem} from "@heroui/accordion";

import Chart from "./chart";
import DetailItem from "./detailItem";
import { useState } from "react";

interface Type {
  visitors: number;
  cardClicks: number;
  videoViews: number;
  signups: number;
  videos: number;
  userAvgTime: number;
  cards: number;
  visitorAvgTime: number;
  signupsChartData?: { labels: string[]; values: number[] } | null;
  visitorsChartData?: { labels: string[]; values: number[] } | null;
  videoViewsChartData?: { labels: string[]; values: number[] } | null;
  cardClicksChartData?: { labels: string[]; values: number[] } | null;
  period: string;
}

const SiteAnalytics: React.FC<Type> = ({
  visitors,
  cardClicks,
  videoViews,
  signups,
  videos,
  userAvgTime,
  cards,
  visitorAvgTime,
  signupsChartData,
  visitorsChartData,
  videoViewsChartData,
  cardClicksChartData,
  period,
}) => {
  const [chartType, setChartType] = useState<"signups" | "visitors" | "videoViews" | "cardClicks">("signups");

  // Get the appropriate chart data based on selection
  const getChartData = () => {
    switch (chartType) {
      case "signups":
        return signupsChartData || { labels: [], values: [] };
      case "visitors":
        return visitorsChartData || { labels: [], values: [] };
      case "videoViews":
        return videoViewsChartData || { labels: [], values: [] };
      case "cardClicks":
        return cardClicksChartData || { labels: [], values: [] };
      default:
        return { labels: [], values: [] };
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
            <h1>site analytics</h1>
            <div className="h-0 border border-blue w-full flex flex-1"></div>
          </div>
          <div className="flex gap-9">
            <div className="flex flex-col gap-6">
              <DetailItem name="VISITORS" amount={visitors} />
              <DetailItem name="VIDEO VIEWS" amount={videoViews} />
              <DetailItem name="VIDEOS UPLOADED" amount={videos} />
              <DetailItem name="CREATED CARDS" amount={visitorAvgTime} />
            </div>
            <div className="flex flex-col gap-6">
              <DetailItem name="CLICKS ON CARDS" amount={cardClicks} />
              <DetailItem name="SIGN UPS" amount={signups} />
              <DetailItem name="USERS AVG. TIME" amount={userAvgTime} />
              <DetailItem name="VISITORS AVG. TIME" amount={cards} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <style dangerouslySetInnerHTML={{
            __html: `
              select[name="adminChartType"] option {
                background: #0a0a0a;
                color: white;
              }
              select[name="adminChartType"] option:hover,
              select[name="adminChartType"] option:focus,
              select[name="adminChartType"] option:checked {
                background: #2e2e2e !important;
              }
            `
          }} />
          <select
            name="adminChartType"
            value={chartType}
            onChange={(e) => setChartType(e.target.value as "signups" | "visitors" | "videoViews" | "cardClicks")}
            className="w-[211px] h-[36px] rounded-[7px] border-[2px] border-white text-white text-[16px] font-semibold bg-transparent px-2 cursor-pointer uppercase tracking-wider focus:outline-none focus:ring-0"
            style={{ 
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              paddingRight: '32px'
            }}
          >
            <option value="signups" className="bg-[#0a0a0a] text-white uppercase">SIGN UPS</option>
            <option value="visitors" className="bg-[#0a0a0a] text-white uppercase">VISITORS</option>
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
export default SiteAnalytics;
