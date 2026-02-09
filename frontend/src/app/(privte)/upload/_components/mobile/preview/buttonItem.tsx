import { setItem } from "@/utils/localstorage";
import { Loader } from "lucide-react";

interface Type {
  setEdit(value: string): void;
  handlePublish(): void;
  loading: boolean;
  editSignal: boolean;
}
const ButtonItem: React.FC<Type> = ({
  setEdit,
  handlePublish,
  loading,
  editSignal,
}) => {
  return (
    <>
      <button
        onClick={() => {
          setEdit("add");
          setItem("editStatus", "add");
        }}
        className="w-[282.8px] h-[50px] border-[3px] py-[3px] text-[25px] font-semibold rounded-[20px] mx-auto flex justify-center items-center mt-[63.4px] mb-[23px] tracking-wider leading-none"
      >
        EDIT
      </button>
      <button
        onClick={handlePublish}
        className={`${
          editSignal ? "bg-blue" : "bg-[#002355]"
        } w-[282.8px] h-[50px] py-[3px] text-[25px] font-semibold rounded-[20px]  mx-auto flex justify-center items-center mb-[56px] tracking-wider leading-none`}
      >
        {loading ? (
          <>
            <span className="text-white">PUBLISHING...</span>
            <Loader className=" text-white animate-spin" />
          </>
        ) : !editSignal ? (
          <div className="flex items-center gap-[20px]">
            PUBLISHED
            <img
              className="size-[28px]"
              src="/icon/upload/checked.png"
              alt=""
            />
          </div>
        ) : (
          <>PUBLISH</>
        )}
      </button>
    </>
  );
};
export default ButtonItem;
