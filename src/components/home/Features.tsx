import { Mic, Video, FileText, Brain, Target, Upload } from "lucide-react";

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
    <section className="py-24 px-6 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-black dark:text-white">
            Everything you need to learn better
          </h2>
          <p className="text-[15px] text-gray-500 dark:text-gray-400">
            Powerful AI features designed to transform your notes into engaging lectures
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white dark:bg-black hover:shadow-md transition-shadow duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-center justify-center mb-6">
                <feature.icon className="h-5 w-5 text-black dark:text-white" strokeWidth={2} />
              </div>
              <h3 className="text-[16px] font-bold mb-3 tracking-tight text-black dark:text-white">
                {feature.title}
              </h3>
              <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
