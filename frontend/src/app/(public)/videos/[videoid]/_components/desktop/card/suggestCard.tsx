import { CirclePlus } from "lucide-react";

const SuggestCard = () => {
  return (
    <button className="w-[174px] h-[43px] flex items-center justify-center border border-white rounded-[7px] text-white text-[18px] font-semibold gap-[15px]">
      <CirclePlus className="size-[25px]" />
      SUGGEST
    </button>
  );
};
export default SuggestCard;
