"use client";
import { useState } from "react";
import GenderBtn from "./genderBtn";
import ActiveGenItem from "./activeGenItem";

interface Type {
  setGender(value: string): void;
  gender: string;
}
const Index: React.FC<Type> = ({ setGender, gender }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <div className="w-full flex flex-col justify-between gap-2">
        <span className="text-[17px] font-semibold">GENDER</span>
        {!gender ? (
          <div
            className={`${
              isOpen ? "h-45px]" : "h-[45px]"
            } duration-500 transition-transform  flex flex-col gap-[16px]  pt-[10px] px-[10px] pb-[15px] overflow-hidden border-[#272727] border-[3.12px] rounded-[10.41px]  bg-[#3E3E3E66] font-normal text-[14px]`}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex justify-between items-center h-[40px]"
            >
              <span>-</span>
              <img
                className={isOpen ? "rotate-180" : "rotate-0"}
                src="/icon/settings/direction.png"
                alt=""
              />
            </button>
            <GenderBtn
              name="Female"
              setIsOpen={setIsOpen}
              setGender={setGender}
            />
            <GenderBtn
              name="Male"
              setIsOpen={setIsOpen}
              setGender={setGender}
            />
            <GenderBtn
              name="Other"
              setIsOpen={setIsOpen}
              setGender={setGender}
            />
          </div>
        ) : (
          <ActiveGenItem gender={gender} setGender={setGender} />
        )}
      </div>
    </>
  );
};
export default Index;
