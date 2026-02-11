import { CheckCircle } from "lucide-react";

const CardNextBlank = () => {
  return (
    <div className="w-[174px] h-[50px] flex items-center justify-center bg-green-500/20 border border-green-500/30 rounded-[12px] text-green-400 text-[14px] font-semibold gap-2">
      <CheckCircle className="w-5 h-5" />
      <span>ALL REVEALED</span>
    </div>
  );
};

export default CardNextBlank;
