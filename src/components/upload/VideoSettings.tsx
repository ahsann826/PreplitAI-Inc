import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface VideoSettingsProps {
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
  voiceId: string;
  setVoiceId: (voiceId: string) => void;
  onClose: () => void;
}

export const VideoSettings = ({
  avatarUrl,
  setAvatarUrl,
  voiceId,
  setVoiceId,
  onClose,
}: VideoSettingsProps) => {
  return (
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
            Use a D-ID compatible avatar image URL. Get one from{" "}
            <a
              href="https://studio.d-id.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              D-ID Studio
            </a>
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
          onClick={onClose}
          variant="outline"
          className="w-full border-gray-300 dark:border-gray-600"
        >
          Close Settings
        </Button>
      </div>
    </Card>
  );
};
