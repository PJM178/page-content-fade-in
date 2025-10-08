import { useEffect } from "react";

interface UsePageContentFadeIn {
  elements: Element[];
  options: {
    root: Element | Document | null | undefined;
    rootMargin?: string,
    scrollMargin?: string,
    threshold?: number,
  };
}

const usePageContentFadeIn = ({ elements, options }: UsePageContentFadeIn) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        const isElementAboveViewport = entry.boundingClientRect.top < 0;

        if (isElementAboveViewport) {
          entry.target.classList.remove("content-invisible");
          observer.unobserve(entry.target);

          return;
        }

        if (entry.isIntersecting) {
          console.log("Element intersecting: ", entry.target);
          entry.target.classList.add("content-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { ...options });

    elements.forEach((e) => {
      e.classList.add("content-invisible");    
      observer.observe(e);
    });

    return () => observer.disconnect();
  }, [elements, options]);

  return { elements };
};

export default usePageContentFadeIn;