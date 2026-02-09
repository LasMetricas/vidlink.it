"use client";
import { cardAtom, CardType } from "@/store";
import { useAtom } from "jotai";

interface Type {
  edit: string;
  videoLink: string;
  url: string;
  videoSrc: string | null;
  editSignal: boolean;
  setEdit(value: string): void;
  cancelVideo(): void;
  setUrl(value: string): void;
}
const ProgressLine: React.FC<Type> = ({
  edit,
  videoLink,
  url,
  videoSrc,
  editSignal,
  setEdit,
  cancelVideo,
  setUrl,
}) => {
  const [cards] = useAtom<CardType[]>(cardAtom);
  const handleStartPoint = () => {
    if (videoLink) {
      setEdit("upload"); 
      cancelVideo();
      setUrl("");
    }
  };
  const handleMiddlePoint = () => {
    if (videoLink) {
      setEdit("add");
    }
  };
  const handleEndPoint = () => {
    if (videoLink && cards.length) {
      setEdit("preview");     
    }
  };
  return (
    <>
      <div className="mx-auto w-[564px] h-[37px] relative tracking-[2px] mt-[97px] text-[16px] font-semibold">
        <span className="bg-[#505050] w-full h-[8px] rounded-full absolute bottom-[7px]"></span>
        {/* bar */}
        <span className="bg-blue w-[36px] h-[8px] rounded-full absolute bottom-[7px] left-0"></span>
        <span
          className={`${
            edit === "add" || edit === "preview" ? "bg-blue" : "bg-transparent"
          } h-[8px] rounded-full absolute bottom-[7px] left-[36px] right-1/2 duration-1000`}
        ></span>
        <span
          className={`${
            edit === "preview" ? "bg-blue" : "bg-transparent"
          } bg-blue h-[8px] rounded-full absolute bottom-[7px] right-[36px] left-1/2 duration-1000`}
        ></span>
        <span
          className={`${
            !editSignal && edit === "preview" ? "bg-blue " : "bg-[#505050]"
          } w-[36px] h-[8px] rounded-full absolute bottom-[7px] right-0 duration-1000`}
        ></span>
        {/* Points */}
        <button
          onClick={handleStartPoint}
          className={`${
            url || videoSrc || videoLink ? "bg-blue" : "bg-white"
          } size-[32px] rounded-full  border-[2px] border-blue absolute left-[30px] -bottom-[5px] duration-1000`}
        ></button>
        <button
          onClick={handleMiddlePoint}
          className={`${
            edit === "add"
              ? "bg-white border-blue"
              : edit === "preview"
              ? "bg-blue border-blue"
              : "bg-[#505050] border-none"
          } size-[32px] rounded-full border-[2px] border-blue absolute left-[50%] -bottom-[5px] -translate-x-[50%] duration-1000`}
        ></button>
        <button
          onClick={handleEndPoint}
          className={`${
            !editSignal && edit === "preview"
              ? "bg-blue border-blue"
              : edit === "preview"
              ? "bg-white border-blue"
              : "bg-[#505050] border-none"
          } size-[32px] rounded-full border-[2px]  absolute right-[30px] -bottom-[5px] duration-1000`}
        ></button>
        {/* title */}
        <div
          className={`${
            url || videoSrc || videoLink ? "text-blue" : "text-white"
          } font-semibold tracking-widest absolute left-[12px] bottom-[35px] duration-1000`}
        >
          UPLOAD
        </div>
        <div
          className={`${
            edit === "add"
              ? "text-white"
              : edit === "preview"
              ? "text-blue"
              : "text-[#505050]"
          } text-[#505050] font-semibold tracking-widest absolute left-[50%] -translate-x-[50%] bottom-[35px] duration-1000`}
        >
          ADD CARDS
        </div>
        <div
          className={`${
            !editSignal && edit === "preview"
              ? "text-blue "
              : edit === "preview"
              ? "text-white border-blue"
              : "text-[#505050] "
          } text-[#505050] font-semibold tracking-widest absolute right-[8px] bottom-[35px] duration-1000`}
        >
          PUBLISH
        </div>
      </div>
    </>
  );
};
export default ProgressLine;
