import { Loader } from "lucide-react";

interface Type {
  handleSave(): void;
  isSaved: boolean;
  loading: boolean;
}
const SaveBtn: React.FC<Type> = ({ handleSave, isSaved, loading }) => {
  return (
    <button
      onClick={handleSave}
      className={`${
        isSaved ? "bg-blue" : "bg-[#002355]"
      } h-[50px] w-[282.8px] py-[3px] bg-blue rounded-[20px] text-[25px] mb-[71px] font-semibold flex items-center justify-center mx-auto`}
    >
      {loading ? (
        <>
          <span className="text-white">SAVING...</span>
          <Loader className=" text-white animate-spin" />
        </>
      ) : isSaved ? (
        <div className="flex items-center gap-[20px]">
          SAVED
          <img className="size-[28px]" src="/icon/upload/checked.png" alt="" />
        </div>
      ) : (
        <>SAVE</>
      )}
    </button>
  );
};
export default SaveBtn
