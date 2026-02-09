import InfiniteScroll from "react-infinite-scroll-component";

interface Type {
  next(): void;
  dataLength: number;
  hasMore: boolean;
  children: React.ReactNode;
}
const InfiniteScrolling: React.FC<Type> = ({
  next,
  dataLength,
  hasMore,
  children,
}) => {
  return (
    <InfiniteScroll
      style={{
        overflow: "hidden",
      }}
      next={next}
      dataLength={dataLength}
      hasMore={hasMore}
      loader={
        <div className="mt-10 flex justify-center items-center ">
          <span className="border-[3px] size-[30px] border-l-background rounded-full animate-spin"></span>
        </div>
      }
    >
      {children}
    </InfiniteScroll>
  );
};
export default InfiniteScrolling;
