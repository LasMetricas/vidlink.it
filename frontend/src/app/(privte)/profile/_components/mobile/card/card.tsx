"use state";
import { CardT } from "@/app/(public)/videos/[videoid]/page";
import useVideo from "@/hooks/useVideo";
import { errorModal } from "@/utils/confirm";
import * as LucideIcons from "lucide-react";
import { useState } from "react";

interface Type extends CardT {
  no: number;
}
const Card: React.FC<Type> = ({
  name,
  link,
  // icon,
  isSaved,
  start,
  no,
  _id,
}) => {
  const { saveCard, increaseClicks, loading } = useVideo();
  const [saved, setSaved] = useState<boolean>(isSaved);

  // const IconComponent = LucideIcons[
  //   icon as keyof typeof LucideIcons
  // ] as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  const handleSavingCard = async () => {
    if (loading) return;
    const res = await saveCard(_id);
    if (res.status === 200 && "saved" in res) {
      setSaved(res.saved);
    } else {
      errorModal(res.message || "Something went wrong");
    }
  };

  const handleVisit = () => {
    window.open(link, "_blank", "noopener,noreferrer");
    increaseClicks(_id);
  };
  return (
    <>
      <li className="text-black w-[32%] h-[104.5px] flex flex-col justify-between ">
        <div className="bg-white rounded-[6px] h-[73.5px] p-[6px] overflow-hidden">
          <div className="text-[13.86px] font-semibold flex justify-between w-full items-center">
            <span>{no < 10 ? `0${no}` : no}</span>
            <i className="font-normal text-blue">
              ({Math.floor(start / 60)}:
              {start % 60 < 10 ? `0${start % 60}` : start % 60})
            </i>
          </div>
          <h1 className="flex items-center justify-center text-blue text-[14px] h-[50px] mt-[3px] font-semibold text-center w-full ">
            {name.toUpperCase()}
          </h1>
        </div>
        <div className="flex h-[29px] gap-1">
          <div className="h-full bg-white rounded-[6px] w-[50%] flex justify-center items-center">
            <button onClick={handleSavingCard} className="size-[22.5px]">
              {saved ? (
                <img src="/icon/detail/card/left2Blue.png" alt="" />
              ) : (
                <img src="/icon/detail/card/left2.svg" alt="" />
              )}
            </button>
          </div>
          {link ? (
            <a
              href={link}
              target="_blank"
              className="h-full bg-white rounded-[6px] w-[50%] flex justify-center items-center"
            >
              <LucideIcons.Link className="size-[19px]" />
            </a>
          ) : (
            <button
              onClick={handleVisit}
              className="h-full bg-white rounded-[6px] w-[50%] flex justify-center items-center"
            >
              <LucideIcons.Link className="size-[19px]" />
            </button>
          )}
          {/* <img src="/icon/detail/card/right2.svg" alt="" /> */}
        </div>
      </li>
    </>
  );
};
export default Card;
