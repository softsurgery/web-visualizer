"use client";
import { useEffect, useState } from "react";

export function useRTL() {
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    const dir = window.document.documentElement.dir;
    setIsRTL(dir === "rtl");
  }, []);

  return { isRTL };
}
