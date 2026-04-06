'use client';

import type { ReactNode } from "react";
import { RelationshipProvider } from "@/components/relationship-context";

export default function Providers({ children }: { children: ReactNode }) {
  return <RelationshipProvider>{children}</RelationshipProvider>;
}