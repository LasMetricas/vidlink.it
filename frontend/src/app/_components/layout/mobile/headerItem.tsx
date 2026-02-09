import Link from "next/link";
interface Type {
  setIsOpenMenu(value: boolean): void;
  url: string;
  name: string;
  isAuth?: boolean;
}

const HeaderItem: React.FC<Type> = ({ setIsOpenMenu, url, name, isAuth }) => {
  return (
    <Link
      onClick={() => setIsOpenMenu(false)}
      href={url}
      className={`${
        isAuth ? "text-white border-white" : "text-[#303030] border-[#303030]"
      } border-[1px]  font-semibold  rounded-[3.2px] text-[16px] px-[2.13px] tracking-wide flex items-center justify-center`}
    >
      <span>{name}</span>
    </Link>
  );
};
export default HeaderItem;
