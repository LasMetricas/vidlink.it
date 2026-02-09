import { CirclePlus } from "lucide-react";

const QuickCard = () => {
  return (
    <button className="w-[174px] h-[43px] flex items-center justify-center border border-white rounded-[7px] text-white text-[18px] font-semibold gap-[15px] uppercase">
      <CirclePlus className="size-[25px]" />
      quick add
    </button>
  );
};
export default QuickCard;
