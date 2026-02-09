"use client";
import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Type {
  handlePreviewPage(): void;
  handlePublish(): void;
  handleSaveDrafts(): void;
  loading: boolean;
  editSignal: boolean;
}
const Index: React.FC<Type> = ({
  handlePreviewPage,
  handlePublish,
  handleSaveDrafts,
  loading,
  editSignal,
}) => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") ?? "create";
  return (
    <div className="mt-10 flex flex-col lg:flex-row justify-between items-start gap-[77px] text-white">
      {/* LEFT: NOTICE TEXT */}
      <div className="flex-1 text-[18px] leading-relaxed space-y-5 text-justify">
        <p>
          <span className="font-bold">NOTE:</span> If you are unsure about
          publishing your videos or if your browser suddenly shuts down, don&apos;t
          panic; Vidlink will save all your progress in the ‘Drafts’ section.
          You can access it whenever you feel ready to publish. We also highly
          recommend double-checking the links from cards.
        </p>
        <p>
          It is completely prohibited to redirect to sexual content, illegal
          activities, offensive content, prohibited sales, and more. If you want
          to see the complete list of restricted content, please visit the terms
          & conditions page.
        </p>
      </div>

      {/* RIGHT: BUTTON GROUP */}
      <div className="flex flex-col gap-4 w-full lg:w-[353px]">
        {/* Preview */}
        <button
          onClick={handlePreviewPage}
          className="w-full h-[58px] bg-[#B1B9C6] rounded-[10px] font-semibold text-[24px] tracking-wide transition duration-300 hover:bg-[#9ea6b1]"
        >
          PREVIEW
        </button>

        {/* Save to Drafts */}
        {status === "create" ? (
          <button
            onClick={handleSaveDrafts}
            className="w-full h-[58px] border border-white rounded-[10px] font-semibold text-[24px] tracking-wide transition duration-300 hover:bg-foreground hover:text-black"
          >
            SAVE TO DRAFTS
          </button>
        ) : null}

        {/* Publish */}
        <button
          onClick={handlePublish}
          className={`${
            editSignal ? "bg-blue hover:bg-[#0052cc]" : "bg-[#002355]"
          } w-full h-[58px] flex items-center justify-center mt-[79px] rounded-[10px] font-semibold text-[29px] tracking-wide transition duration-300 `}
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
    </div>
  );
};

export default Index;
