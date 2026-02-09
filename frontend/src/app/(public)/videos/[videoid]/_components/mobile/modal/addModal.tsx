"use client";
import { useRef } from "react";
import LinkItem from "../input/linkItem";
import InputItem from "../input/inputItem";
import ModalCard from "./modalCard";
import useClickOutside from "@/hooks/useClickOutside";

interface Type {
  setIsOpen(value: boolean): void;
  setHidden(value: boolean): void;
}

const AddModal: React.FC<Type> = ({ setIsOpen, setHidden }) => {
  const ref = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  const handleRemove = () => {
    setIsOpen(false); // Close the menu
    setHidden(false);
  };
  useClickOutside(ref as React.RefObject<HTMLElement>, () => handleRemove);

  const handleSuggest = () => {
    setIsOpen(false);
    setHidden(false);
  };
  return (
    <div
      ref={ref}
      className="bg-[#F2F2F2] text-black text-[11.63px] font-normal absolute top-0 right-0 w-[182px] rounded-[8.31px] h-[324.14px] px-[9.97px] py-[8.31px] flex flex-col justify-between"
    >
      <button
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-end"
      >
        Cancel{" "}
        <img className="size-[13.3px]" src="/icon/detail/cancel.png" alt="" />
      </button>
      <LinkItem name="Link" holderName="Paste" />
      <InputItem name="Name" holderName="Text" />
      <div className="flex justify-between">
        <LinkItem name="Start" holderName="0:00" />
        <LinkItem name="End" holderName="0:00" />
      </div>
      <h1>Preview</h1>
      <div className="mx-auto">
        <ModalCard name="location" time="1:58" />
      </div>
      <button
        onClick={handleSuggest}
        className="text-[13.3px] text-white h-[26.62px] w-[162px] bg-blue rounded-[3.32px] flex justify-center items-center"
      >
        SUGGEST
      </button>
    </div>
  );
};
export default AddModal;
