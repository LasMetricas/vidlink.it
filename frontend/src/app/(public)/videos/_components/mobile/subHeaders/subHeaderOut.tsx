import { basicBold } from "@/style/fonts/fonts";
interface Type {
  setIsSearch(value: string): void;
  isSearch: string;
}
const SubHeaderOut: React.FC<Type> = ({ setIsSearch, isSearch }) => {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 pt-[110px] flex flex-col items-center gap-[16px] px-[22px] bg-background z-[1]">
        <h1 className={`${basicBold.className} text-[48px]`}>ALL VIDEOS</h1>
        <i className="text-[10px] font-normal">
          Log in to view the content from the people you follow.
        </i>
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
export default SubHeaderOut;
