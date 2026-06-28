import { Upload, Brain, Video } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Notes",
    description: "Simply upload your study materials - PDFs, documents, or text files."
  },
  {
    icon: Brain,
    title: "AI Processing",
    description: "Our advanced AI analyzes your content and creates a structured lecture script."
  },
  {
    icon: Video,
    title: "Watch & Learn",
    description: "Get personalized video lectures with AI avatars or visual explanations."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-gray-50/50 dark:bg-black border-y border-gray-100 dark:border-white/10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-black dark:text-white">
            How It Works
          </h2>
          <p className="text-[15px] text-gray-500 dark:text-gray-400">
            Three simple steps to transform your notes into lectures
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-x-12 gap-y-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-[13px] mb-8 shadow-sm">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gray-100/80 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 flex items-center justify-center mb-6 shadow-sm">
                  <step.icon className="h-6 w-6 text-black dark:text-white" strokeWidth={2} />
                </div>
                
                {/* Content */}
                <h3 className="text-[17px] font-bold mb-3 tracking-tight text-black dark:text-white">
                  {step.title}
                </h3>
                <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[260px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
