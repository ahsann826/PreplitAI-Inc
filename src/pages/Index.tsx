import { Hero } from "@/components/home/Hero";
import Features from "@/components/home/Features";
import HowItWorks from "@/components/home/HowItWorks";
import { UploadSection } from "@/components/upload/UploadSection";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/`;
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "PreplitAI",
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
      sameAs: [
        "https://twitter.com/yourhandle",
        "https://www.linkedin.com/company/yourcompany"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "PreplitAI",
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      description: "AI video lecture generator that converts notes to videos.",
      url: siteUrl
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How do I convert notes to a video?",
          acceptedAnswer: { "@type": "Answer", text: "Upload your notes, choose options, and generate a lecture in minutes." }
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] overflow-x-hidden">
      <SEOHead
        title="AI-Powered Video Lecture Generator"
        description="Convert notes into engaging AI video lectures with avatars, TTS, and automatic slides. Start free."
        keywords={["AI video lecture generator","notes to video converter","automated lecture creator","text to video lecture"]}
        url={canonical}
        canonical={canonical}
        schemaMarkup={schema}
      />
      <Hero onGetStarted={scrollToUpload} />
      <HowItWorks />
      <Features />
      <UploadSection />

      {/* Bottom CTA Section */}
      <section className="bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 py-28 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            Start creating lectures
            <br />
            <span className="text-[#c84040]">in minutes, not hours.</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of students and educators who use PreplitAI to transform their learning experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={scrollToUpload}
              className="text-[15px] px-8 py-3 h-12 bg-white hover:bg-gray-100 text-black rounded-full font-medium transition-all duration-200 shadow-lg shadow-white/10 hover:shadow-xl hover:-translate-y-0.5"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              asChild
              variant="outline"
              className="text-[15px] px-8 py-3 h-12 rounded-full font-medium border border-white/20 bg-transparent text-white hover:bg-white/10 transition-all duration-200"
            >
              <a href="/pricing">View Pricing</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
