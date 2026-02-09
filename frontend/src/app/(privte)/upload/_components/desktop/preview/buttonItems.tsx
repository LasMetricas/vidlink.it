"use client";
import { Loader, Undo } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Type {
  setEdit(value: string): void;
  handlePublish(): void;
  loading: boolean;
  editSignal: boolean;
}
const ButtonItems: React.FC<Type> = ({
  setEdit,
  handlePublish,
  loading,
  editSignal,
}) => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "create";
  return (
    <>
      <div className="flex justify-between items-center">
        <button
          onClick={() => {
            setEdit("add");
          }}
          className="w-[220px] h-[55px] border-[3px] py-[3px] text-[20px] font-semibold rounded-[10px] flex justify-center items-center tracking-wider hover:bg-foreground hover:text-black transition duration-300"
        >
          <Undo />
          BACK TO EDIT
        </button>
        <button
          onClick={handlePublish}
          className={`${
            editSignal ? "bg-blue hover:bg-[#0052cc]" : "bg-[#002355]"
          } w-[353px] h-[74px] py-[3px] text-[28px] font-semibold rounded-[10px] flex justify-center items-center tracking-wider transition duration-300`}
        >
          {loading ? (
            <>
              <span className="text-white">
                {status === "edit" ? "SAVING" : "PUBLISHING..."}
              </span>
              <Loader className=" text-white animate-spin" />
            </>
          ) : !editSignal ? (
            <div className="flex items-center gap-[20px]">
              {status === "edit" ? "SAVED" : "PUBLISHED"}
              <img
                className="size-[28px]"
                src="/icon/desktop/upload/checked.png"
                alt=""
              />
            </div>
          ) : (
            <> {status === "edit" ? "SAVE" : "PUBLISH"}</>
          )}
        </button>
      </div>
    </>
  );
};
export default ButtonItems;
