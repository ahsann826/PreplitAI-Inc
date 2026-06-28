import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Video, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/services/api";
import { LectureModal } from "./LectureModal";
import { modes } from "./uploadData";
import { LectureMode, LectureStyle, LectureData } from "@/types/api";

export const UploadSection = () => {
  const [selectedMode, setSelectedMode] = useState<LectureMode>("summary");
  const selectedStyle: LectureStyle = "visual";
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [generatedLecture, setGeneratedLecture] = useState<LectureData | null>(null);
  const [showModal, setShowModal] = useState(false);

  // New states for pasted notes support
  const [inputType, setInputType] = useState<"file" | "paste">("file");
  const [pastedText, setPastedText] = useState("");
  const [pastedTitle, setPastedTitle] = useState("");

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
    let currentDocId = documentId;

    if (inputType === "paste") {
      if (!pastedText.trim()) {
        toast.error("Please paste your notes first");
        return;
      }
      try {
        setIsProcessing(true);
        const res = await api.uploadText(pastedText, pastedTitle || "Pasted Notes");
        currentDocId = res.documentId;
        setDocumentId(res.documentId);
        setFileName(res.fileName);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || "Failed to process pasted notes");
        setIsProcessing(false);
        return;
      }
    }

    if (!currentDocId) {
      toast.error(inputType === "file" ? "Please upload a file first" : "Please paste your notes first");
      return;
    }

    try {
      setIsProcessing(true);
      const res = await api.generateLecture(currentDocId, selectedMode, selectedStyle);
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
    <section
      id="upload-section"
      className="pt-8 pb-24 px-6 bg-[#faf9f7] dark:bg-[#111]"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight text-black dark:text-white">
            Create Your AI Lecture
          </h2>
          <p className="text-[15px] text-gray-500 dark:text-gray-400">
            Choose your learning mode and provide your notes
          </p>
        </div>

        {/* Learning Mode Selection */}
        <div className="mb-16 max-w-3xl mx-auto">
          <h3 className="text-sm font-semibold mb-5 text-center tracking-wide uppercase text-gray-500 dark:text-gray-400">
            Learning Mode
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {modes.map((mode) => (
              <div
                key={mode.id}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 bg-white dark:bg-white/5 ${
                  selectedMode === mode.id
                    ? "border-2 border-red-600 dark:border-red-500 shadow-sm"
                    : "border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                }`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <mode.icon
                  className={`h-5 w-5 mb-3 ${
                    selectedMode === mode.id
                      ? "text-red-600 dark:text-red-500"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  strokeWidth={2}
                />
                <h4 className="text-[14px] font-semibold mb-1 text-black dark:text-white">
                  {mode.name}
                </h4>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  {mode.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Toggle input type */}
        <div className="flex justify-center gap-4 mb-8">
          <Button
            variant={inputType === "file" ? "default" : "outline"}
            className={inputType === "file" ? "bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black" : "border-gray-300 dark:border-gray-600 text-black dark:text-white"}
            onClick={() => {
              setInputType("file");
              setFileName(null);
              setDocumentId(null);
            }}
          >
            Upload File
          </Button>
          <Button
            variant={inputType === "paste" ? "default" : "outline"}
            className={inputType === "paste" ? "bg-black hover:bg-gray-800 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black" : "border-gray-300 dark:border-gray-600 text-black dark:text-white"}
            onClick={() => {
              setInputType("paste");
              setFileName(null);
              setDocumentId(null);
            }}
          >
            Paste Notes
          </Button>
        </div>

        {/* Upload/Paste Area */}
        <div className="max-w-3xl mx-auto border-2 border-dashed border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-14">
          {inputType === "paste" ? (
            <div className="w-full text-left">
              <h3 className="text-lg font-semibold mb-4 text-black dark:text-white tracking-tight text-center">
                Paste Your Notes
              </h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="notes-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title (Optional)
                  </label>
                  <input
                    id="notes-title"
                    type="text"
                    placeholder="e.g. Chemistry Lecture 1"
                    value={pastedTitle}
                    onChange={(e) => setPastedTitle(e.target.value)}
                    className="w-full mt-1.5 p-3 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label htmlFor="notes-content" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes Content
                  </label>
                  <textarea
                    id="notes-content"
                    rows={8}
                    placeholder="Paste your course notes, slides text, transcript, or summary here..."
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    className="w-full mt-1.5 p-4 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 font-sans text-sm leading-relaxed"
                  />
                </div>
                <div className="flex justify-center pt-2">
                  <Button
                    onClick={handleGenerateLecture}
                    disabled={isProcessing || !pastedText.trim()}
                    className="h-10 px-6 text-[13px] font-medium bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg transition-all"
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Video className="mr-2 h-4 w-4" />
                    )}
                    {isProcessing ? "Generating..." : "Generate Lecture"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {/* Upload Icon */}
              <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center">
                {isProcessing ? (
                  <Loader2 className="h-6 w-6 text-gray-400 dark:text-gray-500 animate-spin" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                )}
              </div>

              {/* File Info or Upload Prompt */}
              {fileName ? (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-white/5 rounded-xl inline-block border border-gray-100 dark:border-white/10">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                  <p className="text-[14px] font-semibold text-black dark:text-white">
                    {fileName}
                  </p>
                  <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-1">
                    Ready to generate
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mb-2 text-black dark:text-white tracking-tight">
                    Upload Your Notes
                  </h3>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-6">
                    PDF, DOC, DOCX, or TXT files supported
                  </p>
                </>
              )}

              {/* Hidden File Input */}
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                disabled={isProcessing}
              />

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center flex-wrap">
                <Button
                  size="sm"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  disabled={isProcessing}
                  variant="outline"
                  className="h-10 px-5 text-[13px] font-medium border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 bg-white dark:bg-transparent text-black dark:text-white rounded-lg transition-all"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {fileName ? "Upload Different File" : "Choose File"}
                    </>
                  )}
                </Button>

                {fileName && (
                  <Button
                    size="sm"
                    onClick={handleGenerateLecture}
                    disabled={isProcessing || !documentId}
                    className="h-10 px-5 text-[13px] font-medium bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black rounded-lg transition-all"
                  >
                    {isProcessing ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Video className="mr-2 h-4 w-4" />
                    )}
                    {isProcessing ? "Generating..." : "Generate Lecture"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <LectureModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        lecture={generatedLecture}
      />
    </section>
  );
};
