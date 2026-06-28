import { LectureMode } from "@/types/api";

export interface ModeOption {
  id: LectureMode;
  name: string;
  description: string;
}

export const modes: ModeOption[] = [
  {
    id: "summary",
    name: "Summary Mode",
    description: "Quick overview of key concepts"
  },
  {
    id: "detailed",
    name: "Detailed Mode",
    description: "In-depth explanations"
  },
  {
    id: "test",
    name: "Test Prep Mode",
    description: "Practice questions & solutions"
  }
];
