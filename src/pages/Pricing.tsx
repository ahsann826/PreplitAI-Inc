import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

const features = {
  free: [
    "Trial of Notion AI",
    "Free for individual usage",
    "Basic forms",
    "Basic sites",
    "Notion Calendar",
    "Notion Mail (Syncs with Gmail)",
    "Databases including subtasks, dependencies, custom properties and more",
  ],
  plus: [
    "Everything in Free",
    "Trial of Notion AI",
    "Unlimited collaborative blocks",
    "Unlimited file uploads",
    "Unlimited charts",
    "Custom forms",
    "Custom sites",
    "Basic integrations",
  ],
  business: [
    "Everything in Plus",
    "Agent",
    "Enterprise search",
    "AI meeting notes Beta",
    "Research mode Beta",
    "SAML SSO",
    "Granular database permissions",
    "Verify any page",
    "Private teamspaces",
    "Conditional forms logic",
    "Domain verification",
    "Premium integrations",
  ],
  enterprise: [
    "Everything in Business",
    "Agent",
    "Enterprise search",
    "AI meeting notes Beta",
    "Research mode Beta",
    "Zero data retention with LLM providers",
    "User provisioning (SCIM)",
    "Advanced security & controls",
    "Audit log",
    "Customer success manager",
    "Security & Compliance integrations (DLP, SIEM)",
    "Domain management",
    "Advanced integrations",
  ],
} as const;

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const [currency] = useState("KRW");

  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/pricing`;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "PreplitAI Credits",
    description: "Credits for generating AI video lectures",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "KRW",
      lowPrice: "0",
      highPrice: "30000",
      offerCount: "4",
      availability: "https://schema.org/InStock"
    },
    brand: { "@type": "Brand", name: "PreplitAI" }
  };
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SEOHead
        title="Pricing for AI Lecture Generator"
        description="Simple pricing for AI video lecture creation. Start free, upgrade for more exports, avatars, and collaboration."
        url={canonical}
        canonical={canonical}
        schemaMarkup={productSchema}
      />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Company Logos */}
        <div className="flex items-center justify-center gap-6 mb-8 flex-wrap">
          <span className="text-lg font-bold">OpenAI</span>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">F</span>
            </div>
            <span className="text-base font-semibold">Figma</span>
          </div>
          <span className="text-lg font-bold tracking-wider">VOLVO</span>
          <span className="text-lg font-bold">ramp ⚡</span>
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
              <path d="M2 17L12 22L22 17L12 12L2 17Z"/>
            </svg>
            <span className="text-base font-bold">CURSOR</span>
          </div>
        </div>

        {/* Toggle and Currency */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                billingPeriod === "monthly" 
                  ? "bg-gray-900 text-white dark:bg-white dark:text-black" 
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Pay monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                billingPeriod === "yearly" 
                  ? "bg-gray-900 text-white dark:bg-white dark:text-black" 
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              }`}
            >
              Pay yearly
            </button>
            <a href="#" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
              Save up to 20% with yearly
            </a>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">Price in</span>
            <select className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <option value="KRW">KRW</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Free */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Free</h3>
            <div className="mb-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₩0</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">per member / month</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 min-h-[32px]">
              For individuals to organize personal projects and life.
            </p>
            <Button variant="outline" className="w-full mb-4 text-xs py-1.5">Sign up</Button>
            <ul className="space-y-2 text-xs">
              {features.free.map((f) => (
                <li key={f} className="flex gap-1.5 text-gray-700 dark:text-gray-300">
                  <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Plus */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Plus</h3>
            <div className="mb-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₩14,000</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">per member / month</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 min-h-[32px]">
              For small teams and professionals to work together.
            </p>
            <Button className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5">Get started</Button>
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">Everything in Free</p>
            </div>
            <ul className="space-y-2 text-xs">
              {features.plus.map((f) => (
                <li key={f} className="flex gap-1.5 text-gray-700 dark:text-gray-300">
                  <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business - Recommended */}
          <div className="rounded-lg border-2 border-blue-600 p-4 bg-white dark:bg-gray-900 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Business</h3>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-600 text-white rounded">Recommended</span>
            </div>
            <div className="mb-1">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">₩30,000</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">per member / month</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 min-h-[32px]">
              For growing businesses to streamline teamwork.
            </p>
            <Button className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5">Get started</Button>
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">Everything in Plus</p>
            </div>
            <ul className="space-y-2 text-xs">
              {features.business.map((f) => {
                const isBeta = f.includes("Beta");
                const text = f.replace(" Beta", "");
                return (
                  <li key={f} className="flex gap-1.5 text-gray-700 dark:text-gray-300">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                    <span className="flex items-center gap-1.5 flex-wrap">
                      {text}
                      {isBeta && (
                        <span className="px-1 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">Beta</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Enterprise */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Enterprise</h3>
            <div className="mb-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Custom pricing</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">&nbsp;</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 min-h-[32px]">
              For organizations to operate with scalability, control, and security.
            </p>
            <Button variant="outline" className="w-full mb-4 text-xs py-1.5">Contact Sales</Button>
            <div className="mb-3">
              <p className="text-xs font-medium text-gray-900 dark:text-white mb-2">Everything in Business</p>
            </div>
            <ul className="space-y-2 text-xs">
              {features.enterprise.map((f) => {
                const isBeta = f.includes("Beta");
                const text = f.replace(" Beta", "");
                return (
                  <li key={f} className="flex gap-1.5 text-gray-700 dark:text-gray-300">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" />
                    <span className="flex items-center gap-1.5 flex-wrap">
                      {text}
                      {isBeta && (
                        <span className="px-1 py-0.5 text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">Beta</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Q&A Section */}
        <section className="mt-16 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Frequently asked questions</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Everything you need to know about our pricing</p>
          </div>
          <FAQSection />
        </section>
      </div>
      <Footer />
    </div>
  );
};

const faqs = [
  {
    question: "What happens if I exceed my plan's limits?",
    answer: "You'll receive a notification when you're approaching your plan limits. You can upgrade at any time to access more features and higher limits."
  },
  {
    question: "Can I switch plans at any time?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely through our payment provider."
  },
  {
    question: "Do you offer refunds?",
    answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund."
  },
  {
    question: "Is there a discount for annual billing?",
    answer: "Yes! Save up to 20% when you choose annual billing. The discount is automatically applied when you select the yearly option."
  },
  {
    question: "What's included in the free plan?",
    answer: "Our free plan includes access to core features, basic forms and sites, calendar integration, and limited database functionality - perfect for individual users."
  },
  {
    question: "How does Enterprise pricing work?",
    answer: "Enterprise pricing is customized based on your organization's needs, including team size, required features, and support level. Contact our sales team for a personalized quote."
  },
  {
    question: "Can I add more team members later?",
    answer: "Absolutely! You can add or remove team members at any time. Billing is adjusted automatically based on your active members."
  }
];

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-medium text-gray-900 dark:text-white pr-8">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div className="px-5 pb-4 pt-0">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
