import { Mic, Video, FileText, Brain, Target, Upload } from "lucide-react";

const topFeatures = [
  {
    title: "Text to Speech",
    description:
      "Convert your written notes into natural-sounding audio lectures with advanced AI voice synthesis. Choose from multiple voices and languages to match your learning style.",
    icon: Mic,
  },
  {
    title: "AI Avatars",
    description:
      "Bring your lectures to life with realistic AI-generated presenters that deliver your content with natural expressions, gestures, and professional delivery.",
    icon: Video,
  },
];

const bottomFeatures = [
  {
    title: "Smart Summarization",
    description:
      "Instantly distill lengthy documents into clear, concise summaries that capture every key concept.",
    icon: FileText,
  },
  {
    title: "Deep Learning",
    description:
      "AI-powered analysis that understands context, identifies patterns, and creates structured learning paths.",
    icon: Brain,
  },
  {
    title: "Test Preparation",
    description:
      "Auto-generate quizzes, flashcards, and practice tests from your study material for effective revision.",
    icon: Target,
  },
  {
    title: "Easy Upload",
    description:
      "Drag and drop any document format — PDFs, slides, text files — and start generating lectures in seconds.",
    icon: Upload,
  },
];

function FeatureCard({
  title,
  description,
  icon: Icon,
  large,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  large?: boolean;
}) {
  return (
    <div
      className={`bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        large ? "p-10" : "p-7"
      }`}
    >
      {/* Icon */}
      <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>

      {/* Text */}
      <h3
        className={`font-semibold text-gray-900 dark:text-white mb-2 ${
          large ? "text-xl" : "text-base"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-gray-500 dark:text-gray-400 leading-relaxed ${
          large ? "text-base" : "text-sm"
        }`}
      >
        {description}
      </p>
    </div>
  );
}

export default function Features() {
  return (
    <section className="bg-white dark:bg-black py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            Powerful features for modern learning
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to transform your notes into engaging
            AI-powered lectures
          </p>
        </div>

        {/* Top row — 2 large cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          {topFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} large />
          ))}
        </div>

        {/* Bottom row — 4 compact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bottomFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
