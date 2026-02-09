import Link from "next/link";

const NavBtn = ({ link, name }: { link: string; name: string }) => {
  return (
    <>
      <Link
        href={link}
         className="h-[28.88px] bg-blue rounded-[4.97px] flex items-center py-[2px] justify-center text-[10.5px] font-semibold"
      >
        {name}
      </Link>
    </>
  );
};
export default NavBtn;
