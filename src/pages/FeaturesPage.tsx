import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Brain,
} from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "Create",
    items: [
      "Text to Speech with studio‑quality voices",
      "Lifelike AI Avatars for presentational lectures",
      "Smart Summarization and outline generation",
      "Multi-language support with natural accents",
    ],
  },
  {
    icon: Zap,
    title: "Study",
    items: [
      "Auto‑generated practice questions",
      "Key concepts and flashcards",
      "Progress tracking and analytics",
      "Spaced repetition algorithms",
    ],
  },
  {
    icon: Globe,
    title: "Platform",
    items: [
      "Upload PDF, DOCX, or text",
      "Export to video or share pages",
      "API & SDKs for custom workflows",
      "Integrations with LMS platforms",
    ],
  },
  {
    icon: Shield,
    title: "Security",
    items: [
      "SSO, role‑based permissions",
      "Audit log and admin analytics",
      "Encryption in transit and at rest",
      "SOC 2 Type II compliance",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

const FeaturesPage = () => {
  const siteUrl =
    (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/features`;

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="AI Lecture Generator Features"
        description="Explore features: AI avatars, TTS, smart summarization, study tools, and enterprise security for video lectures."
        url={canonical}
        canonical={canonical}
      />

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-block text-sm font-medium tracking-wide uppercase text-indigo-600 mb-6"
        >
          Features
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-950 leading-[1.1] mb-6"
        >
          Powerful features for{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
            modern learning
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Everything you need to turn notes into engaging, multilingual AI
          lectures — and share them with your team or class.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            asChild
            size="lg"
            className="px-8 h-12 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
          >
            <a href="/pricing">
              Get started
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="px-8 h-12 text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl"
          >
            <a href="/enterprise#contact">Talk to sales</a>
          </Button>
        </motion.div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ── Capabilities Bento Grid ── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mb-4">
            Built for every workflow
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
            From content creation to enterprise security, we've got you covered.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="group p-8 rounded-2xl border border-gray-200 bg-white hover:border-indigo-200 transition-colors duration-300"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-indigo-50 mb-6">
                <cap.icon className="w-5 h-5 text-indigo-600" />
              </div>

              <h3 className="text-xl font-semibold text-gray-950 mb-4">
                {cap.title}
              </h3>

              <ul className="space-y-3">
                {cap.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-[15px] text-gray-500"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#FAFAFA]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto px-6 py-24 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-950 mb-4">
            Ready to get started?
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto mb-8">
            Join thousands of educators and teams already creating with
            PreplitAI.
          </p>
          <Button
            asChild
            size="lg"
            className="px-8 h-12 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm"
          >
            <a href="/pricing">
              Start for free
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
