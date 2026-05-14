export type ReadinessStatus = "Ready" | "Almost ready" | "Needs setup" | "Not ready";

export type ReadinessFinding = {
  label: string;
  points: number;
  earned: boolean;
};

export type ReadinessAnalysis = {
  score: number;
  status: ReadinessStatus;
  findings: ReadinessFinding[];
  nextSteps: string[];
};
