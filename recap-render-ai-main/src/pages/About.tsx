import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";

const About = () => {
  const siteUrl = (import.meta as any).env?.VITE_SITE_URL || "https://yourdomain.com";
  const canonical = `${siteUrl}/about`;
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden">
      <SEOHead
        title="About PreplitAI"
        description="We’re building the most realistic AI lecture platform to help teams create high‑quality video lessons."
        url={canonical}
        canonical={canonical}
      />
      {/* Hero */}
      <section className="relative px-6 pt-24 pb-16 overflow-hidden">
        <div className="absolute top-0 -left-48 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-48 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl" />
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-6 leading-tight">
            About <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">PreplitAI</span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
            We're building the most realistic AI lecture platform to help students and teams
            learn faster, retain more, and create high‑quality video lessons from any notes.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="px-6 py-10 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-3">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Make high‑quality education accessible to everyone by transforming raw material into
              engaging, instructor‑level lectures—instantly. With AI avatars, scene composition,
              and structured scripts, anyone can create professional learning experiences.
            </p>
          </div>
          <Card className="p-6 bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800">
            <ul className="grid grid-cols-2 gap-6 text-center">
              <li>
                <div className="text-3xl font-bold text-black dark:text-white">1M+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Learners empowered</div>
              </li>
              <li>
                <div className="text-3xl font-bold text-black dark:text-white">190+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Countries reached</div>
              </li>
              <li>
                <div className="text-3xl font-bold text-black dark:text-white">10x</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Faster content</div>
              </li>
              <li>
                <div className="text-3xl font-bold text-black dark:text-white">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Avg. satisfaction</div>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Story */}
      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 order-2 md:order-1">
            <h3 className="text-xl md:text-2xl font-semibold text-black dark:text-white mb-3">Our Story</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              PreplitAI began as a way to turn messy study notes into clear, engaging lectures. We
              combined state‑of‑the‑art generative models with thoughtful UX to streamline the entire
              process—from document parsing to scene composition to video rendering.
            </p>
          </Card>
          <div className="order-1 md:order-2">
            <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-blue-600/15 via-purple-600/15 to-pink-600/15 border border-gray-200 dark:border-gray-800" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button asChild className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black">
            <a href="/demo">Request a demo</a>
          </Button>
          <Button asChild variant="outline" className="border-2 border-gray-300 dark:border-gray-700">
            <a href="/">Back to home</a>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default About;
