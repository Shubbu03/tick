"use client";

import { usePathname } from "next/navigation";
import LayoutWrapper from "@/components/LayoutWrapper";

export default function ClientLayoutSelector({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isLandingOrAuthPage =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  if (isLandingOrAuthPage) {
    return <>{children}</>;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
}
