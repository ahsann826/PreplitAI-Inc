import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { UploadSection } from "@/components/upload/UploadSection";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";

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
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-x-hidden">
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
      
      <Footer />
    </div>
  );
};

export default Index;
