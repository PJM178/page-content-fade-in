"use client"

import { Suspense, useEffect, useRef, useState } from "react";
import styles from "./PageWrapper.module.css";
import usePageContentFadeIn from "@/hooks/usePageContentFadeIn";

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper = (props: ContentWrapperProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentElements, setContentElements] = useState<Element[]>([]);
  const { elements } = usePageContentFadeIn({ elements: contentElements, options: { root: null, threshold: 0 } });
  useEffect(() => {
    console.log("Content rendered");
    console.log(contentRef.current);
    if (contentRef.current) {
      setContentElements(Array.from(contentRef.current.querySelectorAll("p")));
    }
  }, []);
  console.log(contentElements);
  console.log(elements);
  return (
    <div className={styles["content-container"]} ref={contentRef}>
      {props.children}
    </div>
  );
};

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = (props: PageWrapperProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentChildrenRef = useRef<Element[]>(null);

  // useEffect(() => {
  //   if (!contentRef.current) return;
  //   console.log(contentRef.current);
  //   const observer = new MutationObserver(() => {
  //     console.log("Server content rendered!");

  //     if (contentRef.current) {
  //       contentChildrenRef.current = Array.from(contentRef.current.querySelectorAll("p"));
  //       console.log(contentChildrenRef.current);
  //     }

  //     observer.disconnect(); // Stop observing
  //   });

  //   observer.observe(contentRef.current, { childList: true, subtree: true });

  //   return () => observer.disconnect();
  // }, []);

  return (
    <div className={styles["lorem-container"]}>
      <div ref={contentRef}>
        <Suspense fallback={<div>Loading...</div>}>
          <ContentWrapper>
            {props.children}
          </ContentWrapper>
        </Suspense>
      </div>
    </div>
  );
};

export default PageWrapper;