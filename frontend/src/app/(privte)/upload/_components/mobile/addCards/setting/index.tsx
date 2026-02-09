import { setItem } from "@/utils/localstorage";
import { ChangeEvent } from "react";

interface Type {
  setEditSignal(value: boolean): void;
  setTitle(value: string): void;
  setInfo(value: string): void;
  title: string;
  info: string;
}
const Index: React.FC<Type> = ({
  setEditSignal,
  setTitle,
  setInfo,
  title,
  info,
}) => {
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setTitle(title);
    setItem("title", title);
    setEditSignal(true);
  };
  const handleInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const info = e.target.value;
    setInfo(info);
    setItem("info", info);
    setEditSignal(true);
  };
  return (
    <>
      <div className=" text-[12px] tracking-[2px] font-semibold mx-[19.5px] mt-[37px] flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="border-t border-white w-[20%] ml-1"></span>
          <h1 className="text-[20px]  text-center">VIDEO SETTINGS</h1>
          <span className="border-t border-white w-[20%] mr-1"></span>
        </div>
        <div className="h-[59px] mt-2 flex flex-col justify-between">
          <h1>TITLE</h1>
          <input
            value={title}
            onChange={handleTitle}
            type="text"
            placeholder="Text"
            className="h-[40px] font-normal text-[14px] py-[15px] w-full bg-[#1E1E1E] border-[2.72px] border-[#505050] rounded-[9px] placeholder:text-[12px] placeholder:text-[#505050] placeholder:font-semibold px-[9px]"
          />
        </div>
        <div className="h-[59px] flex flex-col justify-between mt-3">
          <h1>-EXTRA INFO</h1>
          <input
            value={info}
            onChange={handleInfo}
            type="text"
            placeholder="Text"
            className="h-[40px] font-normal text-[14px] py-[15px] w-full bg-[#1E1E1E] border-[2.72px] border-[#505050] rounded-[9px] placeholder:text-[12px] placeholder:text-[#505050] placeholder:font-semibold px-[9px]"
          />
        </div>
        <div className="flex flex-col items-center mt-3 gap-y-3">
          <h1 className="text-[12px]">PREVIEW</h1>
          <h2 className="text-[15px] tracking-normal">
            <span className="text-blue ">Text</span> - Text
          </h2>
        </div>
        {/* <Thumbnail images={images} />
        <div className="h-[81px] flex justify-between items-center">
          <div className="w-[110px] h-full flex flex-col justify-between items-center">
            <h1>PREVIEW FRAME</h1>
            <img
              className="h-[62px] w-full"
              src="/image/upload/vid2.svg"
              alt=""
            />
          </div>
          <div>OR</div>
          <div className="w-[110px] h-full flex flex-col justify-between items-center ">
            <h1>CUSTOM</h1>
            <label
              htmlFor="upload"
              className="flex justify-center items-center h-[62px] w-full rounded-[9.1px] overflow-hidden bg-[#191919]"
            >
              <img
                className={imgFile ? "h-[62px] w-full object-cover" : ""}
                src={imgFile ? imgFile : "/icon/upload/image.svg"}
                alt=""
              />
            </label>
            <input
              onChange={(e) => handleUploadImg(e)}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/gif, image/webp, image/svg+xml, image/bmp"
              className=" hidden"
              id="upload"
            />
          </div>
        </div> */}
      </div>
    </>
  );
};
export default Index;
