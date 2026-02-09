interface Type {
  images: { src: string }[];
}
const Thumbnail: React.FC<Type> = ({ images }) => {
  return (
    <>
      <div className="h-[86.51px] flex flex-col justify-between">
        <h1>THUMBNAIL</h1>
        <div className="h-[62.51px] flex rounded-[13.6px] overflow-hidden">
          {images.map((item, index) => (
            <img
              className="w-1/12 h-full object-cover"
              src={item.src}
              alt=""
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default Thumbnail;
