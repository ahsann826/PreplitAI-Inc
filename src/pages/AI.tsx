import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Search, MessageSquare, Languages, Code2, ShieldCheck, Database, Layers } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const features = [
  {
    icon: Bot,
    title: "Agents",
    desc: "Automate repetitive work — from drafting lecture outlines to publishing course pages and sending updates.",
    points: ["Multi-step workflows", "Triggers & schedules", "Human-in-the-loop approvals"],
  },
  {
    icon: MessageSquare,
    title: "AI Meeting Notes",
    desc: "Perfect notes with action items, decisions, and summaries for every standup, class, or review.",
    points: ["Speaker attribution", "Highlights & tasks", "Share to docs in 1 click"],
  },
  {
    icon: Search,
    title: "Enterprise Search",
    desc: "Find answers instantly across docs, videos, and knowledge bases — with citations back to the source.",
    points: ["Semantic search", "Citations", "Ask anything Q&A"],
  },
  {
    icon: Sparkles,
    title: "Voice & Avatars",
    desc: "Generate realistic lectures with multilingual voices and lifelike avatars.",
    points: ["40+ languages", "Custom voices", "Studio-quality TTS"],
  },
  {
    icon: Languages,
    title: "Translate & rewrite",
    desc: "Transform content with tone, length, and language controls right where you work.",
    points: ["Rewrite & summarize", "Translate", "Fix grammar"]
  },
  {
    icon: Code2,
    title: "Developer API",
    desc: "Bring PreplitAI into your tools with secure APIs and SDKs.",
    points: ["REST & webhooks", "OAuth & tokens", "Rate limits & audit"]
  },
];

const reasons = [
  {
    icon: Layers,
    title: "All-in-one workspace",
    desc: "Docs, search, notes, and automation natively integrated in one secure workspace.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise-ready",
    desc: "SSO, SCIM, audit logs, role-based permissions, and advanced admin analytics.",
  },
  {
    icon: Database,
    title: "Private & secure",
    desc: "Your data remains yours. State-of-the-art encryption in transit and at rest.",
  }
];

const AI = () => {
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/ai`;
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEOHead
        title="AI Workspace & Lecture Tools"
        description="All-in-one AI: notes, knowledge search, workflows, avatars, and voices for lecture creation."
        url={canonical}
        canonical={canonical}
      />
      
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-8">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[13px] font-medium text-indigo-700 dark:text-indigo-300">PreplitAI Workspace</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 tracking-tight leading-[1.1]">
              The AI workspace that
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400">works for you.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              All-in-one AI that takes notes, searches knowledge, and builds workflows — right where your team plans and learns.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg px-8 h-12 text-[15px] font-medium shadow-sm transition-all hover:scale-[0.98]">
                <a href="/pricing">Get started</a>
              </Button>
              <Button asChild variant="outline" className="border-gray-200 dark:border-white/10 rounded-lg px-8 h-12 text-[15px] font-medium bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-black dark:text-white transition-all hover:scale-[0.98]">
                <a href="/enterprise#contact">Request a demo</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div 
              key={f.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              custom={i}
              className="p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight text-black dark:text-white mb-2">{f.title}</h3>
              <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed mb-6 h-16">{f.desc}</p>
              <ul className="space-y-3">
                {f.points.map((p) => (
                  <li key={p} className="flex items-center gap-3 text-[14px] text-gray-600 dark:text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why PreplitAI */}
      <section className="border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white">Why PreplitAI?</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((r, i) => (
              <motion.div 
                key={r.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center px-4"
              >
                <div className="w-12 h-12 mx-auto rounded-xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
                  <r.icon className="w-6 h-6 text-gray-900 dark:text-white" />
                </div>
                <h4 className="text-lg font-semibold tracking-tight text-black dark:text-white mb-3">{r.title}</h4>
                <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="border-t border-gray-200 dark:border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white mb-6">Start building today.</h2>
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-8 h-12 text-[15px] font-medium transition-all hover:scale-[0.98]">
              <a href="/pricing">
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AI;