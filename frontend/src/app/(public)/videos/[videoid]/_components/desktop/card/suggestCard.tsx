import { CirclePlus } from "lucide-react";

const SuggestCard = () => {
  return (
    <button className="w-[174px] h-[50px] flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/30 rounded-[12px] text-white text-[14px] font-semibold gap-2 transition-all hover:scale-105">
      <CirclePlus className="w-5 h-5 text-blue" />
      <span>SUGGEST CARD</span>
    </button>
  );
};

export default SuggestCard;
