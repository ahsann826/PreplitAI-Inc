import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion } from "framer-motion";
import { CheckCircle2, Building2, Lock, Sparkles, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const bullets = {
  knowledge: [
    "Centralized docs, pages, and lecture assets",
    "Structured hubs for teams, projects, and policies",
    "Granular permissions and approval workflows",
  ],
  search: [
    "Enterprise search across notes, videos, and knowledge bases",
    "AI-answers with citations back to your content",
    "Instant Q&A about meetings and lectures",
  ],
  ai: [
    "PreplitAI Agents to automate recurring work",
    "AI Meeting Notes with action items and summaries",
    "Multilingual voice, avatars, and realistic TTS",
  ],
  security: [
    "SAML SSO (Okta, Azure AD, Google)",
    "SCIM user provisioning and deprovisioning",
    "Audit log and admin analytics",
    "Encryption in transit and at rest",
  ],
};

const showcase = [
  {
    key: 'flexible',
    eyebrow: 'Customizable',
    title: 'Flexible AI workflows that grow with you.',
    copy: 'Adapt the platform to your team\'s needs with templates, roles, and modular AI tools—from document parsing to avatar lectures.',
    bullets: [
      'Reusable templates for lessons, SOPs, and reports',
      'Connect upload → script → video in one flow',
      'Brand-safe themes, fonts, and voice presets',
    ],
    img: '/assets/enterprise/flexible.svg', // Assumes these SVGs exist or will be replaced gracefully
  },
  {
    key: 'connected',
    eyebrow: 'Connected',
    title: 'Every team on the same page, always.',
    copy: 'Keep product, ops, and training aligned in an AI-searchable workspace with permissions for every audience.',
    bullets: [
      'Search across docs, videos, and transcripts',
      'Citations link answers back to trusted sources',
      'Workspaces for departments, programs, and clients',
    ],
    img: '/assets/enterprise/projects.svg',
  },
  {
    key: 'ship-faster',
    eyebrow: 'Ship faster',
    title: 'Simplify your content development.',
    copy: 'Streamline the entire pipeline—ingest, summarize, generate scenes, and publish—so teams can deliver training faster.',
    bullets: [
      'Parallel scene generation and video rendering',
      'Versioned outputs with downloadable SRTs',
      'Admin analytics to track content velocity',
    ],
    img: '/assets/enterprise/product-dev.svg',
  },
] as const;

const Enterprise = () => {
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/enterprise`;
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEOHead
        title="PreplitAI for Enterprise"
        description="Secure AI workspace for knowledge, search, agents, and realistic lecture generation."
        url={canonical}
        canonical={canonical}
      />
      
      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#630000]/8 dark:bg-[#630000]/20 border border-[#630000]/20 dark:border-[#630000]/30 mb-8">
              <Building2 className="w-4 h-4 text-[#630000] dark:text-[#ff9999]" />
              <span className="text-[13px] font-medium text-[#630000] dark:text-[#ffaaaa]">PreplitAI for Enterprise</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 tracking-tight leading-[1.1]">
              Knowledge and work.
              <br />
              <span className="text-[#630000] dark:text-[#ff9999]">Connected.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              One secure AI workspace where enterprise teams plan, collaborate, and build realistic lecture content faster together.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg px-8 h-12 text-[15px] font-medium shadow-sm transition-all hover:scale-[0.98]">
                <a href="#contact">Request a demo</a>
              </Button>
              <Button asChild variant="outline" className="border-gray-200 dark:border-white/10 rounded-lg px-8 h-12 text-[15px] font-medium bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-black dark:text-white transition-all hover:scale-[0.98]">
                <a href="/pricing">View pricing</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value blocks */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-6 pb-24">
        {[
          { title: "Company knowledge", icon: Building2, desc: "One home that's organized, searchable, and accurate.", items: bullets.knowledge },
          { title: "Enterprise search", icon: Users, desc: "Instantly surface answers across PreplitAI with citations.", items: bullets.search },
          { title: "AI for every team", icon: Sparkles, desc: "Automate manual tasks and accelerate content creation.", items: bullets.ai },
          { title: "Security & admin", icon: Lock, desc: "Enterprise-grade controls to keep data safe and compliant.", items: bullets.security },
        ].map((block, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            custom={i}
            className="p-8 md:p-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black hover:border-[#630000]/30 dark:hover:border-[#630000]/40 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#630000]/8 dark:bg-[#630000]/20 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <block.icon className="w-6 h-6 text-[#630000] dark:text-[#ff9999]" />
            </div>
            <h2 className="text-xl font-bold text-black dark:text-white tracking-tight mb-2">{block.title}</h2>
            <p className="text-[15px] text-gray-500 dark:text-gray-400 mb-6">{block.desc}</p>
            <ul className="space-y-3">
              {block.items.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-[#630000] dark:text-[#ff9999] mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>

      {/* Showcase */}
      <section className="border-t border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-32 space-y-32">
          {showcase.map((s, idx) => (
            <motion.div 
              key={s.key}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              custom={0}
              className="grid md:grid-cols-2 gap-16 md:gap-24 items-center"
            >
              <div className={idx % 2 === 1 ? 'md:order-2' : ''}>
                <div className="aspect-[4/3] rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black shadow-sm overflow-hidden flex items-center justify-center p-8">
                  {/* Fallback styling for images if they don't load */}
                  <img
                    src={s.img}
                    alt={`${s.eyebrow} — ${s.title}`}
                    className="w-full h-full object-contain opacity-90 dark:invert"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = '<div class="text-gray-400 dark:text-gray-600 font-medium">Illustration Placeholder</div>';
                    }}
                  />
                </div>
              </div>
              <div className={idx % 2 === 1 ? 'md:order-1' : ''}>
                <p className="text-[13px] font-semibold text-[#630000] dark:text-[#ff9999] uppercase tracking-wider mb-3">{s.eyebrow}</p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white mb-4 leading-tight">{s.title}</h2>
                <p className="text-[17px] text-gray-500 dark:text-gray-400 leading-relaxed mb-8">{s.copy}</p>
                <ul className="space-y-4">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-[15px] text-gray-600 dark:text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-[#630000] dark:text-[#ff9999] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="border-t border-gray-200 dark:border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-32 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white mb-4">Request a demo</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-xl mx-auto">Tell us your work email and our enterprise team will get in touch within 1 business day.</p>
            
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input 
                type="email" 
                placeholder="name@company.com" 
                className="h-12 flex-1 rounded-lg bg-white dark:bg-black border-gray-200 dark:border-white/10 focus-visible:ring-[#630000] text-[15px]"
                required 
              />
              <Button type="submit" className="h-12 px-8 rounded-lg bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black font-medium transition-all hover:scale-[0.98]">
                Submit
              </Button>
            </form>
            <p className="mt-4 text-[13px] text-gray-400">By submitting, you agree to be contacted about PreplitAI Enterprise.</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Enterprise;