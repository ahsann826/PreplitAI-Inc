import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const stats = [
  { value: "1M+", label: "Learners empowered" },
  { value: "190+", label: "Countries reached" },
  { value: "10x", label: "Faster content creation" },
  { value: "95%", label: "Avg. satisfaction" },
];

const About = () => {
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/about`;
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEOHead
        title="About PreplitAI"
        description="We're building the most realistic AI lecture platform to help teams create high‑quality video lessons."
        url={canonical}
        canonical={canonical}
      />

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
        >
          <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-4 tracking-wide uppercase">About us</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white leading-[1.1] tracking-tight mb-6">
            We're building the future
            <br />
            of AI education.
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
            PreplitAI transforms raw notes into engaging, instructor-level video lectures — instantly. We believe high-quality education should be accessible to everyone, everywhere.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-4 tracking-tight">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">
              Make high-quality education accessible to everyone by transforming raw material into
              engaging, instructor-level lectures — instantly. With AI avatars, scene composition,
              and structured scripts, anyone can create professional learning experiences without
              expensive equipment or production teams.
            </p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-4 tracking-tight">Our Story</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">
              PreplitAI began as a way to turn messy study notes into clear, engaging lectures. We
              combined state-of-the-art generative models with thoughtful UX to streamline the entire
              process — from document parsing to scene composition to video rendering. Today, we serve
              learners and educators across 190+ countries.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4 tracking-tight">Ready to get started?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-lg mx-auto">
              Join over a million learners creating AI-powered lectures from their notes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg px-6 h-11 font-medium shadow-sm transition-all hover:scale-[0.98]">
                <a href="/demo">
                  Request a demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-gray-300 dark:border-gray-700 rounded-lg px-6 h-11 font-medium text-black dark:text-white transition-all hover:scale-[0.98]">
                <a href="/">Back to home</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
