import { Outlet } from "react-router-dom";
import homeBg from "../../assets/home-bg.png";
import FadeInAnimation from "../../components/animation";

export default function Layout() {
  return (
    <>
      <div style={{backgroundImage: `url(${homeBg})`}} className="w-full h-screen bg-cover bg-center bg-no-repeat">
        <FadeInAnimation className="
            px-[8%] pt-[20vh] 
            sm:px-8 sm:pt-[18vh] 
            md:px-12 md:pt-[20vh] 
            lg:px-16 lg:pt-[22vh] 
            xl:px-20 xl:pt-[24vh] 
            2xl:px-24 2xl:pt-[26vh]
            flex flex-col gap-2 max-w-4xl">
          <Outlet />
        </FadeInAnimation>
      </div>   
    </>
  );
}
