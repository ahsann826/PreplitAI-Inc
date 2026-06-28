import { Upload, Brain, Video, ChevronRight } from "lucide-react";

const steps = [
  {
    number: 1,
    title: "Upload Your Notes",
    description:
      "Simply upload your lecture notes, PDFs, or any study material. Our platform accepts all common document formats.",
    icon: Upload,
  },
  {
    number: 2,
    title: "AI Processing",
    description:
      "Our advanced AI analyzes your content, extracts key concepts, and structures everything into a comprehensive lecture format.",
    icon: Brain,
  },
  {
    number: 3,
    title: "Watch & Learn",
    description:
      "Enjoy a fully generated video lecture complete with AI narration, visuals, and structured explanations tailored to your material.",
    icon: Video,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#faf9f7] dark:bg-[#111] py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Three simple steps to transform your notes into lectures
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col md:flex-row items-center md:items-stretch justify-center gap-6 md:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="flex flex-col md:flex-row items-center"
              >
                {/* Card */}
                <div className="w-full max-w-sm bg-white dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  {/* Step badge */}
                  <div className="flex justify-center mb-5">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                      style={{ backgroundColor: "hsl(350,89%,45%)" }}
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-5">
                    <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between cards */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex items-center justify-center px-4">
                    <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
