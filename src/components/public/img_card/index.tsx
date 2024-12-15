import clsx from "clsx";

export default function ImgCard(props: any) {
  const { title, url, descr } = props;

  return (
    <div className="w-[350px]   rounded-lg shadow-md  bg-white dark:bg-theme_dark  hover:scale-[1.02] hover:shadow-sm transition-all duration-300 ease-in-out box-content ">
      <header>
        <img
          src={
            url ||
            "https://cdn.cnbj0.fds.api.mi-img.com/b2c-shopapi-pms/pms_1689729487.47189603.png"
          }
          alt="avatar"
          className={clsx("w-[350px] rounded-t-md h-[200px] object-contain")}
        />
      </header>
      <article className="w-full text-center text-gray-600 font-medium p-2 flex flex-col items-start transition-all duration-300 ease-in-out">
        <div className="text-lg font-bold hover:text-theme_blue  cursor-pointer">
          {title || "ImgCard"}
        </div>
        <div className="text-sm">{descr || "这个人很懒未留简介"}</div>
      </article>
    </div>
  );
}
