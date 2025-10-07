"use client"

import { Suspense, useEffect, useRef } from "react";
import styles from "./PageWrapper.module.css";

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper = (props: PageWrapperProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const contentChildrenRef = useRef<Element[]>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentChildrenRef.current = Array.from(contentRef.current.children);
    }

    console.log(contentChildrenRef.current);
  }, []);

  return (
    <div ref={contentRef} className={styles["lorem-container"]}>
      <Suspense fallback={<div>Loading...</div>}>
        {props.children}
      </Suspense>
    </div>
  );
};

export default PageWrapper;