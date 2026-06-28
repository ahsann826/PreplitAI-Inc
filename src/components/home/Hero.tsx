import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  const universities = [
    "Stanford",
    "MIT",
    "Harvard",
    "Oxford",
    "Cambridge",
    "Yale",
    "Princeton",
    "Columbia",
    "Berkeley",
  ];
  // Ensure the marquee fills wide screens: two identical halves
  const halfTrack = [...universities, ...universities];
  const marqueeItems = [...halfTrack, ...halfTrack];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-white dark:bg-[#0a0a0a] overflow-hidden">

      <div className="relative z-10 w-full px-6 pt-20 pb-8">
        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-left">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight">
              <span className="text-black dark:text-white">We're building the{" "}</span>
              <br className="hidden sm:block" />
              <span className="text-black dark:text-white">future of </span>
              <span className="text-[#630000]">AI education.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-lg leading-relaxed">
              Upload your notes and watch them transform into professional video lectures with AI avatars, natural voices, and intelligent summaries.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-6">
              <Button 
                className="text-[15px] px-7 py-3 h-12 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-full font-medium transition-all duration-200 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5"
                onClick={onGetStarted}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="text-[15px] px-7 py-3 h-12 rounded-full font-medium border border-gray-300 dark:border-gray-700 bg-white text-black dark:bg-transparent dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200"
              >
                <a href="/sales">Talk to Sales</a>
              </Button>
            </div>

            {/* Trust line */}
            <p className="text-[13px] text-gray-400 dark:text-gray-500">
              Free to start · No credit card required
            </p>
          </div>

          {/* Right Column - Video/Demo Placeholder */}
          <div className="relative animate-fade-in animation-delay-400">
            <div className="aspect-video bg-black dark:bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative shadow-xl border border-gray-200 dark:border-gray-800">
              <div className="absolute inset-0 bg-[#630000]/20" />
              <div className="relative z-10 text-center px-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                </div>
                <p className="text-white text-base font-semibold">
                  Building <span className="text-[#a00000]">AI agents</span> that can speak
                </p>
              </div>
            </div>
            <div className="mt-4 text-center">
              <p className="text-base font-semibold text-black dark:text-white">Build AI Agents that speak</p>
            </div>
          </div>
        </div>

        {/* Trusted By Logos - Infinite Marquee */}
        <div className="mt-16 w-full overflow-hidden animate-fade-in animation-delay-800">
          <div className="animate-marquee flex w-max items-center gap-12 whitespace-nowrap">
            {marqueeItems.map((u, i) => (
              <div key={i} className="text-base font-semibold text-gray-600 dark:text-gray-400">{u}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
