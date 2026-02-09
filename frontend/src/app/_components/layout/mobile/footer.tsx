import Link from "next/link";

const FooterMobile = ({ isFixed }: { isFixed: boolean }) => {
  return (
    <>
      <footer
        className={`${
          isFixed && "fixed  bottom-0 left-0 right-0"
        } flex justify-between items-center pt-[7px] pb-[7px] px-[10px] text-white bg-blue z-50`}
      >
        <div className="flex flex-col items-start justify-between h-[41px]">
          <div className="flex gap-[7px] items-center">
            {/* <Link href={"/"}>
              <img src="/icon/layout/x.svg" className="h-[11px]" alt="" />
            </Link> */}
            <Link
              href={"https://www.youtube.com/@the_vidlink_app"}
              target="_blank"
            >
              <img
                src="/icon/layout/youtu.svg"
                className="size-[16px]"
                alt=""
              />
            </Link>
            <Link
              href={"https://www.instagram.com/vidlink.it/"}
              target="_blank"
            >
              <img
                src="/icon/layout/instagram.svg"
                className="size-[16px]"
                alt=""
              />
            </Link>
            <Link
              href={"https://www.tiktok.com/@link.vid.link"}
              target="_blank"
            >
              <img
                src="/icon/layout/tiktok.svg"
                className="size-[16px]"
                alt=""
              />
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[6px] underline ">PRIVACY POLICY</p>
            <p className="text-[6px] underline">TERMS & CONDITIONS</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-[6px]">
          <Link href={"/"}>
            <img src="/icon/layout/title.svg" alt="" />
          </Link>
          <div className="flex items-center gap-[5px]">
            <p className="text-[12px]">A TOOL BY FALCA</p>
            <img src="/icon/layout/falca.png" alt="" className="h-[12px]" />
          </div>
        </div>
        <div className="flex flex-col items-end justify-between text-[6px] h-[41px]">
          <p className="">DID YOU DETECT A BUG?</p>
          <p className="text-[6px] text-[#264059]">
            HELP US TO IMPROVE <br /> THE VIDLINK SERVICE
          </p>
          <p className="text-[6px] underline">CONTACT US</p>
        </div>
      </footer>
    </>
  );
};
export default FooterMobile;
