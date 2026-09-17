"use client";

import { Paragraph, Spinner, Text, XStack, YStack } from "tamagui";
import { StyledButton } from "@/components/ui/primitives/StyledButton";
import { BenchmarkAnalysis } from "@/features/optimization/components/BenchmarkAnalysis";
import { ProblemJsonEditor } from "@/features/optimization/components/ProblemJsonEditor";
import { RouteResultCanvas } from "@/features/optimization/route-planner/components/RouteResultCanvas";
import { useRoutePlanner } from "@/features/optimization/route-planner/hooks/useRoutePlanner";
import { ROUTE_SAMPLES } from "@/features/optimization/route-planner/sample-problems";
import { usePendingProblemHydration } from "@/features/optimization/hooks/usePendingProblemHydration";
import { AlgorithmRecommendationCard } from "@/features/optimization/components/AlgorithmRecommendationCard";
import { ExplanationCard } from "@/features/optimization/components/ExplanationCard";


/**
 * Route Planner 画面の中核。問題を編集 → 「解く」で経路を可視化、「全アルゴリズム比較」で
 * Dijkstra / Bellman-Ford / A* / networkx を横並び実測する。ページは SSG のまま。
 */
export function RoutePlannerPanel() {
  const rp = useRoutePlanner();
  usePendingProblemHydration("route_planning", rp.setProblem);
  const data = rp.problem.problem_type === "route_planning" ? rp.problem.data : null;

  return (
    <YStack gap="$4" padding="$4" maxWidth={960}>
      <YStack gap="$1">
        <Text fontSize="$6" fontWeight="700">
          Route Planner
        </Text>
        <Paragraph color="$color11">
          start から goal までの最短経路。負辺があれば Bellman-Ford、全ノードに座標があれば A*、
          それ以外は Dijkstra が自動で選ばれます(rule-based selection)。
        </Paragraph>
      </YStack>

      <ProblemJsonEditor value={rp.problem} samples={ROUTE_SAMPLES} onChange={rp.setProblem} />
      <AlgorithmRecommendationCard problem={rp.problem} />
      <ExplanationCard problem={rp.problem} />

      <XStack gap="$2">
        <StyledButton
          theme="blue"
          disabled={rp.solveStatus === "loading"}
          onPress={() => void rp.solve()}
        >
          {rp.solveStatus === "loading" ? <Spinner /> : "解く(自動選択)"}
        </StyledButton>
        <StyledButton disabled={rp.compareStatus === "loading"} onPress={() => void rp.compare()}>
          {rp.compareStatus === "loading" ? <Spinner /> : "全アルゴリズム比較"}
        </StyledButton>
      </XStack>

      {rp.error ? <Text color="$red10">{rp.error}</Text> : null}

      {data && rp.solution ? <RouteResultCanvas data={data} solution={rp.solution} /> : null}

      {rp.comparison ?
        <BenchmarkAnalysis entries={rp.comparison.entries} />
        : null}
    </YStack>
  );
}
