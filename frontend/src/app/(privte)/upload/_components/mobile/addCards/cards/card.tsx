// import * as LucideIcons from "lucide-react";
import { cardAtom, CardType } from "@/store";
import { confirmModal } from "@/utils/confirm";
import { setItem } from "@/utils/localstorage";
import { useAtom } from "jotai";
import { Link, Trash2 } from "lucide-react";

interface Type {
  handleIsSaved(value: number): void;
  setName(value: string): void;
  // setIcon(value: string): void;
  setLink(value: string): void;
  setStart(value: number): void;
  name: string;
  start: number;
  // icon: string;
  link: string;
  no: number;
  isSaved: boolean;
}
const Card: React.FC<Type> = ({
  handleIsSaved,
  // setName,
  // setIcon,
  // setLink,
  // setStart,
  name,
  start,
  // icon,
  link,
  no,
  isSaved,
}) => {
  const [, setCards] = useAtom<CardType[]>(cardAtom);
  // const IconComponent = LucideIcons[
  //   icon as keyof typeof LucideIcons
  // ] as React.ComponentType<React.SVGProps<SVGSVGElement>>;

  // const handleInit = () => {
  //   setName(name);
  //   // setIcon(icon);
  //   setLink(link);
  //   setStart(start);
  // };
  const handleDelete = (no: number) => {
    confirmModal("Are you sure you want to delete this card?", () =>
      setCards((prevCards) => {
        const newCards = prevCards.filter((card) => card.no !== no);
        setItem("cards", newCards);
        return newCards;
      })
    );
  };
  return (
    <>
      <li className="w-[32%] flex flex-col items-center gap-[5px]">
        <button
          onClick={() => handleDelete(no)}
          className="border-[1.2px] rounded-full size-[26px] flex justify-center items-center"
        >
          <Trash2 className="w-[13px]" />
        </button>
        <div className="text-black w-full h-[104.5px] flex flex-col justify-between ">
          <div className="bg-white rounded-[6px] h-[73.5px] p-[6px] overflow-hidden">
            <div className="text-[13.86px] font-semibold flex justify-between w-full items-center">
              <span>{no < 10 ? `0${no}` : no}</span>
              <i className="font-normal text-blue">
                ({Math.floor(start / 60)}:
                {start % 60 < 10 ? `0${start % 60}` : start % 60})
              </i>
            </div>
            <h1 className="flex items-center justify-center text-blue text-[13.86px] mt-[3px] h-[50px] font-semibold text-center w-full ">
              {name.toUpperCase()}
            </h1>
          </div>
          <div className="flex h-[29px] gap-1">
            <div className="h-full bg-white rounded-[6px] w-[50%] flex justify-center items-center">
              <button
                onClick={() => handleIsSaved(no)}
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
                className="h-full bg-white rounded-[6px] w-[50%] flex justify-center items-center"
              >
                <Link className="size-[19px]" />
              </a>
            ) : (
              <div className="h-full bg-white rounded-[6px] w-[50%] flex justify-center items-center">
                <Link className="size-[19px]" />
              </div>
            )}
            {/* <img src="/icon/detail/card/right2.svg" alt="" /> */}
          </div>
        </div>
      </li>
    </>
  );
};
export default Card;
