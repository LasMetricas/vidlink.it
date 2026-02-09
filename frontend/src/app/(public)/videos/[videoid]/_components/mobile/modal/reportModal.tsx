"use client";
import { useRef } from "react";
import InputItem from "../input/inputItem";
import useClickOutside from "@/hooks/useClickOutside";

interface Type {
  setIsOpen(value: boolean): void;
  setHidden(value: boolean): void;
}

const ReportModal: React.FC<Type> = ({ setIsOpen, setHidden }) => {
  const ref = useRef<HTMLDivElement>(null);
  const handleRemove = () => {
    setIsOpen(false); // Close the menu
    setHidden(false);
  };
  // Close menu on outside click
  useClickOutside(ref as React.RefObject<HTMLElement>, () => handleRemove);

  const handleReport = () => {
    setIsOpen(false);
    setHidden(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setHidden(false);
  };
  return (
    <div
      className="bg-[#F2F2F2] text-black text-[11.63px] font-normal absolute top-0 right-0 w-[182px] rounded-[8.31px] h-[256.5px] px-[9.97px] py-[8.31px] flex flex-col justify-between"
      ref={ref}
    >
      <h1>Suggest a Prompt</h1>
      <p className="leading-[13.96px]">
        Sorry this video is already charged. Maximum 1 card every 7 seconds. Try
        a new one or create a new video. If you want to report a problem about
        an uploaded prompt:
      </p>
      <div className="h-[104px] flex flex-col justify-between">
        <InputItem name="Report" holderName="Text" />
        <button
          onClick={handleReport}
          className="text-[13.3px] text-white h-[26.62px] w-[162px] bg-blue rounded-[3.32px] flex justify-center items-center"
        >
          REPORT
        </button>
        <button
          onClick={handleClose}
          className="text-[13.3px] text-blue h-[26.62px] w-[162px] border-blue border-[1.5px] rounded-[3.32px] flex justify-center items-center"
        >
          CLOSE
        </button>
      </div>
    </div>
  );
};
export default ReportModal;
