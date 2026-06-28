import { Mic, Video, FileText, Brain, Target, Upload } from "lucide-react";

const features = [
  {
    label: "AI Voices",
    headline: "Natural voices.\nZero recording.",
    description: "Professional AI narration that sounds human.",
    image: "/feature-voices.png",
    accent: "bg-red-50 dark:bg-red-500/5",
    icon: Mic,
    large: true,
  },
  {
    label: "Smart Summary",
    headline: "Dense notes.\nCrisp takeaways.",
    description: "AI extracts what matters.",
    image: "/feature-summary.png",
    accent: "bg-orange-50 dark:bg-orange-500/5",
    icon: FileText,
    large: true,
  },
  {
    label: "AI Avatars",
    headline: "A presenter,\ninstantly.",
    description: "Realistic AI presenters for any topic.",
    icon: Video,
    accent: "bg-rose-50 dark:bg-rose-500/5",
    large: false,
  },
  {
    label: "Deep Learning",
    headline: "Understands\nyour content.",
    description: "AI that structures ideas for optimal retention.",
    icon: Brain,
    accent: "bg-red-50 dark:bg-red-500/5",
    large: false,
  },
  {
    label: "Test Prep",
    headline: "Learn. Then\nget tested.",
    description: "Auto-generated practice questions from your notes.",
    icon: Target,
    accent: "bg-orange-50 dark:bg-orange-500/5",
    large: false,
  },
  {
    label: "Easy Upload",
    headline: "PDF, DOC,\nor plain text.",
    description: "Just drag, drop, and go.",
    icon: Upload,
    accent: "bg-rose-50 dark:bg-rose-500/5",
    large: false,
  },
];

const Features = () => {
  const largeFeatures = features.filter((f) => f.large);
  const smallFeatures = features.filter((f) => !f.large);

  return (
    <section className="py-24 px-6 bg-[#faf9f7] dark:bg-[#111]">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-14">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-red-600 mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white max-w-lg leading-tight">
            Everything you need.<br />Nothing you don't.
          </h2>
        </div>

        {/* Top Row — 2 large cards with images */}
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          {largeFeatures.map((f, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-gray-200/60 dark:border-white/10 overflow-hidden ${f.accent} group cursor-pointer`}
            >
              <div className="p-8 pb-0">
                <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-red-600 bg-red-100 dark:bg-red-500/20 px-3 py-1 rounded-full mb-4">
                  {f.label}
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-black dark:text-white whitespace-pre-line leading-tight mb-2">
                  {f.headline}
                </h3>
                <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-6">{f.description}</p>
              </div>
              {f.image && (
                <div className="px-8">
                  <img
                    src={f.image}
                    alt={f.label}
                    className="w-full rounded-t-xl shadow-md border border-gray-200/40 dark:border-white/5 object-cover"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Row — 4 compact cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {smallFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`rounded-2xl border border-gray-200/60 dark:border-white/10 p-7 ${f.accent} group cursor-pointer hover:shadow-md transition-shadow duration-300`}
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center mb-5 border border-gray-100 dark:border-white/5">
                  <Icon className="h-5 w-5 text-red-600 dark:text-red-400" strokeWidth={2} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-red-600 mb-2 block">
                  {f.label}
                </span>
                <h3 className="text-[17px] font-bold tracking-tight text-black dark:text-white whitespace-pre-line leading-tight mb-2">
                  {f.headline}
                </h3>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Features;
