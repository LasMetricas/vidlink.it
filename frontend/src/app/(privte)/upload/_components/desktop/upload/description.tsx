const Description = () => {
  return (
    <>
      <div className="text-[17px] font-normal tracking-widest h-[55px] flex flex-col items-start justify-between text-center">
        <p>
          MAX FILE SIZE <span className="font-semibold">50MB</span>. MAX{" "}
          <span className="font-semibold">4 MINUTES FILE.</span>
        </p>
        <p className="">
          FORMAT <span className="font-bold">MP4</span> /{" "}
          <span className="font-bold">MOV</span> /{" "}
          <span className="font-bold">WMV</span> /{" "}
          <span className="font-bold">FLV</span> /{" "}
          <span className="font-bold">AVI</span>.
        </p>
        <p>YOUR VIDEOS WILL BE PRIVATE UNTIL YOU PUBLISH THEM.</p>
      </div>
    </>
  );
};
export default Description;
