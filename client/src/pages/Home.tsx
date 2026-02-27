import { useState, useRef } from "react";
import { Upload, Play, CheckCircle2, AlertCircle, XCircle, ChevronRight, BarChart3, Clock, LayoutGrid, Tag, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Use the attached image as background
import bgImage from "@assets/image_1772140166769.png";

type AnalysisResult = {
  score: number;
  topic: string;
  category: string;
  summary: string;
  format: string;
  length: string;
  good: string[];
  bad: string[];
  tips: string[];
};

const MOCK_ANALYSIS: AnalysisResult = {
  score: 42,
  topic: "Urban Streetwear Summer Fit",
  category: "Fashion",
  summary: "A fast-paced montage of a model walking down a city street showing off a new summer clothing line. The pacing is a bit too slow in the first 3 seconds.",
  format: "Video",
  length: "15s",
  good: [
    "High-quality cinematography and lighting.",
    "Aesthetic matches current streetwear trends."
  ],
  bad: [
    "The hook is too slow. The first 3 seconds don't clearly state the value proposition.",
    "No text overlay on screen to grab silent viewers."
  ],
  tips: [
    "Add a bold text hook like 'My go-to summer fit ☀️' in the first frame.",
    "Cut the first 2 seconds of walking; start immediately on the beat drop.",
    "Increase the pace of the initial cuts to match the audio."
  ]
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleAnalyze = () => {
    if (!file) return;
    
    setIsUploading(true);
    setProgress(0);
    
    // Mock upload & analyze process
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setAnalysis(MOCK_ANALYSIS);
          }, 600);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  const reset = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setCaption("");
    setAnalysis(null);
    setProgress(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 50) return "bg-amber-500/10 border-amber-500/20";
    return "bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 font-sans relative overflow-hidden flex flex-col">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={bgImage} 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-display font-bold text-xl rounded-sm">B</div>
          <span className="font-display text-xl tracking-widest uppercase">BackStage</span>
        </div>
        <div className="text-sm text-white/50 tracking-wide uppercase font-medium">Hook Stress Testor</div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Upload / Preview */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight">Dry Run Your Post.</h1>
              <p className="text-white/60 text-lg">Test your hook before it goes live. Stop the scroll.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-white/30 hover:bg-white/[0.02] transition-colors"
                    onClick={handleFileClick}
                    data-testid="upload-area"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-white/70" />
                    </div>
                    <h3 className="font-display text-xl mb-2">Upload Content</h3>
                    <p className="text-white/50 text-sm mb-6 text-center max-w-xs">Drag and drop your video or image here, or click to browse files.</p>
                    <Button variant="secondary" className="bg-white text-black hover:bg-white/90">
                      Select File
                    </Button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="video/*,image/*" 
                      onChange={handleFileChange}
                      data-testid="input-file"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative aspect-[9/16] max-h-[600px] mx-auto bg-black/50 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center group">
                      {previewUrl ? (
                        file?.type.startsWith('video/') ? (
                          <video 
                            src={previewUrl} 
                            className="w-full h-full object-cover" 
                            controls 
                            autoPlay 
                            muted 
                            loop
                          />
                        ) : (
                          <img 
                            src={previewUrl} 
                            className="w-full h-full object-cover" 
                            alt="Preview" 
                          />
                        )
                      ) : (
                        <>
                          <img src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-sm mix-blend-luminosity" alt="Preview bg" />
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                            <span className="font-medium">{file?.name}</span>
                            <span className="text-xs text-white/50 mt-1">Ready to test</span>
                          </div>
                        </>
                      )}
                      
                      {!isUploading && !analysis && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); reset(); }}
                          className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-white/20 transition backdrop-blur-md"
                          data-testid="btn-remove-file"
                        >
                          <XCircle className="w-5 h-5 text-white/70" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/70 uppercase tracking-wider font-display">Caption / Copy</label>
                      <textarea 
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                        rows={3}
                        placeholder="Write your post caption here..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        disabled={isUploading || analysis !== null}
                        data-testid="input-caption"
                      />
                    </div>

                    {!analysis && (
                      <div className="pt-2">
                        {isUploading ? (
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm font-medium">
                              <span className="text-white/70 animate-pulse">Running AI Stress Test...</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2 bg-white/10" />
                          </div>
                        ) : (
                          <Button 
                            className="w-full py-6 text-lg font-display uppercase tracking-wider bg-white text-black hover:bg-white/90"
                            onClick={handleAnalyze}
                            data-testid="btn-analyze"
                          >
                            Analyze Hook
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Analysis Results */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-xl h-full flex flex-col relative overflow-hidden"
                  data-testid="analysis-results"
                >
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-current opacity-5 blur-[100px] rounded-full pointer-events-none ${getScoreColor(analysis.score)}`} />
                  
                  <div className="flex items-start justify-between mb-8 border-b border-white/10 pb-6">
                    <div>
                      <h2 className="font-display text-2xl uppercase tracking-wide mb-1">Analysis Complete</h2>
                      <p className="text-white/50 text-sm">Based on past 3-month performance and category peers.</p>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-xs uppercase tracking-widest text-white/50 mb-1 font-display">Virality Score</div>
                      <div className={`text-6xl font-display font-bold leading-none ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                        <span className="text-2xl text-white/30">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                      <Tag className="w-4 h-4 text-white/40 mb-2" />
                      <div className="text-xs text-white/50 mb-1">Category</div>
                      <div className="font-medium text-sm truncate">{analysis.category}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                      <LayoutGrid className="w-4 h-4 text-white/40 mb-2" />
                      <div className="text-xs text-white/50 mb-1">Format</div>
                      <div className="font-medium text-sm">{analysis.format}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                      <Clock className="w-4 h-4 text-white/40 mb-2" />
                      <div className="text-xs text-white/50 mb-1">Length</div>
                      <div className="font-medium text-sm">{analysis.length}</div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/5">
                      <BarChart3 className="w-4 h-4 text-white/40 mb-2" />
                      <div className="text-xs text-white/50 mb-1">Topic</div>
                      <div className="font-medium text-sm truncate" title={analysis.topic}>{analysis.topic}</div>
                    </div>
                  </div>

                  <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div>
                      <h3 className="text-sm font-display uppercase tracking-widest text-white/50 mb-2">Summary</h3>
                      <p className="text-white/80 leading-relaxed text-sm">{analysis.summary}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3 text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <h3 className="font-display uppercase tracking-wider text-sm">What's Good</h3>
                        </div>
                        <ul className="space-y-2">
                          {analysis.good.map((item, i) => (
                            <li key={i} className="text-sm text-emerald-500/80 flex items-start gap-2">
                              <span className="mt-1 w-1 h-1 rounded-full bg-emerald-500/50 shrink-0" />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-3 text-rose-400">
                          <XCircle className="w-4 h-4" />
                          <h3 className="font-display uppercase tracking-wider text-sm">What's Bad</h3>
                        </div>
                        <ul className="space-y-2">
                          {analysis.bad.map((item, i) => (
                            <li key={i} className="text-sm text-rose-500/80 flex items-start gap-2">
                              <span className="mt-1 w-1 h-1 rounded-full bg-rose-500/50 shrink-0" />
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-4 text-amber-400">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="font-display uppercase tracking-wider text-sm">Tips for a Winning Hook</h3>
                      </div>
                      <div className="space-y-3">
                        {analysis.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-3 bg-black/20 p-3 rounded-lg border border-white/5">
                            <div className="w-6 h-6 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <p className="text-sm text-white/80 leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                    <Button variant="ghost" className="text-white/50 hover:text-white hover:bg-white/5" onClick={reset}>
                      Test Another Post
                    </Button>
                    <Button className="bg-white text-black hover:bg-white/90 gap-2">
                      Export Report <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border border-white/5 rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-white/[0.01]">
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Video className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="font-display text-xl mb-2 text-white/50 uppercase tracking-widest">Waiting for Upload</h3>
                  <p className="text-white/30 text-sm max-w-sm">
                    Upload a video or image to get instant AI feedback on its potential performance and hook quality.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
      
      {/* Footer Text */}
      <div className="relative z-10 py-4 text-center text-xs text-white/30 uppercase tracking-widest font-display">
        Generated based on your past 3-month performance, and Creators in your same category.
      </div>
    </div>
  );
}