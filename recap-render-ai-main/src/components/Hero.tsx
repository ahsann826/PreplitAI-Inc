import { Button } from "@/components/ui/button";

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
    <section className="relative min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 overflow-x-hidden">
      {/* Content */}
      <div className="relative z-10 w-full px-6 py-8">
        {/* Main Content Grid */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center mt-6">
          {/* Left Column - Text Content */}
          <div className="text-left animate-fade-in">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
              <span className="text-black dark:text-white">The most realistic </span>
              <span className="text-black dark:text-white">AI lecture </span>
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">platform</span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 max-w-xl animate-fade-in animation-delay-200">
Over 1,000,000 students use PreplitAI to create realistic lecture experiences.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-4 animate-fade-in animation-delay-400">
              <Button 
                className="text-sm px-5 py-4 sm:px-6 sm:py-5 h-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black rounded-md font-semibold transition-all duration-200 uppercase"
                onClick={onGetStarted}
              >
                Get Started Free
              </Button>
              
              <Button 
                asChild
                variant="outline"
                className="text-sm px-5 py-4 sm:px-6 sm:py-5 h-auto rounded-md font-semibold border-2 border-gray-300 dark:border-gray-700 bg-white text-black dark:bg-gray-950 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 transition-all duration-200 uppercase"
              >
                <a href="/sales">Talk to Sales</a>
              </Button>
            </div>

            {/* Subtitle */}
            <p className="text-xs text-gray-500 dark:text-gray-500 italic animate-fade-in animation-delay-600">
              No credit card required • Cancel anytime
            </p>
          </div>

          {/* Right Column - Video/Demo Placeholder */}
          <div className="relative animate-fade-in animation-delay-400">
            <div className="aspect-video bg-black dark:bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
              <div className="relative z-10 text-center px-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                </div>
                <p className="text-white text-base font-semibold">
                  Building <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI agents</span> that can speak
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

        {/* Bottom CTA */}
        <div className="max-w-7xl mx-auto mt-12 text-center animate-fade-in animation-delay-1000">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
            Not ready? Learn more
          </p>
        </div>
      </div>

    </section>
  );
};
