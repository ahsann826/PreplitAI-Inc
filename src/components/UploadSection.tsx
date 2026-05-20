import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Video, Loader2, Zap, BookOpen, Target, GraduationCap, Palette } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { LectureModal } from "@/components/LectureModal";

type LectureMode = "summary" | "detailed" | "test";
type LectureStyle = "professor" | "visual";

const modes = [
  {
    id: "summary" as LectureMode,
    name: "Summary Mode",
    description: "Quick overview of key concepts",
    icon: Zap
  },
  {
    id: "detailed" as LectureMode,
    name: "Detailed Mode",
    description: "In-depth explanations",
    icon: BookOpen
  },
  {
    id: "test" as LectureMode,
    name: "Test Prep Mode",
    description: "Practice questions & solutions",
    icon: Target
  }
];

const styles = [
  {
    id: "professor" as LectureStyle,
    name: "AI Professor",
    description: "Virtual teacher with board",
    icon: GraduationCap
  },
  {
    id: "visual" as LectureStyle,
    name: "Visual Concepts",
    description: "Animated visual explanations",
    icon: Palette
  }
];

export const UploadSection = () => {
  const [selectedMode, setSelectedMode] = useState<LectureMode>("summary");
  const [selectedStyle, setSelectedStyle] = useState<LectureStyle>("professor");
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [generatedLecture, setGeneratedLecture] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!validTypes.includes(fileExtension)) {
      toast.error("Please upload a PDF, DOC, DOCX, or TXT file");
      return;
    }

    try {
      setIsProcessing(true);
      setFileName(file.name);
      const res = await api.uploadDocument(file);
      setDocumentId(res.documentId);
      toast.success(`Uploaded ${res.fileName}. ${res.wordCount} words processed.`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
      setFileName(null);
      setDocumentId(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateLecture = async () => {
    if (!documentId) {
      toast.error("Please upload a file first");
      return;
    }
    try {
      setIsProcessing(true);
      const res = await api.generateLecture(documentId, selectedMode, selectedStyle);
      setGeneratedLecture(res.lecture);
      setShowModal(true);
      toast.success(`Lecture script ready! ~${res.lecture.estimatedDuration} min`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to generate lecture");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section id="upload-section" className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-black dark:text-white">
            Create Your AI Lecture
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose your learning style and upload your notes
          </p>
        </div>

        {/* Mode Selection */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center text-black dark:text-white">
            Select Learning Mode
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {modes.map((mode) => (
              <Card
                key={mode.id}
                className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                  selectedMode === mode.id
                    ? 'border-black dark:border-white bg-white dark:bg-gray-800 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <mode.icon className={`h-10 w-10 mb-4 ${selectedMode === mode.id ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                <h4 className="text-lg font-bold mb-2 text-black dark:text-white">{mode.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{mode.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-6 text-center text-black dark:text-white">
            Select Lecture Style
          </h3>
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {styles.map((style) => (
              <Card
                key={style.id}
                className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
                  selectedStyle === style.id
                    ? 'border-black dark:border-white bg-white dark:bg-gray-800 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <style.icon className={`h-10 w-10 mb-4 ${selectedStyle === style.id ? 'text-black dark:text-white' : 'text-gray-600 dark:text-gray-400'}`} />
                <h4 className="text-lg font-bold mb-2 text-black dark:text-white">{style.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{style.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* File Upload Card */}
        <Card className="p-10 border-2 border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              {isProcessing ? (
                <Loader2 className="h-8 w-8 text-gray-600 dark:text-gray-400 animate-spin" />
              ) : (
                <Upload className="h-8 w-8 text-gray-600 dark:text-gray-400" />
              )}
            </div>
            
            {fileName ? (
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg inline-block">
                <FileText className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-gray-400" />
                <p className="text-base font-semibold text-black dark:text-white">{fileName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ready to generate</p>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold mb-2 text-black dark:text-white">Upload Your Notes</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  PDF, DOC, DOCX, or TXT files supported
                </p>
              </>
            )}

            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              disabled={isProcessing}
            />
            
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => document.getElementById('file-upload')?.click()}
                disabled={isProcessing}
                variant="outline"
                className="text-base px-8 py-6 h-auto border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    {fileName ? 'Upload Different File' : 'Choose File'}
                  </>
                )}
              </Button>

              {fileName && (
                <Button
                  size="lg"
                  onClick={handleGenerateLecture}
                  disabled={isProcessing || !documentId}
                  className="text-base px-8 py-6 h-auto bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black font-semibold"
                >
                  {isProcessing ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <Video className="mr-2 h-5 w-5" />
                  )}
                  {isProcessing ? 'Generating...' : 'Generate Lecture'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      <LectureModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        lecture={generatedLecture}
      />
    </section>
  );
};
