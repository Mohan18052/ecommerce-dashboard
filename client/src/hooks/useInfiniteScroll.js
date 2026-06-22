import { useEffect } from "react";

function useInfiniteScroll(
  loaderRef,
  callback
) {
  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            callback();
          }
        }
      );

    const currentRef =
      loaderRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(
          currentRef
        );
      }
    };
  }, [loaderRef, callback]);
}

export default useInfiniteScroll;