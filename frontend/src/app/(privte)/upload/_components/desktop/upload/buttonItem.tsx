import { ArrowRight, Loader } from "lucide-react";

interface Type {
  handleNext(): void;
  error: string;
  videoSrc: string | null;
  url: string;
  loading: boolean;
}
const ButtonItem: React.FC<Type> = ({
  handleNext,
  error,
  videoSrc,
  url,
  loading,
}) => {
  return (
    <>
      {!error ? (
        <button
          onClick={handleNext}
          className={` ${
            videoSrc || url ? "bg-blue" : "bg-[#1E1E1E]"
          } w-[481px] h-[85px] flex justify-center rounded-[34px] items-center gap-[10px] font-semibold text-black text-[43px]`}
        >
          {loading ? (
            <>
              <span className="text-white">SAVING...</span>
              <Loader className=" text-white animate-spin" />
            </>
          ) : (
            <div className="flex items-center gap-[17px]">
              NEXT
              <ArrowRight className="text-black size-9 " />
            </div>
          )}
        </button>
      ) : (
        <label
          htmlFor="upload"
          className="bg-[#EA003B] w-[481px] h-[85px] flex justify-center rounded-[34px] items-center gap-[10px] font-semibold text-[43px] cursor-pointer"
        >
          RETRY
        </label>
      )}
    </>
  );
};
export default ButtonItem;
