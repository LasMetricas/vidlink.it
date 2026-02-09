import Image from "next/image";
import Link from "next/link";
interface Type {
  instagram?: string | null;
  tiktok?: string | null;
}
const SocialLinks: React.FC<Type> = ({ instagram, tiktok }) => {
  const createUrl = (platform: string | undefined | null, baseUrl: string) => {
    if (!platform) return null;
    if (platform.startsWith("https") || platform.startsWith(baseUrl)) {
      return platform;
    }
    return `https://${baseUrl}.com/${platform}`;
  };

  const instaUrl = createUrl(instagram, "instagram");
  const tiktokUrl = createUrl(tiktok, "tiktok");

  // Return null if no URLs are valid
  if (!instaUrl && !tiktokUrl) return null;

  return (
    <>
      <div className="flex gap-[14px] justify-center ">
        {instagram ? (
          <Link href={instaUrl || ""} target="_blank">
            <Image
              width={26}
              height={26}
              className="size-[26px]"
              src="/icon/profile/instagram.png"
              alt=""
              loading="eager"
            />
          </Link>
        ) : (
          <></>
        )}
        {tiktok ? (
          <Link href={tiktokUrl || ""} target="_blank">
            <Image
              width={26}
              height={26}
              className="size-[26px]"
              src="/icon/profile/tiktok.png"
              alt=""
              loading="eager"
            />
          </Link>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
export default SocialLinks;
