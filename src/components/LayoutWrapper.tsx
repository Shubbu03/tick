"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
      {!isMobile && (
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      )}
      <div
        className={`flex-1 ${
          isCollapsed ? "pl-16" : "pl-60"
        } transition-all duration-300 ease-in-out`}
      >
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
