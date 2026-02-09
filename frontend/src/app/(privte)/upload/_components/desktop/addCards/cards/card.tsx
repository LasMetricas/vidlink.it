// import * as LucideIcons from "lucide-react";
import { cardAtom, CardType } from "@/store";
import { confirmModal } from "@/utils/confirm";
import { useAtom } from "jotai";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

interface Type {
  handleIsSaved(value: number): void;
  setEditSignal(value: boolean): void;
  name: string;
  start: number;
  // icon: string;
  link: string;
  no: number;
  isSaved: boolean;
}
const Card: React.FC<Type> = ({
  handleIsSaved,
  setEditSignal,
  name,
  start,
  // icon,
  link,
  no,
  isSaved,
}) => {
  const [, setCards] = useAtom<CardType[]>(cardAtom);

  const handleDelete = (no: number) => {
    confirmModal("Are you sure you want to delete this card?", () => {
      setCards((prevCards) => {
        const newCards = prevCards
          .filter((card) => card.no !== no)
          .map((card) => (card.no > no ? { ...card, no: card.no - 1 } : card));   
        return newCards;
      });
      setEditSignal(true);
    });
  };

  const formattedStart = `(${Math.floor(start / 60)}:${
    start % 60 < 10 ? `0${start % 60}` : start % 60
  })`;
  return (
    <>
      <li className="w-[214px] flex flex-col items-center gap-[8px]">
        <button
          onClick={() => handleDelete(no)}
          className="border-[2px] rounded-full size-[45px] flex justify-center items-center"
        >
          <LucideIcons.Trash2 className="w-[40px]" />
        </button>
        <div
          className={`text-black text-[24px] font-semibold w-full h-[182px] flex flex-col justify-between z-30`}
        >
          <div className="bg-white rounded-[11px] h-[127.5px] p-[10px] overflow-hidden">
            <div className="flex justify-between w-full items-center">
              <span className="">{no < 10 ? `0${no}` : no}</span>{" "}
              <i className="font-normal">{formattedStart}</i>
            </div>
            <div
              className={`flex justify-center items-center h-[38.4px] w-full text-center mt-[30px]`}
            >
              <h1 className={``}>{name.toUpperCase()}</h1>
              {/* <IconComponent className="size-[18.29px]" /> */}
            </div>
          </div>
          <div className="flex h-[50px] gap-1 justify-between">
            <div
              className={`bg-white h-full rounded-[11px] w-[50%] flex justify-center items-center`}
            >
              <button onClick={() => handleIsSaved(no)} className="size-[30px]">
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
              className={`bg-blue h-full rounded-[11px] w-[50%] flex justify-center items-center`}
            >
              <LucideIcons.Link className="size-[33px] text-foreground" />
            </Link>
          </div>
        </div>
      </li>
    </>
  );
};
export default Card;
