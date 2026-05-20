import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, X, Video, Settings, History, Clock } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { api, VideoHistoryItem } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";

interface LectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  lecture: {
    mode: string;
    style: string;
    script: string;
    sceneBreakdown: string;
    wordCount: number;
    estimatedDuration: number;
  } | null;
}

export const LectureModal = ({ isOpen, onClose, lecture }: LectureModalProps) => {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('https://create-images-results.d-id.com/DefaultPresenters/Billy_m/v2_with_background_image.jpg');
  const [voiceId, setVoiceId] = useState('en-US-JennyNeural');
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
      console.error('Failed to load video history:', error);
      toast.error('Failed to load video history');
    } finally {
      setLoadingHistory(false);
    }
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  if (!lecture) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const downloadAsText = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const generateVideo = async () => {
    if (!avatarUrl.trim()) {
      toast.error('Please enter an avatar URL in settings');
      setShowSettings(true);
      return;
    }
    
    setIsGeneratingVideo(true);
    try {
      toast.info("Generating AI avatar video with D-ID... This may take a few minutes.");
      
      const result = await api.generateVideo(lecture.script, {
        provider: 'did',
        voiceId: voiceId,
        driverUrl: avatarUrl,
        ratio: '16:9'
      });
      
      toast.success("Video generated successfully!");
      
      const baseUrl = import.meta.env.PROD ? 'http://localhost:5000' : '';
      const fullVideoUrl = `${baseUrl}${result.videoUrl}`;
      setVideoUrl(fullVideoUrl);
      
      loadVideoHistory();
    } catch (error) {
      console.error('Video generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate video');
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
          <DialogDescription className="text-base">
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
          <TabsList className={`grid w-full ${videoUrl ? 'grid-cols-4' : 'grid-cols-3'} bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex-shrink-0`}>
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
                  onClick={() => downloadAsText(lecture.script, 'lecture-script.txt')}
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
                  onClick={() => downloadAsText(lecture.sceneBreakdown, 'scene-breakdown.txt')}
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
                      const a = document.createElement('a');
                      a.href = videoUrl;
                      a.download = videoUrl.split('/').pop() || 'lecture-video.mp4';
                      a.click();
                      toast.success('Download started!');
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
                      console.error('Video playback error:', e);
                      toast.error('Failed to load video. Try downloading instead.');
                    }}
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="history" className="flex-1 overflow-auto mt-4">
            <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-black dark:text-white">
                  <History className="h-5 w-5" />
                  Video History ({videoHistory.length})
                </h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={loadVideoHistory}
                  disabled={loadingHistory}
                  className="border-gray-300 dark:border-gray-600"
                >
                  {loadingHistory ? 'Loading...' : 'Refresh'}
                </Button>
              </div>
              
              <ScrollArea className="h-[400px] pr-4">
                {videoHistory.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No videos generated yet</p>
                    <p className="text-sm mt-2">Generate your first lecture video to see it here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {videoHistory.map((video) => {
                      const baseUrl = import.meta.env.PROD ? 'http://localhost:5000' : '';
                      const fullUrl = `${baseUrl}${video.videoUrl}`;
                      
                      return (
                        <Card
                          key={video.id}
                          className="p-4 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                          <div className="flex gap-4">
                            <div className="relative w-48 aspect-video bg-black rounded overflow-hidden flex-shrink-0">
                              <video
                                src={fullUrl}
                                className="w-full h-full object-cover"
                                preload="metadata"
                              />
                              <button
                                onClick={() => setVideoUrl(fullUrl)}
                                className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-colors"
                              >
                                <Video className="h-8 w-8 text-white" />
                              </button>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate mb-2 text-black dark:text-white">{video.filename}</h4>
                              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(video.createdAt)}
                                </div>
                                <div>Size: {formatFileSize(video.size)}</div>
                              </div>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setVideoUrl(fullUrl)}
                                  className="border-gray-300 dark:border-gray-600"
                                >
                                  <Video className="h-3 w-3 mr-1" />
                                  Watch
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    const a = document.createElement('a');
                                    a.href = fullUrl;
                                    a.download = video.filename;
                                    a.click();
                                    toast.success('Download started!');
                                  }}
                                  className="border-gray-300 dark:border-gray-600"
                                >
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 relative">
          {showSettings && (
            <Card className="absolute bottom-0 left-0 right-0 p-6 mb-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl z-10">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-black dark:text-white">
                <Settings className="h-5 w-5" />
                Video Generation Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="avatarUrl" className="text-black dark:text-white">Avatar Image URL</Label>
                  <Input
                    id="avatarUrl"
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use a D-ID compatible avatar image URL. Get one from <a href="https://studio.d-id.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">D-ID Studio</a>
                  </p>
                </div>
                <div>
                  <Label htmlFor="voiceId" className="text-black dark:text-white">Voice ID</Label>
                  <Input
                    id="voiceId"
                    type="text"
                    value={voiceId}
                    onChange={(e) => setVoiceId(e.target.value)}
                    placeholder="en-US-JennyNeural"
                    className="mt-2 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Microsoft Azure voice ID (e.g., en-US-JennyNeural, en-US-GuyNeural)
                  </p>
                </div>
                <Button
                  onClick={() => setShowSettings(false)}
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-600"
                >
                  Close Settings
                </Button>
              </div>
            </Card>
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
