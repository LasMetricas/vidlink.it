import { Loader } from "lucide-react";

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
          } w-[282.81px] h-[50px] flex justify-center rounded-[20px] pt-[3px] items-center gap-[10px] mx-auto font-semibold text-black text-[25px]`}
        >
          {loading ? (
            <>
              <span className="text-white">SAVING...</span>
              <Loader className=" text-white animate-spin" />
            </>
          ) : (
            <>
              NEXT
              <img
                className="size-[18px]"
                src="/icon/upload/arrow.svg"
                alt=""
              />
            </>
          )}
        </button>
      ) : (
        <label
          htmlFor="upload"
          className="bg-[#EA003B] w-[282.81px] h-[50px] flex justify-center rounded-[20px] items-center gap-[10px] mx-auto mt-[88px] mb-[60px] font-semibold text-black text-[25px]"
        >
          RETRY
        </label>
      )}
    </>
  );
};
export default ButtonItem;
