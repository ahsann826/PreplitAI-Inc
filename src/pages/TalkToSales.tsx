import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TalkToSales = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white">Talk to Sales</h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Tell us about your team and goals. A PreplitAI specialist will reach out within 1 business day.
        </p>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 pb-16 grid md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="md:col-span-2">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
                <Label>Team size</Label>
                <Select>
                  <SelectTrigger className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-1000">201-1000</SelectItem>
                    <SelectItem value=">1000">1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input id="phone" placeholder="+1 555 555 1234" className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
              </div>
              <div>
                <Label>Timeline</Label>
                <Select>
                  <SelectTrigger className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="1-3">1-3 months</SelectItem>
                    <SelectItem value="3-6">3-6 months</SelectItem>
                    <SelectItem value=">6">6+ months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="use">Primary use case</Label>
              <Input id="use" placeholder="e.g. AI lectures, enterprise search, agents" className="mt-2 h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
            </div>

            <div>
              <Label htmlFor="msg">Anything else?</Label>
              <Textarea id="msg" placeholder="Goals, workflow, requirements…" className="mt-2 min-h-[140px] bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" />
            </div>

            <Button type="submit" className="h-11 px-6">Submit</Button>
          </form>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold text-black dark:text-white">Contact information</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li><span className="font-medium">Sales:</span> sales@preplit.ai</li>
              <li><span className="font-medium">Support:</span> support@preplit.ai</li>
              <li><span className="font-medium">Hours:</span> Mon–Fri, 9am–6pm PT</li>
              <li><span className="font-medium">Address:</span> 123 Market St, San Francisco, CA</li>
              <li className="text-xs text-gray-500">Enterprise SLAs and security reviews available.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold text-black dark:text-white">What to expect</h3>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
              Well review your needs, share a tailored demo, and propose the best plan for your teams size and goals.
            </p>
          </div>
        </aside>
      </section>

      <Footer />
    </div>
  );
};

export default TalkToSales;
