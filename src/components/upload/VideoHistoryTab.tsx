import { History, Video, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VideoHistoryItem } from "@/types/api";
import { formatFileSize, formatDate } from "@/lib/formatters";
import { toast } from "sonner";

interface VideoHistoryTabProps {
  videoHistory: VideoHistoryItem[];
  loadingHistory: boolean;
  onRefresh: () => void;
  onSelectVideo: (url: string) => void;
}

export const VideoHistoryTab = ({
  videoHistory,
  loadingHistory,
  onRefresh,
  onSelectVideo,
}: VideoHistoryTabProps) => {
  return (
    <Card className="p-6 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-black dark:text-white">
          <History className="h-5 w-5" />
          Video History ({videoHistory.length})
        </h3>
        <Button
          size="sm"
          variant="outline"
          onClick={onRefresh}
          disabled={loadingHistory}
          className="border-gray-300 dark:border-gray-600"
        >
          {loadingHistory ? "Loading..." : "Refresh"}
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
              const baseUrl = import.meta.env.PROD ? "http://localhost:5000" : "";
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
                        onClick={() => onSelectVideo(fullUrl)}
                        className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/30 transition-colors"
                      >
                        <Video className="h-8 w-8 text-white" />
                      </button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate mb-2 text-black dark:text-white">
                        {video.filename}
                      </h4>
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
                          onClick={() => onSelectVideo(fullUrl)}
                          className="border-gray-300 dark:border-gray-600"
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Watch
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = fullUrl;
                            a.download = video.filename;
                            a.click();
                            toast.success("Download started!");
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
  );
};
