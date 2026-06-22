import { useEffect } from "react";

function useIntersectionObserver(
  ref,
  callback
) {
  useEffect(() => {
    const observer =
      new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting
          ) {
            callback();
          }
        }
      );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(
          ref.current
        );
      }
    };
  }, [ref, callback]);
}

export default useIntersectionObserver;