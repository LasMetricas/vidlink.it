"use client";
import { ChangeEvent, useState } from "react";

interface Type {
  name: string;
  holderName: string;
  value: string;
  setValue(value: string): void;
}
const InputItem: React.FC<Type> = ({ name, holderName, value, setValue }) => {
  const [caution, setCaution] = useState<string>("");
  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (name === "bio" && inputValue.length > 50) {
      setCaution("You can't exceed 30 characters in your bio.");
    } else {
      setValue(inputValue);
      setCaution("");
    }
  };
  return (
    <>
      <label className="w-full flex flex-col gap-2 justify-between">
        <span className="text-[17px] font-semibold">{name.toUpperCase()}</span>
        <input
          value={value}
          onChange={handleValue}
          type="text"
          placeholder={holderName}
          className={`${
            value
              ? "bg-blue border-none"
              : "bg-[#3E3E3E66] border-[#272727] border-[3.12px]"
          } h-[45px] text-[17px] py-[2px]  rounded-[10.41px] px-[11.47px] placeholder-[#4F4F4F] placeholder:text-[17px] placeholder:font-semibold `}
        />
      </label>
      <i className="text-[red] text-[12px]">
        <h1>{caution}</h1>
      </i>
    </>
  );
};
export default InputItem;
