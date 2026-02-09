import { Link, CheckCircle, XCircle } from "lucide-react";

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

  // Detect if user pasted an unsupported URL
  const isUnsupportedUrl =
    url &&
    (url.includes("tiktok.com") || url.includes("instagram.com"));

  return (
    <>
      <div className="mx-[19.5px] flex flex-col gap-2 mt-[29px] relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[7px]">
            <div className="text-[9px] font-semibold mb-[1.8px]">LINK</div>
            <button onClick={handleAutoPaste}>
              <Link className="size-[9px]" />
            </button>
          </div>
          <div className="flex gap-2 text-[8px]">
            <span className="flex items-center gap-1 text-[#888]">
              <CheckCircle className="size-[8px] text-green-500" />
              YouTube
            </span>
            <span className="flex items-center gap-1 text-[#888]">
              <XCircle className="size-[8px] text-red-500" />
              TikTok
            </span>
            <span className="flex items-center gap-1 text-[#888]">
              <XCircle className="size-[8px] text-red-500" />
              IG
            </span>
          </div>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
          placeholder="Paste YouTube or Vimeo link"
          className={`h-[34px] text-[12px] flex items-center w-full bg-[#1E1E1E] border-[2.72px] rounded-[9px] placeholder:text-[11.33px] placeholder:text-[#505050] placeholder:font-semibold px-[9px] ${
            isUnsupportedUrl ? "border-red-500" : "border-[#505050]"
          }`}
        />
        {isUnsupportedUrl && (
          <p className="text-red-400 text-[9px]">
            TikTok & Instagram don't support embedding. Download and upload the file instead.
          </p>
        )}
        <span className="text-[9px] font-semibold absolute -bottom-[26px] left-[50%] -translate-x-[50%]">
          OR
        </span>
      </div>
    </>
  );
};
export default LinkUpload;
