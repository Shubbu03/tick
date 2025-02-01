"use client";

import type React from "react";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-950">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
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
