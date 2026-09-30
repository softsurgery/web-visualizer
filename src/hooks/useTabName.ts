import { useEffect, useRef } from "react";

export function useTabName(title: string) {
  const expectedTitleRef = useRef(title);

  useEffect(() => {
    const expectedTitle = title === "Web Visualizer" || title.endsWith(" - Web Visualizer") 
      ? title 
      : `${title} - Web Visualizer`;
      
    expectedTitleRef.current = expectedTitle;

    const enforceTitle = () => {
      if (document.title !== expectedTitleRef.current) {
        document.title = expectedTitleRef.current;
      }
    };

    enforceTitle();

    // Observe head for any changes that might reset the title
    const observer = new MutationObserver(enforceTitle);
    const head = document.querySelector("head");
    if (head) {
      observer.observe(head, { childList: true, subtree: true, characterData: true });
    }

    // Fallback interval to aggressively prevent Next.js from overwriting it during complex transitions
    const intervalId = setInterval(enforceTitle, 500);

    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, [title]);
}
