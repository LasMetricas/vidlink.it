import { Link, CheckCircle, XCircle } from "lucide-react";

interface Type {
  setUrl(value: string): void;
  url: string;
}

const supportedPlatforms = [
  { name: "YouTube", supported: true },
  { name: "Vimeo", supported: true },
  { name: "Dailymotion", supported: true },
  { name: "Facebook", supported: true },
];

const unsupportedPlatforms = [
  { name: "TikTok", supported: false },
  { name: "Instagram", supported: false },
];

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
    (url.includes("tiktok.com") ||
      url.includes("instagram.com"));

  return (
    <>
      <div className="h-[200px] flex flex-col justify-center gap-4 mt-[29px] relative bg-[#1E1E1E] rounded-[23px] px-[30px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[7px] pl-1">
            <div className="text-[19px] font-semibold mb-[1.8px]">LINK</div>
            <button onClick={handleAutoPaste}>
              <Link className="size-[17px]" />
            </button>
          </div>
          <div className="flex gap-4 text-[12px]">
            {supportedPlatforms.map((p) => (
              <span key={p.name} className="flex items-center gap-1 text-[#888]">
                <CheckCircle className="size-[12px] text-green-500" />
                {p.name}
              </span>
            ))}
            {unsupportedPlatforms.map((p) => (
              <span key={p.name} className="flex items-center gap-1 text-[#888]">
                <XCircle className="size-[12px] text-red-500" />
                {p.name}
              </span>
            ))}
          </div>
        </div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
          placeholder="Paste YouTube, Vimeo, or other supported link"
          className={`h-[73px] text-[25px] flex items-center w-full bg-[#1E1E1E] border-[6px] focus:border-[#888] focus:outline-none rounded-[20px] placeholder:text-[20px] placeholder:text-[#505050] placeholder:font-semibold px-[19px] ${
            isUnsupportedUrl ? "border-red-500" : "border-[#505050]"
          }`}
        />
        {isUnsupportedUrl && (
          <p className="text-red-400 text-[13px] -mt-2">
            TikTok & Instagram links don't support embedding. Please download the video and upload the file below.
          </p>
        )}
        <span className="text-[19px] font-semibold absolute -bottom-[40px] left-[50%] -translate-x-[50%]">
          OR
        </span>
      </div>
    </>
  );
};
export default LinkUpload;
