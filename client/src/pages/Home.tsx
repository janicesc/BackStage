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
  score: 94,
  topic: "Celebrity Salon Hair Transformation",
  category: "Beauty & Lifestyle",
  summary: "A highly engaging vlog-style transformation at a premium Korean hair salon. The video excellently showcases the full experience from entry to final results, maintaining viewer interest through fast-paced cuts and clear visual progression.",
  format: "Video",
  length: "52s",
  good: [
    "The opening immediately sets a high-end, aspirational vibe that stops the scroll.",
    "Fast-paced progression from scalp diagnosis to styling keeps retention high.",
    "The final reveal is striking, aspirational, and highly shareable.",
    "Tagging the specific stylist and location drives high engagement and saves."
  ],
  bad: [
    "The text overlays in the middle section could be slightly shorter for easier reading.",
    "The transition around the 15s mark is slightly jarring."
  ],
  tips: [
    "Condense the text overlays into punchy, 3-4 word phrases.",
    "Add a clear Call-To-Action (CTA) at the end encouraging viewers to save the video for their next trip to Korea."
  ]
};

const INITIAL_CAPTION = `Visiting one of the best beauty salons in Korea, Chahong Ardor Flagship in 🇰🇷 All their hairstylists are amazing and have great techniques. Above all they have the best vibes!!! Here come all the famous Korean TV, kpop and kdramas artists 💕 My stylist was and I loved her ❤️ Follow her for hair tips ✨ If you travel to Korea and don't go to a Korea Hair Salon... did you really go to Korea? 🤯 I just went with a friend and they treated me amazing!!!! Thank you for the complementary service, they made me feel like a. ❤️ @Yun jin _ Chahong@차홍 CHAHONG OFFICIAL#celebrityhairstylist#hairstylisttips`;

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState(INITIAL_CAPTION);
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
    setCaption(INITIAL_CAPTION);
    setAnalysis(null);
    setProgress(0);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 50) return "text-amber-400";
    return "text-rose-400";
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
      <header className="relative z-10 p-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-display font-bold text-xl rounded-sm">B</div>
          <span className="font-display text-xl tracking-widest uppercase">BackStage</span>
        </div>
        <div className="text-sm text-white/50 tracking-wide uppercase font-medium">Hook Stress Testor</div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Upload / Preview */}
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-display uppercase tracking-tight">Dry Run Your Post.</h1>
              <p className="text-white/50 text-lg font-light">Test your hook before it goes live. Stop the scroll.</p>
            </div>

            <div className="bg-transparent border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20 rounded-xl cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={handleFileClick}
                    data-testid="upload-area"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                      <Upload className="w-6 h-6 text-white/70" />
                    </div>
                    <h3 className="font-display text-xl mb-2 tracking-wide uppercase">Upload Content</h3>
                    <p className="text-white/40 text-sm mb-8 text-center max-w-xs font-light">Drop your video or image here, or click to browse files.</p>
                    <Button variant="secondary" className="bg-white text-black hover:bg-white/90 rounded-full px-8">
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
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="relative aspect-[9/16] max-h-[500px] mx-auto bg-black/40 rounded-xl overflow-hidden flex items-center justify-center group">
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
                          <img src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-20 blur-xl mix-blend-luminosity" alt="Preview bg" />
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-3">
                              <Play className="w-6 h-6 text-white ml-1" />
                            </div>
                            <span className="font-medium tracking-wide">{file?.name}</span>
                            <span className="text-xs text-white/40 mt-1 uppercase tracking-widest">Ready to test</span>
                          </div>
                        </>
                      )}
                      
                      {!isUploading && !analysis && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); reset(); }}
                          className="absolute top-4 right-4 z-20 w-8 h-8 bg-black/40 rounded-full flex items-center justify-center hover:bg-white/20 transition backdrop-blur-md"
                          data-testid="btn-remove-file"
                        >
                          <XCircle className="w-4 h-4 text-white/70" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-widest font-display">Caption</label>
                      <textarea 
                        className="w-full bg-transparent border-b border-white/10 p-2 text-white placeholder:text-white/20 focus:outline-none focus:border-white/40 resize-none font-light text-sm"
                        rows={4}
                        placeholder="Write your post caption here..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        disabled={isUploading || analysis !== null}
                        data-testid="input-caption"
                      />
                    </div>

                    {!analysis && (
                      <div className="pt-4">
                        {isUploading ? (
                          <div className="space-y-4">
                            <div className="flex justify-between text-xs font-display uppercase tracking-widest text-white/60">
                              <span className="animate-pulse">Analyzing Hook...</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1 bg-white/5" />
                          </div>
                        ) : (
                          <Button 
                            className="w-full py-6 text-sm font-display uppercase tracking-widest bg-white text-black hover:bg-white/90 rounded-none"
                            onClick={handleAnalyze}
                            data-testid="btn-analyze"
                          >
                            Analyze Performance
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
                  className="h-full flex flex-col relative"
                  data-testid="analysis-results"
                >
                  <div className="flex items-end justify-between mb-10 pb-6 border-b border-white/10">
                    <div>
                      <h2 className="font-display text-3xl uppercase tracking-wider mb-2">Analysis</h2>
                      <div className="text-white/40 text-sm font-light leading-relaxed max-w-sm">
                        {analysis.summary}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="text-xs uppercase tracking-widest text-white/40 mb-2 font-display">Virality Score</div>
                      <div className={`text-7xl font-display font-light leading-none ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                        <span className="text-3xl text-white/20">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-10 text-center">
                    <div>
                      <div className="text-xs font-display uppercase tracking-widest text-white/40 mb-1">Category</div>
                      <div className="font-light text-lg">{analysis.category}</div>
                    </div>
                    <div>
                      <div className="text-xs font-display uppercase tracking-widest text-white/40 mb-1">Format</div>
                      <div className="font-light text-lg">{analysis.format}</div>
                    </div>
                    <div>
                      <div className="text-xs font-display uppercase tracking-widest text-white/40 mb-1">Length</div>
                      <div className="font-light text-lg">{analysis.length}</div>
                    </div>
                  </div>

                  <div className="space-y-12 flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    
                    <div>
                      <div className="flex items-center gap-3 mb-6 text-white">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-display text-xl uppercase tracking-wider">What's Working Well</h3>
                      </div>
                      <div className="space-y-4">
                        {analysis.good.map((item, i) => (
                          <div key={i} className="text-white/70 font-light flex items-start gap-4">
                            <span className="mt-2 w-1 h-1 rounded-full bg-emerald-400 shrink-0" />
                            <span className="leading-relaxed text-lg">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3 mb-6 text-white">
                        <XCircle className="w-5 h-5 text-white/50" />
                        <h3 className="font-display text-xl uppercase tracking-wider">Areas to Improve</h3>
                      </div>
                      <div className="space-y-4">
                        {analysis.bad.map((item, i) => (
                          <div key={i} className="text-white/50 font-light flex items-start gap-4">
                            <span className="mt-2 w-1 h-1 rounded-full bg-white/20 shrink-0" />
                            <span className="leading-relaxed text-lg">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-8 border-t border-white/5">
                      <div className="flex items-center gap-3 mb-6 text-white">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                        <h3 className="font-display text-xl uppercase tracking-wider">Pro Tips for Next Time</h3>
                      </div>
                      <div className="space-y-4">
                        {analysis.tips.map((tip, i) => (
                          <div key={i} className="text-white/70 font-light flex items-start gap-4">
                            <span className="mt-1 w-6 h-6 rounded-full border border-amber-400/30 text-amber-400 flex items-center justify-center text-xs shrink-0 font-medium">
                              {i + 1}
                            </span>
                            <span className="leading-relaxed text-lg">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="mt-8 pt-8 flex items-center justify-between">
                    <button className="text-xs uppercase tracking-widest font-display text-white/40 hover:text-white transition-colors" onClick={reset}>
                      Test Another Post
                    </button>
                    <button className="flex items-center gap-2 text-xs uppercase tracking-widest font-display hover:text-white/80 transition-colors group">
                      Export Report <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center opacity-30">
                  <BarChart3 className="w-16 h-16 mb-6 stroke-1" />
                  <h3 className="font-display text-2xl mb-3 uppercase tracking-widest">Awaiting Analysis</h3>
                  <p className="font-light max-w-sm leading-relaxed">
                    Upload your content to reveal virality score, retention breakdown, and expert hooks.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
      
      {/* Footer Text */}
      <div className="relative z-10 py-6 text-center text-[10px] text-white/30 uppercase tracking-[0.2em] font-display">
        Generated based on your past 3-month performance, and Creators in your same category.
      </div>
    </div>
  );
}
