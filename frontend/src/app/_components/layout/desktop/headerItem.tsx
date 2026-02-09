import Link from "next/link";
interface Type {
  url: string;
  name: string;
}

const HeaderItem: React.FC<Type> = ({ url, name }) => {
  return (
    <Link
      href={url}
      className="rounded-[3.2px] text-[18px] font-semibold px-[2.13px] tracking-wide flex items-center justify-center"
    >
      <span>{name}</span>
    </Link>
  );
};
export default HeaderItem;
