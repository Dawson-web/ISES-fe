import { useState, useEffect } from "react";
import useMeasure from "react-use-measure";
import { useSpring, animated } from "@react-spring/web";

const Loading = () => {
  const [ref] = useMeasure();
  const [progress, setProgress] = useState(0);

  const props = useSpring({
    config: { duration: 500 },
    progress,
  });

  useEffect(() => {
    const entries = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];

    const countResources = entries.filter(
      (entry): entry is PerformanceResourceTiming =>
        entry.initiatorType !== "navigation"
    ).length;

    const loadedCount = entries.filter(
      (entry): entry is PerformanceResourceTiming => entry.responseEnd > 0
    ).length;

    const updateProgress = () => {
      const newProgress = (loadedCount / countResources) * 100;
      setProgress(newProgress);
    };

    updateProgress();

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceResourceTiming[]) {
        if (entry.name && entry.responseEnd > 0) {
          updateProgress();
        }
      }
    });

    observer.observe({ entryTypes: ["resource"] });

    return () => {
      observer.disconnect();
    };
  }, [setProgress]);

  return (
    <div className="h-screen ">
      <div className="flex flex-col items-center h-full justify-center mt-[-50px]">
        <div className="animate-bounce  font-bold dark:text-white">
          Loading...
        </div>
        <div
          ref={ref}
          className="relative w-[200px] h-[50px] cursor-pointer border-[2px] dark:border-gray-100 border-black rounded-md "
        >
          <animated.div
            className="w-full h-full absolute bg-theme_blue rounded-sm "
            style={{ width: props.progress.interpolate((p) => `${p}%`) }}
          />
          <animated.div className="absolute w-full h-full flex items-center justify-center text-white ">
            (／‵Д′)／~ ╧╧
          </animated.div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
