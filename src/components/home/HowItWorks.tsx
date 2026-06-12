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
    <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black dark:text-white">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Three simple steps to transform your notes into lectures
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                {/* Step Number */}
                <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg mb-6">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-6">
                  <step.icon className="h-8 w-8 text-black dark:text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-2xl font-bold mb-3 text-black dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
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
