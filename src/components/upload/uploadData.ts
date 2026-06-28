import { Sparkles, BookOpen, Target, LucideIcon } from "lucide-react";
import { LectureMode } from "@/types/api";

export interface ModeOption {
  id: LectureMode;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const modes: ModeOption[] = [
  {
    id: "summary",
    name: "Summary Mode",
    description: "Quick overview of key concepts",
    icon: Sparkles
  },
  {
    id: "detailed",
    name: "Detailed Mode",
    description: "In-depth explanations",
    icon: BookOpen
  },
  {
    id: "test",
    name: "Test Prep Mode",
    description: "Practice questions & solutions",
    icon: Target
  }
];
