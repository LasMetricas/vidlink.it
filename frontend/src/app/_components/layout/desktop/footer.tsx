import Link from "next/link";

const FooterDesktop = ({ isFixed }: { isFixed: boolean }) => {
  return (
    <>
      <footer
        className={`${
          isFixed && "fixed  bottom-0 left-0 right-0"
        } flex justify-between items-center py-[20px] px-[20px] text-[16px] font-semibold uppercase`}
      >
        <div className="flex items-center gap-[20px]">
          <Link href={"/"}>
            <img src="/icon/desktop/layout/logo2.png" alt="" />
          </Link>
          <Link href={"/supercharge"} className="">
            supercharge your videos
          </Link>
        </div>
        <a href="mailto:vid.link.vid@gmail.com">contact</a>
        <div className="flex items-center gap-[60px]">
          <Link href={"/terms&conditions"} className="">
            terms & conditions
          </Link>
          <div className="flex items-center gap-[20px]">
            <Link
              href={"https://www.instagram.com/vidlink.it/"}
              target="_blank"
            >
              <img
                src="/icon/desktop/layout/instagram.png"
                className="size-[34px]"
                alt=""
              />
            </Link>
            <Link
              href={"https://www.tiktok.com/@link.vid.link"}
              target="_blank"
            >
              <img
                src="/icon/desktop/layout/tiktok.png"
                className="size-[34px]"
                alt=""
              />
            </Link>
            <Link
              href={"https://www.youtube.com/@the_vidlink_app"}
              target="_blank"
            >
              <img
                src="/icon/desktop/layout/youtu.png"
                className="size-[34px]"
                alt=""
              />
            </Link>
            {/* <Link href={"/"}>
              <img
                src="/icon/desktop/layout/x.png"
                className="h-[24px]"
                alt=""
              />
            </Link> */}
          </div>
        </div>
      </footer>
    </>
  );
};
export default FooterDesktop;
