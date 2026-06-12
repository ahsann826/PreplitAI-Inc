import { Mic, Video, FileText, Brain, Target, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Mic,
    title: "Text to Speech",
    description: "Professional AI voices that bring your lecture scripts to life with natural intonation."
  },
  {
    icon: Video,
    title: "AI Avatars",
    description: "Realistic AI presenters that deliver your content with engaging visual presence."
  },
  {
    icon: FileText,
    title: "Smart Summarization",
    description: "Automatically extract key concepts and create concise, focused lecture content."
  },
  {
    icon: Brain,
    title: "Deep Learning",
    description: "Advanced AI understands your content and structures it for optimal learning."
  },
  {
    icon: Target,
    title: "Test Preparation",
    description: "Generate practice questions and study materials tailored to your notes."
  },
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Support for PDF, Word, and text files - get started in seconds."
  }
];

export const Features = () => {
  return (
    <section className="py-20 px-6 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black dark:text-white">
            Everything you need to learn better
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful AI features designed to transform your notes into engaging lectures
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-black dark:text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
