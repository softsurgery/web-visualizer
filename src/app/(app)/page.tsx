"use client";

import dynamic from "next/dynamic";

const MainView = dynamic(() => import("@/components/main/MainView").then(mod => mod.MainView), {
  ssr: false,
});

export default function HomePage() {
  return <MainView />;
}
