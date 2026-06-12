import { Zap, BookOpen, Target, GraduationCap, Palette, LucideIcon } from "lucide-react";
import { LectureMode, LectureStyle } from "@/types/api";

export interface ModeOption {
  id: LectureMode;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface StyleOption {
  id: LectureStyle;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const modes: ModeOption[] = [
  {
    id: "summary",
    name: "Summary Mode",
    description: "Quick overview of key concepts",
    icon: Zap
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

export const styles: StyleOption[] = [
  {
    id: "professor",
    name: "AI Professor",
    description: "Virtual teacher with board",
    icon: GraduationCap
  },
  {
    id: "visual",
    name: "Visual Concepts",
    description: "Animated visual explanations",
    icon: Palette
  }
];
