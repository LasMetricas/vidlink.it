import ReactPlayer from "react-player";
interface Type {
  videoLink: string;
}
const VideoItem: React.FC<Type> = ({ videoLink }) => {
  return (
    <>
      <li className=" flex flex-col items-center  justify-between">
        {videoLink !== "" ? (
          <div className="h-[86.48px] w-full rounded-[8.37px] overflow-hidden relative block">
            <ReactPlayer
              url={videoLink}
              // playing
              muted
              loop
              width="100%"
              height="100%"
              progressInterval={1000}
              config={{
                file: {
                  attributes: {
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  },
                },
              }}
            />
            <div className="absolute inset-0 z-10"></div>
          </div>
        ) : (
          <></>
        )}
      </li>
    </>
  );
};
export default VideoItem;
