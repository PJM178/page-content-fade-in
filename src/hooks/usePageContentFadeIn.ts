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
        if (entry.isIntersecting) {
          console.log(entry.target, "element intersecting");
          entry.target.classList.add("content-visible");
          observer.unobserve(entry.target);
        }
      })
    }, { ...options });

    elements.forEach((e) => observer.observe(e));
  }, [elements, options]);

  return { elements };
};

export default usePageContentFadeIn;