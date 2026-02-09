import { Trash2 } from "lucide-react";
import { ChangeEvent } from "react";

interface Type {
  validateVideo(value: ChangeEvent<HTMLInputElement>): void;
  cancelVideo(): void;
  error: string;
  videoSrc: string | null;
  loading: boolean;
}
const FileUpload: React.FC<Type> = ({
  validateVideo,
  cancelVideo,
  error,
  videoSrc,
  loading,
}) => {
  return (
    <>
      <div className="h-[500px] flex justify-center items-center rounded-[23px] bg-[#1E1E1E] mt-[78px] relative">
        {!error ? (
          <>
            <label htmlFor="upload" className="h-[128px]  mb-[26.36px]">
              <div
                className={`${
                  videoSrc ? "opacity-0" : "opacity-100"
                } gap-[8px] duration-500 flex flex-col items-center`}
              >
                <img
                  className="size-[86px]"
                  src="/icon/desktop/upload/file.png"
                  loading="eager"
                  alt=""
                />
                <div className="border-[2px] border-white rounded-[5px] text-[25px] font-semibold px-[5px] ">
                  BROWSE FILE
                </div>
              </div>
              <img
                className={`${
                  videoSrc ? "opacity-100" : "opacity-0"
                } size-[137px] duration-1000 absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2`}
                src="/icon/desktop/upload/checked.png"
                alt=""
              />
            </label>
          </>
        ) : (
          <div className="h-[194px] flex flex-col items-center gap-[14px]">
            <img
              className="size-[86px]"
              src="/icon/desktop/upload/error.png"
              alt=""
            />
            <div className="flex flex-col justify-between items-center gap-[27px] text-[#EA003B] font-semibold">
              <span className="text-[25px] ">ERROR</span>
              <p className="text-center text-[20px] w-[383px]">
                {/* An error occurred: the file may be too large or exceed the
                allowed duration. */}
                {error}
              </p>
            </div>
          </div>
        )}
        <input
          className=" hidden"
          id="upload"
          type="file"
          accept="video/mp4, video/mov, video/wmv, video/flv, video/avi"
          onChange={(e) => {
            validateVideo(e);
            e.target.value = "";
          }}
        />
        {(videoSrc || error) && !loading && (
          <button onClick={cancelVideo} className="absolute right-7 top-7">
            <Trash2 />
          </button>
        )}
      </div>
    </>
  );
};
export default FileUpload;
