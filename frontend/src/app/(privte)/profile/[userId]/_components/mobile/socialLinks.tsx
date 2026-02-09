import Image from "next/image";
import Link from "next/link";
interface Type {
  instagram: string;
  tiktok: string;
  isAuth: boolean;
  email: string | undefined;
}
const SocialLinks: React.FC<Type> = ({ instagram, tiktok, isAuth, email }) => {
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
      <div
        className={`${
          isAuth ? "gap-[14px]" : "gap-[38px]"
        } flex justify-center`}
      >
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
        {isAuth || (
          <>
            {email ? (
              <Link href={`mailto:${email}`}>
                <Image
                  width={26}
                  height={26}
                  className="size-[26px]"
                  src="/icon/profile/envelope.png"
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
                  className="size-[26px]"
                  src="/icon/profile/behancel.png"
                  alt=""
                  loading="eager"
                />
              </Link>
            ) : (
              <></>
            )} */}
          </>
        )}
      </div>
    </>
  );
};
export default SocialLinks;
