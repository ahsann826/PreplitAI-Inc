import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, BookOpen, Users, Video, Award, Sparkles, Heart } from "lucide-react";

const communityResources = [
  {
    icon: MessageCircle,
    title: "Discord Community",
    description: "Join 5,000+ educators and creators. Get help, share tips, and connect with other PreplitAI users.",
    action: "Join Discord",
    color: "blue"
  },
  {
    icon: Video,
    title: "Weekly Webinars",
    description: "Live demos, Q&A sessions, and deep dives into advanced features every Tuesday at 2 PM EST.",
    action: "Register Now",
    color: "purple"
  },
  {
    icon: BookOpen,
    title: "Template Library",
    description: "Access hundreds of community-contributed templates for different subjects and teaching styles.",
    action: "Browse Templates",
    color: "pink"
  },
  {
    icon: Users,
    title: "User Groups",
    description: "Connect with educators in your region or subject area through our local and specialized groups.",
    action: "Find Groups",
    color: "green"
  }
];

const upcomingEvents = [
  {
    date: "Jan 15",
    title: "Getting Started with AI Video Lectures",
    type: "Workshop",
    attendees: 234
  },
  {
    date: "Jan 22",
    title: "Advanced Scripting Techniques",
    type: "Masterclass",
    attendees: 189
  },
  {
    date: "Jan 29",
    title: "Building a Complete Course Library",
    type: "Workshop",
    attendees: 156
  },
  {
    date: "Feb 5",
    title: "Q&A with the Product Team",
    type: "Office Hours",
    attendees: 412
  }
];

const highlights = [
  { icon: Award, label: "Featured Creator of the Month", value: "Dr. Amanda Kim" },
  { icon: Sparkles, label: "Top Template This Week", value: "Biology Lab Series" },
  { icon: Heart, label: "Most Helpful Member", value: "@edutech_pro" }
];

const Community = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
    <section className="max-w-7xl mx-auto px-6 pt-20 pb-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-6">
          Join the <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Community</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Connect with thousands of educators, creators, and learners who are transforming education with AI.
        </p>
      </div>

      {/* Community Highlights */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {highlights.map((highlight, i) => {
          const Icon = highlight.icon;
          return (
            <Card key={i} className="border-2 border-gray-200 dark:border-gray-800">
              <CardContent className="pt-6 text-center">
                <Icon className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{highlight.label}</p>
                <p className="text-lg font-bold text-black dark:text-white">{highlight.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Community Resources */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {communityResources.map((resource, i) => {
          const Icon = resource.icon;
          const colorClasses = {
            blue: "from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800",
            purple: "from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800",
            pink: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 border-pink-200 dark:border-pink-800",
            green: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800"
          };
          return (
            <Card key={i} className={`border-2 bg-gradient-to-br ${colorClasses[resource.color as keyof typeof colorClasses]}`}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-8 h-8 text-gray-900 dark:text-white" />
                  <CardTitle className="text-2xl">{resource.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{resource.description}</p>
                <Button className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black">
                  {resource.action}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <Card className="border-2 border-gray-200 dark:border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-3xl">Upcoming Events</CardTitle>
            </div>
            <Button variant="outline">View All Events</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{event.date.split(' ')[1]}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{event.date.split(' ')[0]}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-black dark:text-white mb-1">{event.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        {event.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {event.attendees} registered
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">5,000+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Community Members</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">250+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Events Hosted</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-pink-600 dark:text-pink-400 mb-2">800+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Shared Templates</div>
        </div>
        <div>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">50+</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default Community;
