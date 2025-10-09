import { useEffect, useRef } from "react";

interface UsePageContentFadeIn {
  containerRef: React.RefObject<HTMLElement | null>;
  selector: string;
  options: {
    root: Element | Document | null | undefined;
    rootMargin?: string;
    scrollMargin?: string;
    threshold?: number;
  };
  observeNewElements?: boolean;
}

// TODO: add class param to control the effect, base to make sure there are transitions and whatnot present, which would be content-invisible now,
// and the desired transition which is content-visible currently
/**
 * Hook to observe defined elements of the container and add or remove class based on the observed state. Only watches parent nodes.
 *
 * @param containerRef React ref of the element which contains the elements that are to be observed
 * @param selector Which elements are going to be observed, for example "p, div"
 * @param options Options for the Intersection Observer
 * @param observeNewElements Optionally attach mutation observer to watch container for new added elements - defaults to true
 */

const usePageContentFadeIn = ({ containerRef, selector, options, observeNewElements }: UsePageContentFadeIn) => {
  const mutationObserverRef = useRef<MutationObserver>(null);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const intersectionObserver = new IntersectionObserver((entries, observer) => {
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

    const observeElements = (elements: Element[]) => {
      elements.forEach((el) => {
          el.classList.add("content-invisible");
          intersectionObserver.observe(el);
      });
    };

    const initializeObservation = () => {
      const elements = Array.from(container.querySelectorAll(selector));
      
      if (elements.length > 0) {
        observeElements(elements);
        initializedRef.current = true;
      }
    };

    // Initial attempt
    initializeObservation();

    // If the initial attempt fails, set up temporary Mutation Observer - this is to keep subsequent observations
    // optional
    if (!observeNewElements && !initializedRef.current) {
      const tempMutationObserver = new MutationObserver((_, observer) => {
        const hasElements = Array.from(container.querySelectorAll(selector)).length > 0;

        if (hasElements) {
          initializeObservation();
          observer.disconnect();
          mutationObserverRef.current = null;
        }
      });

      tempMutationObserver.observe(container, { childList: true, subtree: true });
      mutationObserverRef.current = tempMutationObserver;
    }

    if (observeNewElements) {
      const persistentObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          const added = Array.from(mutation.addedNodes).filter(
            (n) => n.nodeType === Node.ELEMENT_NODE
          ) as Element[];

          added.forEach((el) => {
            const selectors = selector.split(",").map((s) => s.trim().toLowerCase());
            const nodeName = el.nodeName.toLowerCase();

            const isTagMatch = selectors.includes(nodeName);
            const isCssMatch = selectors.some((sel) => el.matches(sel));

            if (isTagMatch || isCssMatch) {
              el.classList.add("content-invisible");
              intersectionObserver.observe(el);
            }
          });
        });
      });

      persistentObserver.observe(container, { childList: true, subtree: true });
      mutationObserverRef.current = persistentObserver;
    }

    return () => {
      intersectionObserver.disconnect()
      mutationObserverRef.current?.disconnect();
    };
  }, [containerRef, selector, options, observeNewElements]);
};

export default usePageContentFadeIn;