import { CardType, VideoType } from "@/app/(privte)/dashboard/page";

import VideoTable from "./videoTable";
import CardTable from "./cardTable";

interface Type {
  videos: VideoType[];
  cards: CardType[];
}

const Analytics: React.FC<Type> = ({ videos, cards }) => {
  return (
    <>
      <div className="flex justify-between items-start gap-[95px] mt-[70px]">
        <VideoTable videos={videos} />
        <CardTable cards={cards} />
      </div>
    </>
  );
};
export default Analytics;
