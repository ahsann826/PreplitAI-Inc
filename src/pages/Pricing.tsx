import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = {
  free: [
    "Trial of PreplitAI",
    "Free for individual usage",
    "Basic video export",
    "Standard avatars",
    "Up to 5 minutes per lecture",
  ],
  plus: [
    "Everything in Free",
    "Unlimited collaborative blocks",
    "Unlimited file uploads",
    "Premium avatars & voices",
    "Up to 20 minutes per lecture",
    "Remove watermarks",
  ],
  business: [
    "Everything in Plus",
    "PreplitAI Agent",
    "Enterprise search",
    "Custom branding & themes Beta",
    "SAML SSO",
    "Granular database permissions",
    "Private teamspaces",
    "Priority support",
  ],
  enterprise: [
    "Everything in Business",
    "Zero data retention with LLM providers",
    "User provisioning (SCIM)",
    "Advanced security & controls",
    "Audit log",
    "Customer success manager",
    "Custom integrations & SLA",
  ],
} as const;

const faqs = [
  { question: "What happens if I exceed my plan's limits?", answer: "You'll receive a notification when you're approaching your plan limits. You can upgrade at any time to access more features and higher limits." },
  { question: "Can I switch plans at any time?", answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges." },
  { question: "What payment methods do you accept?", answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely through our payment provider." },
  { question: "Do you offer refunds?", answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund." },
  { question: "Is there a discount for annual billing?", answer: "Yes! Save up to 20% when you choose annual billing. The discount is automatically applied when you select the yearly option." },
];

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [currency] = useState("KRW");

  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/pricing`;
  
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <SEOHead
        title="Pricing for AI Lecture Generator"
        description="Simple pricing for AI video lecture creation. Start free, upgrade for more exports, avatars, and collaboration."
        url={canonical}
        canonical={canonical}
      />
      
      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6">
            Simple, transparent pricing.
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            Start for free, upgrade when you need more power. No hidden fees.
          </p>
          
          {/* Toggle */}
          <div className="inline-flex items-center p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all ${
                billingPeriod === "monthly" 
                  ? "bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm" 
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-6 py-2.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
                billingPeriod === "yearly" 
                  ? "bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm" 
                  : "text-gray-500 hover:text-black dark:hover:text-white"
              }`}
            >
              Yearly <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 font-bold uppercase tracking-wider">Save 20%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Free */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={1} className="p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 hover:border-gray-300 dark:hover:border-white/20 transition-colors flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Free</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">For individuals to organize personal projects.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold tracking-tight text-black dark:text-white">₩0</span>
              <span className="text-sm text-gray-500 dark:text-gray-400"> /mo</span>
            </div>
            <Button variant="outline" className="w-full mb-8 h-11 rounded-xl border-gray-200 dark:border-white/10 transition-all hover:scale-[0.98]">Get started free</Button>
            <div className="space-y-4 flex-1">
              {features.free.map((f) => (
                <div key={f} className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Plus */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 hover:border-gray-300 dark:hover:border-white/20 transition-colors flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Plus</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">For small teams and professionals.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold tracking-tight text-black dark:text-white">₩{billingPeriod === 'yearly' ? '12,000' : '14,000'}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400"> /mo</span>
            </div>
            <Button className="w-full mb-8 h-11 rounded-xl bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black transition-all hover:scale-[0.98]">Upgrade to Plus</Button>
            <div className="space-y-4 flex-1">
              <p className="text-[13px] font-semibold text-black dark:text-white">Everything in Free, plus:</p>
              {features.plus.map((f) => (
                <div key={f} className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Business (Popular) */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="relative p-8 rounded-3xl border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-black flex flex-col shadow-xl shadow-indigo-600/5 dark:shadow-none">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Business</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">For growing businesses and teams.</p>
            <div className="mb-6">
              <span className="text-4xl font-bold tracking-tight text-black dark:text-white">₩{billingPeriod === 'yearly' ? '25,000' : '30,000'}</span>
              <span className="text-sm text-gray-500 dark:text-gray-400"> /mo</span>
            </div>
            <Button className="w-full mb-8 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-[0.98]">Upgrade to Business</Button>
            <div className="space-y-4 flex-1">
              <p className="text-[13px] font-semibold text-black dark:text-white">Everything in Plus, plus:</p>
              {features.business.map((f) => (
                <div key={f} className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span className="flex items-center gap-2 flex-wrap">
                    {f.replace(" Beta", "")}
                    {f.includes("Beta") && <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold uppercase">Beta</span>}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Enterprise */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/50 hover:border-gray-300 dark:hover:border-white/20 transition-colors flex flex-col">
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Enterprise</h3>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">Advanced security and control for large orgs.</p>
            <div className="mb-6 h-[40px] flex items-end">
              <span className="text-3xl font-bold tracking-tight text-black dark:text-white">Custom</span>
            </div>
            <Button variant="outline" className="w-full mb-8 h-11 rounded-xl border-gray-200 dark:border-white/10 transition-all hover:scale-[0.98]">Contact Sales</Button>
            <div className="space-y-4 flex-1">
              <p className="text-[13px] font-semibold text-black dark:text-white">Everything in Business, plus:</p>
              {features.enterprise.map((f) => (
                <div key={f} className="flex gap-3 items-start text-sm text-gray-600 dark:text-gray-300">
                  <Check className="w-5 h-5 text-indigo-500 shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-24 border-t border-gray-200 dark:border-white/10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4">Frequently asked questions</h2>
          <p className="text-gray-500 dark:text-gray-400">Everything you need to know about billing and pricing.</p>
        </motion.div>
        <FAQSection />
      </section>
      
      <Footer />
    </div>
  );
};

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border-b border-gray-200 dark:border-white/10 last:border-0">
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full py-6 flex items-center justify-between text-left focus:outline-none"
          >
            <span className="text-[17px] font-medium text-black dark:text-white">{faq.question}</span>
            <div className={`ml-6 shrink-0 w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-180 bg-gray-50 dark:bg-white/5' : ''}`}>
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </div>
          </button>
          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="pb-6 text-gray-500 dark:text-gray-400 leading-relaxed pr-12">
                  {faq.answer}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export default Pricing;
