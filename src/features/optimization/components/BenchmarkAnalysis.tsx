"use client";

import { YStack } from "tamagui";
import { BenchmarkTable } from "@/features/optimization/components/BenchmarkTable";
import { BenchmarkComparisonChart } from "@/features/optimization/components/BenchmarkComparisonChart";
import type { BenchmarkEntry } from "@/lib/api/types";

export function BenchmarkAnalysis({ entries }: { entries: BenchmarkEntry[] }) {
  return(
    <YStack gap="$4">
      <BenchmarkTable entries={entries} />
      <BenchmarkComparisonChart entries={entries} />
    </YStack>
  );
}