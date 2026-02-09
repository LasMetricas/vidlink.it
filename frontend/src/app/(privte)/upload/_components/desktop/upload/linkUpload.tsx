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
      <div className="h-[110px] flex flex-col justify-between mt-[29px] relative">
        <div className="flex items-center gap-[7px] pl-1">
          <div className="text-[19px] font-semibold mb-[1.8px] ">LINK</div>
          <button onClick={handleAutoPaste}>
            {/* <img src="/icon/upload/paste.svg" alt="" /> */}
            <Link className="size-[17px]" />
          </button>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
          placeholder="Paste link here"
          className="h-[73px] text-[25px] flex items-center w-full bg-[#1E1E1E] border-[6px] focus:border-[#888] focus:outline-none border-[#505050] rounded-[20px] placeholder:text-[25px] placeholder:text-[#505050] placeholder:font-semibold px-[19px]"
        />
        <span className="text-[19px] font-semibold absolute -bottom-[50px] left-[50%] -translate-x-[50%]">
          OR
        </span>
      </div>
    </>
  );
};
export default LinkUpload;
