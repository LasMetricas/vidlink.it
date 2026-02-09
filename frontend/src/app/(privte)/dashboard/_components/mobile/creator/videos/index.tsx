"use client";
import { VideoType } from "@/app/(privte)/dashboard/page";
import AmountItem from "../../amountItem";
import Table from "./table";
import { useEffect } from "react";
import WatchTimeItem from "./watchTimeItem";

interface Type {
  setViews(value: number): void;
  setLikes(value: number): void;
  setWatchTime(value: number): void;
  views: number;
  likes: number;
  watchTime: number;
  videos: VideoType[];
}
const Videos: React.FC<Type> = ({
  setViews,
  setLikes,
  setWatchTime,
  views,
  likes,
  watchTime,
  videos,
}) => {
  useEffect(() => {
    let likes = 0;
    let views = 0;
    let watchTime = 0;
    for (let i = 0; i < videos.length; i++) {
      likes += videos[i].likes;
      views += videos[i].views;
      watchTime += videos[i].watchTime;
    }
    setLikes(likes);
    setViews(views);
    setWatchTime(watchTime);
  }, [videos]);
  return (
    <div className="mt-[15px] flex flex-col gap-[12px]">
      <div className="flex gap-[8.5px]">
        <AmountItem name="VIDEOS" src="videos" value={videos.length} />
        <AmountItem name="LIKES" src="likes" value={likes} />
      </div>
      {/* <div className="flex gap-[8.5px]"> */}
      <AmountItem name="TOTAL VIDEO VIEWS" src="views" value={views} />
      <WatchTimeItem name="TOTAL WATCH TIME" watchTime={watchTime} />
      {/* </div> */}
      <Table videos={videos} />
    </div>
  );
};
export default Videos;
