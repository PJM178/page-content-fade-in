"use client"

import { Suspense, useEffect, useRef, useState } from "react";
import styles from "./PageWrapper.module.css";
import usePageContentFadeIn from "@/hooks/usePageContentFadeIn";
import Link from "next/link";

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper = (props: ContentWrapperProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  usePageContentFadeIn({ observeNewElements: true, containerRef: contentRef, selector: "p, #article", options: { root: null, threshold: 0 } });
  console.log(contentRef.current);

  // useEffect(() => {
  //   setInterval(() => {
  //     const element = document.createElement("div");
  //     element.textContent = "Inserted manually";
  //     element.style.padding = "4px";
  //     element.style.background = "#eee";
  //     element.style.marginTop = "10px";
  //     element.id = "article";

  //     const innerElement = document.createElement("p");
  //     innerElement.textContent = "Inserted manually";
  //     innerElement.style.padding = "4px";
  //     innerElement.style.background = "#e31111ff";
  //     innerElement.style.marginTop = "10px";

  //     element.appendChild(innerElement);

  //     contentRef.current?.appendChild(element);
  //   }, 2000);
  // }, []);

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
  const [displayContent, setDisplayContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setDisplayContent(true);
    }, 2000);
  }, []);

  return (
    <div className={styles["lorem-container"]}>
      <div ref={contentRef}>
        <Link href={"/"}>
          HOME
        </Link>
        <Suspense fallback={<div>Loading content...</div>}>
        <ContentWrapper>
          {displayContent && props.children}
        </ContentWrapper>
        </Suspense>
      </div>
    </div>
  );
};

export default PageWrapper;