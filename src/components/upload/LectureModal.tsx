import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Video, Settings, History } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api } from "@/services/api";
import { Card } from "@/components/ui/card";
import { DEFAULT_AVATAR_URL, DEFAULT_VOICE_ID, API_BASE_URL } from "@/constants/config";
import { VideoHistoryItem, LectureData } from "@/types/api";
import { VideoSettings } from "./VideoSettings";
import { VideoHistoryTab } from "./VideoHistoryTab";

interface LectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: LectureData | null;
}

export const LectureModal = ({ isOpen, onClose, lecture }: LectureModalProps) => {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR_URL);
  const [voiceId, setVoiceId] = useState(DEFAULT_VOICE_ID);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoHistory, setVideoHistory] = useState<VideoHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadVideoHistory();
    }
  }, [isOpen]);

  const loadVideoHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await api.getVideoHistory();
      setVideoHistory(result.videos);
    } catch (error) {
      console.error("Failed to load video history:", error);
      toast.error("Failed to load video history");
    } finally {
      setLoadingHistory(false);
    }
  };

  if (!lecture) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const generateVideo = async () => {
    if (!avatarUrl.trim()) {
      toast.error("Please enter an avatar URL in settings");
      setShowSettings(true);
      return;
    }

    setIsGeneratingVideo(true);
    try {
      toast.info("Queueing AI avatar video generation... This may take a few minutes.");

      // 1. Enqueue job
      const queueResult = await api.generateVideo(lecture.script, {
        provider: "did",
        voiceId: voiceId,
        driverUrl: avatarUrl,
        ratio: "16:9",
      });

      if (!queueResult.jobId) {
        throw new Error("Failed to get job ID from server");
      }

      // 2. Listen to SSE for status
      const token = localStorage.getItem('token') || '';
      // EventSource doesn't support custom headers easily natively, so we pass token in URL or rely on cookies.
      // We will assume the backend doesn't strictly need auth for this specific GET if it's too hard to pass,
      // but since it's authMiddleware, let's append it as a query param and backend handles it, OR
      // we use fetch to consume the SSE stream (more robust for Auth headers).
      
      const response = await fetch(`${API_BASE_URL}/video/status/${queueResult.jobId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok || !response.body) throw new Error("Failed to connect to status stream");
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      
      while (!done) {
        const { value, done: streamDone } = await reader.read();
        done = streamDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.replace('data: ', ''));
              
              if (data.status === 'completed') {
                toast.success("Video generated successfully!");
                setVideoUrl(data.videoUrl);
                done = true;
                loadVideoHistory();
              } else if (data.status === 'failed') {
                throw new Error(data.error || "Video generation failed");
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Video generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate video");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden flex flex-col bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-black dark:text-white">
            Your AI Lecture Script
          </DialogTitle>
          <DialogDescription className="text-base" asChild>
            <div className="flex gap-3 mt-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-medium border border-gray-200 dark:border-gray-700">
                {lecture.mode.charAt(0).toUpperCase() + lecture.mode.slice(1)} Mode
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-medium border border-gray-200 dark:border-gray-700">
                {lecture.style.charAt(0).toUpperCase() + lecture.style.slice(1)} Style
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-medium border border-gray-200 dark:border-gray-700">
                ~{lecture.estimatedDuration} minutes
              </span>
              <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-sm font-medium border border-gray-200 dark:border-gray-700">
                {lecture.wordCount} words
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="script" className="flex-1 overflow-hidden flex flex-col mt-4 min-h-0">
          <TabsList className={`grid w-full ${videoUrl ? "grid-cols-4" : "grid-cols-3"} bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex-shrink-0`}>
            <TabsTrigger value="script" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:text-black dark:data-[state=active]:text-white font-medium">Script</TabsTrigger>
            <TabsTrigger value="scenes" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:text-black dark:data-[state=active]:text-white font-medium">Scenes</TabsTrigger>
            {videoUrl && <TabsTrigger value="video" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:text-black dark:data-[state=active]:text-white font-medium">Video</TabsTrigger>}
            <TabsTrigger value="history" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 rounded-md text-gray-700 dark:text-gray-300 data-[state=active]:text-black dark:data-[state=active]:text-white font-medium">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="script" className="flex-1 overflow-auto mt-4">
            <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(lecture.script)}
                  className="border-gray-300 dark:border-gray-600"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadAsText(lecture.script, "lecture-script.txt")}
                  className="border-gray-300 dark:border-gray-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-sans">
                  {lecture.script}
                </pre>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scenes" className="flex-1 overflow-auto mt-4">
            <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(lecture.sceneBreakdown)}
                  className="border-gray-300 dark:border-gray-600"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadAsText(lecture.sceneBreakdown, "scene-breakdown.txt")}
                  className="border-gray-300 dark:border-gray-600"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200 font-sans">
                  {lecture.sceneBreakdown}
                </pre>
              </div>
            </Card>
          </TabsContent>

          {videoUrl && (
            <TabsContent value="video" className="flex-1 overflow-auto mt-4">
              <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-black dark:text-white">Generated Video</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = videoUrl;
                      a.download = videoUrl.split("/").pop() || "lecture-video.mp4";
                      a.click();
                      toast.success("Download started!");
                    }}
                    className="border-gray-300 dark:border-gray-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </Button>
                </div>
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full h-full"
                    onError={(e) => {
                      console.error("Video playback error:", e);
                      toast.error("Failed to load video. Try downloading instead.");
                    }}
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="history" className="flex-1 overflow-auto mt-4">
            <VideoHistoryTab
              videoHistory={videoHistory}
              loadingHistory={loadingHistory}
              onRefresh={loadVideoHistory}
              onSelectVideo={(url) => setVideoUrl(url)}
            />
          </TabsContent>
        </Tabs>

        <div className="mt-6 relative">
          {showSettings && (
            <VideoSettings
              avatarUrl={avatarUrl}
              setAvatarUrl={setAvatarUrl}
              voiceId={voiceId}
              setVoiceId={setVoiceId}
              onClose={() => setShowSettings(false)}
            />
          )}
          {!showSettings && (
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                size="lg"
                className="border-gray-300 dark:border-gray-600"
              >
                <Settings className="h-5 w-5 mr-2" />
                Settings
              </Button>
              <Button
                onClick={generateVideo}
                disabled={isGeneratingVideo}
                size="lg"
                className="bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black"
              >
                <Video className="h-5 w-5 mr-2" />
                {isGeneratingVideo ? "Generating Video..." : "Generate Video"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
