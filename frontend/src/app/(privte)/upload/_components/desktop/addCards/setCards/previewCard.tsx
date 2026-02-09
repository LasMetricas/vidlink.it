import * as LucideIcons from "lucide-react";
import Link from "next/link";
interface Type {
  name: string;
  start: number;
  // icon: string;
  no: number;
  isSaved: boolean;
  link: string;
  setIsSaved(value: boolean): void;
}
const PreviewCard: React.FC<Type> = ({
  name,
  start,
  // icon,
  no,
  isSaved,
  link,
  setIsSaved,
}) => {
  // const IconComponent = LucideIcons[
  //   icon as keyof typeof LucideIcons
  // ] as React.ComponentType<React.SVGProps<SVGSVGElement>>;
  const formattedStart = `(${Math.floor(start / 60)}:${
    start % 60 < 10 ? `0${start % 60}` : start % 60
  })`;
  return (
    <>
      <li
        className={`text-black text-[22px] font-semibold w-[194px] h-[166px] flex flex-col justify-between z-30`}
      > 
        <div className="bg-white rounded-[9px] h-[117px] p-[9px] overflow-hidden">
          <div className="flex justify-between w-full items-center">
            <span className="">{no < 10 ? `0${no}` : no}</span>{" "}
            <i className="font-normal">{formattedStart}</i>
          </div>
          <div
            className={`flex items-center justify-center h-[38.4px] w-full text-center mt-[25px]`}
          >
            <h1 className={``}>{name.toUpperCase()}</h1>
            {/* <IconComponent className="size-[18.29px]" /> */}
          </div>
        </div>
        <div className="flex h-[45px] gap-1 justify-between">
          <div
            className={`bg-white h-full rounded-[9px] w-[50%] flex justify-center items-center`}
          >
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="size-[30px]"
            >
              <LucideIcons.Bookmark
                className={`${
                  isSaved ? "fill-blue text-blue" : "text-gray-700"
                } size-[30px]`}
              />
            </button>
          </div>
          <Link
            href={link}
            target="_blank"
            className={`bg-blue h-full rounded-[9px] w-[50%] flex justify-center items-center`}
          >
            <LucideIcons.Link className="size-[30px] text-foreground" />
          </Link>
        </div>
      </li>
    </>
  );
};
export default PreviewCard;
