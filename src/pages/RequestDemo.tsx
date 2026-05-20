import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/Footer";

const RequestDemo = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10">
        <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white">Request a demo</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Tell us a bit about your team and how you plan to use PreplitAI. We’ll reach out within 1 business day.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="mt-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required placeholder="Jane Doe" className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
            </div>
            <div>
              <Label htmlFor="email">Work email</Label>
              <Input id="email" type="email" required placeholder="jane@company.com" className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" required placeholder="Acme Inc." className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
            </div>
            <div>
              <Label htmlFor="size">Team size</Label>
              <Input id="size" placeholder="e.g. 50" className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
            </div>
          </div>

          <div>
            <Label htmlFor="use">Primary use case</Label>
            <Input id="use" placeholder="e.g. Create AI lectures, enterprise search, agents" className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
          </div>

          <div>
            <Label htmlFor="msg">Anything else?</Label>
            <Textarea id="msg" placeholder="Goals, timeline, requirements…" className="mt-2 min-h-[120px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
          </div>

          <Button type="submit" className="h-11 px-6">Request a demo</Button>
        </form>
      </section>

      <Footer />
    </div>
  );
};

export default RequestDemo;