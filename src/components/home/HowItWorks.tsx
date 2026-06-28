import { ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    label: "Upload",
    headline: "Drop your notes.\nWe handle the rest.",
    image: "/step1-upload.png",
    alt: "File upload interface",
    accent: "bg-red-50",
  },
  {
    number: "02",
    label: "AI Processing",
    headline: "AI reads, understands, and structures your content.",
    image: "/step2-ai.png",
    alt: "AI processing interface",
    accent: "bg-orange-50",
  },
  {
    number: "03",
    label: "Watch & Learn",
    headline: "Your personal lecture is ready to play.",
    image: "/step3-video.png",
    alt: "Video lecture player",
    accent: "bg-rose-50",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-6 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">

        {/* Header — minimal */}
        <div className="mb-14">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-red-600 mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white max-w-lg leading-tight">
            From notes to lecture in three steps.
          </h2>
        </div>

        {/* Bento Grid — Notion style */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Card 1 — Large spanning card */}
          <div className={`relative flex flex-col min-h-[420px] rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 ${steps[0].accent} dark:bg-white/5 group cursor-pointer`}>
            <div className="p-8">
              <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-100 dark:bg-red-500/20 px-3 py-1 rounded-full mb-4">
                {steps[0].label}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white leading-snug mb-0 whitespace-pre-line">
                {steps[0].headline}
              </h3>
            </div>
            <div className="mt-auto px-8 pt-8 flex items-end">
              <img
                src={steps[0].image}
                alt={steps[0].alt}
                className="w-full rounded-t-xl shadow-lg border border-gray-200/40 dark:border-white/10 object-contain"
              />
            </div>
          </div>

          {/* Right column — stacked */}
          <div className="flex flex-col gap-5">

            {/* Card 2 */}
            <div className={`relative rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 ${steps[1].accent} dark:bg-white/5 group cursor-pointer flex-1`}>
              <div className="p-8 pb-0">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-100 dark:bg-red-500/20 px-3 py-1 rounded-full mb-4">
                  {steps[1].label}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-black dark:text-white leading-snug mb-5">
                  {steps[1].headline}
                </h3>
              </div>
              <div className="px-8">
                <img
                  src={steps[1].image}
                  alt={steps[1].alt}
                  className="w-full rounded-t-xl shadow-lg border border-gray-200/40 dark:border-white/10 object-cover"
                />
              </div>
            </div>

            {/* Card 3 */}
            <div className={`relative rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 ${steps[2].accent} dark:bg-white/5 group cursor-pointer flex-1`}>
              <div className="p-8 pb-0">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-100 dark:bg-red-500/20 px-3 py-1 rounded-full mb-4">
                  {steps[2].label}
                </span>
                <h3 className="text-xl font-bold tracking-tight text-black dark:text-white leading-snug mb-5">
                  {steps[2].headline}
                </h3>
              </div>
              <div className="px-8">
                <img
                  src={steps[2].image}
                  alt={steps[2].alt}
                  className="w-full rounded-t-xl shadow-lg border border-gray-200/40 dark:border-white/10 object-cover"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
