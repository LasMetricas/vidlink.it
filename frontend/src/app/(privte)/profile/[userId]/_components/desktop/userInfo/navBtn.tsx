import Link from "next/link";

const NavBtn = ({
  link,
  name,
  className,
}: {
  link: string;
  name: string;
  className: string;
}) => {
  return (
    <>
      <Link
        href={link}
        className={`${className} transition duration-300 h-[42px] w-[150px] rounded-[4px] flex items-center py-[2px] justify-center text-[20px] uppercase`}
      >
        {name}
      </Link>
    </>
  );
};
export default NavBtn;
