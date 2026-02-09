interface Type {
  setNav(value: string): void;
  setIsSearch(value: string): void;
  nav: string;
  isSearch: string;
}

const subHeaderIn: React.FC<Type> = ({
  setNav,
  setIsSearch,
  nav,
  isSearch,
}) => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 pt-[103px] px-[22px] flex flex-col items-center gap-[28.1px] bg-background z-[1]">
        <div className="flex gap-[83px]">
          <button
            onClick={() => setNav("you")}
            className={`${
              nav === "you"
                ? "text-blue font-bold"
                : "text-[#3C4450] font-semibold "
            } text-[20px] leading-[18.07px] underline underline-offset-[25%]`}
          >
            FOR&nbsp;YOU
          </button>
          <button
            onClick={() => setNav("follow")}
            className={`${
              nav === "follow"
                ? "text-blue font-bold"
                : "text-[#3C4450] font-semibold "
            } text-[20px] leading-[18.07px] underline underline-offset-[25%]`}
          >
            FOLLOWING
          </button>
        </div>
        <input
          value={isSearch}
          onChange={(e) => setIsSearch(e.target.value)}
          className="w-full h-[27px] text-[12px] rounded-[20px] border border-[#777777] outline-offset-1 px-[12px] py-[5.4px] mb-[20.5px] placeholder-[#5B5B5B]"
          type="search"
          placeholder="SEARCH..."
        />
      </header>
    </>
  );
};
export default subHeaderIn;
