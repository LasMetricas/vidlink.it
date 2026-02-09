import Image from "next/image";
import Link from "next/link";
interface Type {
  instagram: string;
  tiktok: string;
  email: string | undefined;
}
const SocialLinks: React.FC<Type> = ({ instagram, tiktok, email }) => {
  const createUrl = (platform: string | undefined | null, baseUrl: string) => {
    if (!platform) return null;
    if (platform.startsWith("https") || platform.startsWith(baseUrl)) {
      return platform;
    }
    return `https://${baseUrl}.com/${platform}`;
  };

  const instaUrl = createUrl(instagram, "instagram");
  const tiktokUrl = createUrl(tiktok, "tiktok");
  // const behancelUrl = createUrl(behancel, "tiktok");

  // Return null if no URLs are valid
  if (!instaUrl && !tiktokUrl) return null;
  return (
    <>
      <div className={`gap-[23px] flex`}>
        {instagram ? (
          <Link href={instaUrl || ""} target="_blank">
            <Image
              width={26}
              height={26}
              className="size-[46px]"
              src="/icon/desktop/profile/instagram.png"
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
              className="size-[46px]"
              src="/icon/desktop/profile/tiktok.png"
              alt=""
              loading="eager"
            />
          </Link>
        ) : (
          <></>
        )}

        {email ? (
          <Link href={`mailto:${email}`}>
            <Image
              width={26}
              height={26}
              className="size-[46px]"
              src="/icon/desktop/profile/envelope.png"
              alt=""
              loading="eager"
            />
          </Link>
        ) : (
          <></>
        )}
        {/* {behancelUrl ? (
              <Link href={""}>
                <Image
                  width={26}
                  height={26}
                  className="size-[46px]"
                  src="/icon/desktop/profile/behancel.png"
                  alt=""
                  loading="eager"
                />
              </Link>
            ) : (
              <></>
            )} */}
      </div>
    </>
  );
};
export default SocialLinks;
