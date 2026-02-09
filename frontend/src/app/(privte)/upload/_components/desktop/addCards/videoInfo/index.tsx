import { ChangeEvent } from "react";
import ReactPlayer from "react-player";

interface Type {
  setEditSignal(value: boolean): void;
  setTitle(value: string): void;
  setDescription(value: string): void;
  setInfo(value: string): void;
  title: string;
  description: string;
  info: string;
  videoLink: string;
}
const Index: React.FC<Type> = ({
  setEditSignal,
  setTitle,
  setDescription,
  setInfo,
  title,
  description,
  info,
  videoLink,
}) => {
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setTitle(title);
    setEditSignal(true);
  };

  const handleInfo = (e: ChangeEvent<HTMLInputElement>) => {
    const info = e.target.value;
    setInfo(info);
    setEditSignal(true);
  };
  const handleDescription = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    setDescription(description);
    setEditSignal(true);
  };

  return (
    <div className="mt-10 text-white text-[18px]">
      <h1 className="text-[40px] font-bold tracking-[3px] mb-[px]">
        1. VIDEO INFO
      </h1>
      <div className="flex flex-col lg:flex-row gap-[56px]">
        {/* LEFT: FORM */}
        <div className="flex-1 flex flex-col gap-[32px] mt-[30px]">
          <div>
            <label className="font-semibold tracking-wide">TITLE *</label>
            <input
              value={title}
              onChange={handleTitle}
              type="text"
              placeholder="BOKETE"
              className="mt-[18px] h-[40px] w-full bg-[#1E1E1E] border-2 border-[#505050] rounded-[9px] px-[9px] text-[16px] italic placeholder:text-[#505050]"
            />
          </div>

          <div>
            <label className="font-semibold tracking-wide">
              EXTRA INFO - artist/brand/platform/etc.
            </label>
            <input
              value={info}
              onChange={handleInfo}
              type="text"
              placeholder="BAD BUNNY"
              className="mt-[18px] h-[40px] w-full bg-[#1E1E1E] border-2 border-[#505050] rounded-[9px] px-[9px] text-[16px] italic placeholder:text-[#505050]"
            />
          </div>

          <div>
            <label className="font-semibold tracking-wide">
              VIDEO DESCRIPTION
            </label>
            <textarea
              value={description}
              onChange={handleDescription}
              placeholder="Lorem ipsum dolor sit amet..."
              className="mt-[18px] h-[100px] w-full text-[16px] italic bg-[#1E1E1E] border-2 border-[#505050] rounded-[9px] px-[9px] py-[6px] placeholder:text-[#505050]"
            />
          </div>
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="w-full lg:w-[529px] flex flex-col items-center uppercase font-semibold text-[17px]">
          <h1 className="tracking-widest  mb-3">PREVIEW</h1>
          <h2 className="text-center mb-3">
            <span className="text-blue font-bold">{title || "Text"}</span> -{" "}
            {info || "Text"}
          </h2>
          <div className="w-[365px] h-[277px] overflow-hidden rounded-[9px] relative block">
            {videoLink ? (
              <ReactPlayer
                url={videoLink}
                preload="auto"
                // controls
                progressInterval={1000}
                width="100%"
                height="100%"
                config={{
                  file: {
                    attributes: {
                      playsInline: true,
                      style: {
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      },
                    },
                  },
                }}
              />
            ) : (
              <></>
            )}
            <div className="absolute inset-0 z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Index;
