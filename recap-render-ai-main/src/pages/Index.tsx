import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { UploadSection } from "@/components/UploadSection";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";

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
