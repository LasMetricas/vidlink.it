import { Link } from "lucide-react";

interface Type {
  setUrl(value: string): void;
  url: string;
}
const LinkUpload: React.FC<Type> = ({ setUrl, url }) => {
  //auto paste
  const handleAutoPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };
  return (
    <>
      <div className="mx-[19.5px] h-[51px] flex flex-col justify-between mt-[29px] relative">
        <div className="flex items-center gap-[7px]">
          <div className="text-[9px] font-semibold h-[7px] mb-[1.8px] ">
            LINK
          </div>
          <button onClick={handleAutoPaste}>
            {/* <img src="/icon/upload/paste.svg" alt="" /> */}
            <Link className="size-[9px]"/>
          </button>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
          placeholder="Paste link here"
          className="h-[34px] text-[12px] flex items-center w-full bg-[#1E1E1E] border-[2.72px] border-[#505050] rounded-[9px] placeholder:text-[11.33px] placeholder:text-[#505050] placeholder:font-semibold px-[9px]"
        />
        <span className="text-[9px] font-semibold absolute -bottom-[26px] left-[50%] -translate-x-[50%]">
          OR
        </span>
      </div>
    </>
  );
};
export default LinkUpload;
