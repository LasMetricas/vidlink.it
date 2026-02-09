import Link from "next/link";
import { VideoType } from "../../../page";
import ReactPlayer from "react-player";
interface Type {
  relatedVideos: VideoType[];
}
const RelatedVideo: React.FC<Type> = ({ relatedVideos }) => {
  return (
    <>
      <div className=" px-[11px] pt-[41.5px]">
        <h1 className="text-[12px] pb-[11px]">RELATED VIDEOS</h1>
        <ul className=" overflow-hidden h-[189.5px] gap-x-[3.5%] gap-y-[15px] flex flex-wrap items-start">
          {relatedVideos.map((item, index) => (
            <li className="w-[31%]" key={index}>
              <div className="w-full h-[86.48px] rounded-[8.37px] overflow-hidden relative">
                {item.videoLink !== "" ? (
                  <Link
                    href={`/videos/${item._id}`}
                    className="w-full h-full relative block"
                  >
                    <ReactPlayer
                      url={item.videoLink}
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
                  </Link>
                ) : (
                  <></>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
export default RelatedVideo;
