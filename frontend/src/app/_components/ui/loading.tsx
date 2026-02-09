export default function LoadingMiddle() {
  return (
    <>
      <div className="h-screen w-screen flex justify-center items-center ">
        <span className="border-[3px] size-[30px] border-l-background rounded-full animate-spin"></span>
      </div>
    </>
  );
}

export const LoadingTop = () => {
  return (
    <>
      <div className="w-screen flex justify-center pt-10">
        <span className="border-[3px] size-[30px] border-l-background rounded-full animate-spin"></span>
      </div>
    </>
  );
};
