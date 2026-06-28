const features = [
  {
    label: "AI Voices",
    headline: "Natural voices.\nZero recording.",
    description: "Professional AI narration that sounds human.",
    image: "/feature-voices.png",
    accent: "bg-red-50 dark:bg-red-500/5",
  },
  {
    label: "Smart Summary",
    headline: "Dense notes.\nCrisp takeaways.",
    description: "AI extracts what matters.",
    image: "/feature-summary.png",
    accent: "bg-orange-50 dark:bg-orange-500/5",
  },
];

const Features = () => {
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

        {/* 2 large cards with images */}
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((f, i) => (
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

      </div>
    </section>
  );
};

export default Features;
