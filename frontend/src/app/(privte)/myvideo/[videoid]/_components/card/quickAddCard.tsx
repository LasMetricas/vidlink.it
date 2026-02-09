import { CirclePlus } from "lucide-react";

interface Type {
  setIsOpen(value: boolean): void;
}

const QuickAddCard: React.FC<Type> = ({ setIsOpen }) => {
  return (
    <button
      onClick={() => setIsOpen(true)}
      className="w-[174px] h-[43px] flex items-center justify-center border border-white rounded-[7px] text-white text-[18px] font-semibold gap-[15px]"
    >
      <CirclePlus className="size-[25px]" />
      QUICK ADD
    </button>
  );
};
export default QuickAddCard;
