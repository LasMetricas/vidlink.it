const SubHeaderOut = () => {
  return (
    <>
      <header className="pt-[103px] px-[3.5%] flex flex-col gap-[63px] bg-background">
        <h1 className="text-[40px] w-[250px] font-semibold">ALL VIDEOS</h1>
        <p className="max-w-[811px] text-[18px] leading-[25px] text-justify">
          This page shows all the videos uploaded by vidlink users, sorted by
          the most recent ones at the top. You can use the search bar to find
          videos by title, username, or any other info you need. <br /> If
          you’re logged in, you will only see the videos of the users you’re
          following by clicking on the “following” button.
        </p>
      </header>
    </>
  );
};
export default SubHeaderOut;
