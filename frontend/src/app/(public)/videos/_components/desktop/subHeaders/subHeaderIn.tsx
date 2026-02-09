"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Type {
  setNav(value: string): void;
  setIsSearch(value: string): void;
  nav: string;
  isSearch: string;
}

const SubHeaderIn: React.FC<Type> = ({
  setNav,
  setIsSearch,
  nav,
  isSearch,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    setNav(value);
    setOpen(false);
  };

  return (
    <header className="pt-[136px] px-[3.5%] flex flex-col gap-[63px] bg-background">
      <div className="font-semibold uppercase flex items-end gap-[28px]">
        <h1 className="text-[40px] w-[250px]">
          {nav === "you" ? "ALL VIDEOS" : "FOLLOWING"}
        </h1>
        <div>change to</div>
        <div className="relative w-full max-w-[200px] text-[24px]">
          <button
            onClick={() => setOpen(!open)}
            className="w-full flex items-center justify-between font-semibold px-4 pt-2 rounded-md bg-background text-[#818fa7]"
          >
            {nav !== "you" ? "ALL VIDEOS" : "FOLLOWING"}
            <ChevronDown size={18} />
          </button>

          {open && (
            <div className="absolute mt-1 w-full rounded-md bg-background shadow-md z-10">
              <button
                onClick={() => handleSelect("you")}
                className="w-full text-left px-4 py-2 hover:bg-[#2e2e2e] rounded-t-md"
              >
                ALL VIDEOS
              </button>
              <button
                onClick={() => handleSelect("follow")}
                className="w-full text-left px-4 py-2 hover:bg-[#2e2e2e] rounded-b-md"
              >
                FOLLOWING
              </button>
            </div>
          )}
        </div>
        <input
          value={isSearch}
          onChange={(e) => setIsSearch(e.target.value)}
          className="w-[250px] h-[37px] text-[16px] rounded-[20px] border border-[#777777] outline-offset-1 px-[12px] py-[5.4px] focus:bg-[#1d1c1c] bg-background"
          type="search"
          placeholder="SEARCH..."
        />
      </div>
      <p className="max-w-[811px] text-[18px] leading-[25px] text-justify">
        This page shows all the videos uploaded by vidlink users, sorted by the
        most recent ones at the top. You can use the search bar to find videos
        by title, username, or any other info you need. <br /> If you’re logged
        in, you will only see the videos of the users you’re following by
        clicking on the “following” button.
      </p>
    </header>
  );
};

export default SubHeaderIn;
