import * as LucideIcons from "lucide-react";
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
  return (
    <>
      <li className="text-black w-[122.41px] h-[104.5px] flex flex-col justify-between ">
        <div className="bg-white rounded-[6px] h-[73.5px] p-[6px] overflow-hidden">
          <div className="text-[13.86px] font-semibold flex justify-between w-full items-center">
            <span>{no < 10 ? `0${no}` : no}</span>
            <i className="font-normal text-blue">
              ({Math.floor(start / 60)}:
              {start % 60 < 10 ? `0${start % 60}` : start % 60})
            </i>
          </div>
          <h1 className="flex items-center justify-center text-blue text-[13.86px] pt-[5px] h-[50px] font-semibold text-center w-full ">
            {name.toUpperCase()}
          </h1>
        </div>
        <div className="flex h-[29px] gap-1">
          <div className="h-full bg-white rounded-[6px] w-[59.7px] flex justify-center items-center">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="size-[22.5px]"
            >
              {isSaved ? (
                <img src="/icon/detail/card/left2Blue.png" alt="" />
              ) : (
                <img src="/icon/detail/card/left2.svg" alt="" />
              )}
            </button>
          </div>
          {link ? (
            <a
              href={link}
              target="_blank"
              className="h-full bg-white rounded-[6px] w-[59.7px] flex justify-center items-center"
            >
              <LucideIcons.Link className="size-[19px]" />
            </a>
          ) : (
            <div className="h-full bg-white rounded-[6px] w-[59.7px] flex justify-center items-center">
              <LucideIcons.Link className="size-[19px]" />
            </div>
          )}
          {/* <img src="/icon/detail/card/right2.svg" alt="" /> */}
        </div>
      </li>
    </>
  );
};
export default PreviewCard;
