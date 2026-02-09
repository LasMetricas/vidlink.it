import Modal from "./modal";

interface Type {
  setEdit(value: string): void;
  setImgUrl(value: string): void;
  setImgFile(value: File): void;
  setImgBase64(value: string): void;
  picture?: string | null;
  imgUrl: string;
  edit: string;
}
const Index: React.FC<Type> = ({
  setEdit,
  setImgUrl,
  setImgFile,
  setImgBase64,
  picture,
  imgUrl,
  edit,
}) => {
  return (
    <>
      <div className="flex gap-[17.67px] ml-[19.75px] h-[74px]">
        {imgUrl ? (
          <img
            width={74}
            height={74}
            className="size-[74px] rounded-full"
            src={imgUrl}
            alt=""
            loading="eager"
            // priority
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="size-[74px]"></span>
        )}
        <div className=" relative mt-[28px] ">
          <button
            onClick={() => setEdit("modal")}
            className="py-[1px] border-[1px] border-white  rounded-[3.2px] text-[14px] px-[2px]"
          >
            EDIT PICTURE
          </button>
          {edit === "modal" && (
            <Modal
              setEdit={setEdit}
              setImgUrl={setImgUrl}
              setImgFile={setImgFile}
              setImgBase64={setImgBase64}
              picture={picture || ""}
            />
          )}
        </div>
      </div>
    </>
  );
};
export default Index;
