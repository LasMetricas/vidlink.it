"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Button from "./button";

interface Type {
  setUser(value: string): void;
  setPeriod(value: string): void;
  user: string;
  period: string;
  isAdmin: boolean;
}

const FltButtons: React.FC<Type> = ({
  setUser,
  setPeriod,
  user,
  period,
  isAdmin,
}) => {
  const [isOpenOwner, setIsOpenOwner] = useState<boolean>(false);
  const [isOpenTime, setIsOpenTime] = useState<boolean>(false);

  const handleOwner = () => {
    setIsOpenOwner(!isOpenOwner);
    setIsOpenTime(false);
  };
  const handleTime = () => {
    setIsOpenTime(!isOpenTime);
    setIsOpenOwner(false);
  };

  return (
    <>
      <div className="w-[350px] flex flex-col gap-[17px]">
        <div
          className={`${
            isOpenOwner ? "h-[175px]" : "h-[49px]"
          } flex flex-col gap-[5px] duration-300 overflow-hidden`}
        >
          <button
            onClick={handleOwner}
            className={`${
              isOpenOwner ? "min-h-[40px]" : "min-h-[49px]"
            } flex items-center justify-center gap-[8px] w-[234px] rounded-[7px] uppercase font-semibold text-[19px] bg-blue duration-300`}
          >
            {user}
            <ChevronDown
              className={`${
                isOpenOwner ? "rotate-0" : "-rotate-180"
              } duration-300`}
            />
          </button>
          <Button setValue={setUser} name="creator" value="creator" />
          <Button setValue={setUser} name="viewer" value="viewer" />
          {isAdmin ? (
            <Button setValue={setUser} name="admin" value="admin" />
          ) : null}
        </div>
        <div
          className={`${
            isOpenTime ? "h-[175px]" : "h-[49px]"
          } flex flex-col gap-[5px] duration-300 overflow-hidden`}
        >
          <button
            onClick={handleTime}
            className={`${
              isOpenTime ? "min-h-[40px]" : "min-h-[49px]"
            } flex items-center justify-center gap-[8px] w-[234px] rounded-[7px] uppercase font-semibold text-[19px] bg-blue duration-300`}
          >
            {period === "year"
              ? "year"
              : period === "month"
              ? "month"
              : "ever"}
            <ChevronDown
              className={`${
                isOpenTime ? "rotate-0" : "-rotate-180"
              } duration-300`}
            />
          </button>
          <Button setValue={setPeriod} name="month" value="month" />
          <Button setValue={setPeriod} name="year" value="year" />
          <Button setValue={setPeriod} name="ever" value="ever" />
        </div>
      </div>
    </>
  );
};

export default FltButtons;
