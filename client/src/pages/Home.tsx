import { useState, useRef, useEffect } from "react";
import { Upload, Play, CheckCircle2, AlertCircle, XCircle, ChevronRight, BarChart3, Clock, LayoutGrid, Tag, Video, Moon, Sun } from "lucide-react";
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
  score: 72,
  topic: "Celebrity Salon Hair Transformation",
  category: "Beauty & Lifestyle",
  summary: "A solid vlog-style transformation at a premium Korean hair salon. The video captures the experience well, but the pacing drags in the middle, and the initial hook could be stronger to improve retention.",
  format: "Video",
  length: "52s",
  good: [
    "The high-end aesthetic is immediately appealing and fits the beauty niche perfectly.",
    "The final reveal is striking and clearly demonstrates the value of the service.",
    "Tagging the specific stylist and location is great for searchability and saves."
  ],
  bad: [
    "The first 3 seconds lack a strong verbal or visual hook to immediately grab attention.",
    "The scalp diagnosis section is too long and slows down the overall pacing.",
    "The text overlays in the middle are slightly too wordy for fast reading."
  ],
  tips: [
    "Add a bold text hook like 'The ultimate K-Beauty hair transformation' in the first frame.",
    "Trim the scalp diagnosis section by 5 seconds to keep the momentum going.",
    "Condense the text overlays into punchy, 3-4 word phrases."
  ]
};

const INITIAL_CAPTION = `Visiting one of the best beauty salons in Korea, Chahong Ardor Flagship in 🇰🇷 All their hairstylists are amazing and have great techniques. Above all they have the best vibes!!! Here come all the famous Korean TV, kpop and kdramas artists 💕 My stylist was and I loved her ❤️ Follow her for hair tips ✨ If you travel to Korea and don't go to a Korea Hair Salon... did you really go to Korea? 🤯 I just went with a friend and they treated me amazing!!!! Thank you for the complementary service, they made me feel like a. ❤️ @Yun jin _ Chahong@차홍 CHAHONG OFFICIAL#celebrityhairstylist#hairstylisttips`;

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState(INITIAL_CAPTION);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', newTheme);
  };

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
    if (score >= 80) return "text-emerald-500 dark:text-emerald-400";
    if (score >= 50) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 font-sans relative overflow-hidden flex flex-col transition-colors duration-300">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img 
          src={bgImage} 
          alt="Cinematic Background" 
          className="w-full h-full object-cover opacity-5 dark:opacity-20 grayscale dark:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6 flex items-center justify-between border-b border-border backdrop-blur-md bg-background/50">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-6 h-6 md:w-8 md:h-8 bg-foreground text-background flex items-center justify-center font-display font-bold text-sm md:text-xl rounded-sm">B</div>
          <span className="font-display text-lg md:text-xl tracking-widest uppercase">BackStage</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:block text-xs md:text-sm text-muted-foreground tracking-wide uppercase font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => window.location.href = '/pricing'}>Pricing</div>
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-border flex items-center justify-center bg-card hover:bg-secondary transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3 h-3 md:w-4 md:h-4 text-foreground" /> : <Moon className="w-3 h-3 md:w-4 md:h-4 text-foreground" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center p-4 md:p-12 overflow-y-auto">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start h-full">
          
          {/* Left Column: Upload / Preview */}
          <div className="space-y-4 md:space-y-8 flex-shrink-0">
            <div className="space-y-1 md:space-y-2 text-center lg:text-left pt-2 md:pt-0">
              <h1 className="text-3xl md:text-5xl font-display uppercase tracking-tight">Dry Run Your Post.</h1>
              <p className="text-muted-foreground text-sm md:text-lg font-light">Test your hook before it goes live. Stop the scroll.</p>
            </div>

            <div className="bg-card/30 border border-border rounded-xl md:rounded-2xl p-4 md:p-6 backdrop-blur-xl relative overflow-hidden shadow-sm">
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div 
                    key="upload"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 md:py-20 rounded-xl cursor-pointer hover:bg-secondary/50 border border-transparent hover:border-border transition-all"
                    onClick={handleFileClick}
                    data-testid="upload-area"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-secondary flex items-center justify-center mb-4 md:mb-6 border border-border">
                      <Upload className="w-5 h-5 md:w-6 md:h-6 text-foreground/70" />
                    </div>
                    <h3 className="font-display text-lg md:text-xl mb-1 md:mb-2 tracking-wide uppercase">Upload Content</h3>
                    <p className="text-muted-foreground text-xs md:text-sm mb-6 md:mb-8 text-center max-w-xs font-light px-4">Drop your video or image here, or click to browse files.</p>
                    <Button variant="outline" className="rounded-full px-6 md:px-8 bg-background text-xs md:text-sm h-9 md:h-10">
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
                    className="space-y-4 md:space-y-6"
                  >
                    <div className="relative aspect-[9/16] max-h-[40vh] md:max-h-[500px] mx-auto bg-black/10 dark:bg-black/40 rounded-xl overflow-hidden flex items-center justify-center group border border-border shadow-sm">
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
                          <img src={bgImage} className="absolute inset-0 w-full h-full object-cover opacity-10 dark:opacity-20 blur-xl mix-blend-luminosity" alt="Preview bg" />
                          <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-background/50 border border-border backdrop-blur-md flex items-center justify-center mb-3">
                              <Play className="w-6 h-6 text-foreground ml-1" />
                            </div>
                            <span className="font-medium tracking-wide">{file?.name}</span>
                            <span className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">Ready to test</span>
                          </div>
                        </>
                      )}
                      
                      {!isUploading && !analysis && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); reset(); }}
                          className="absolute top-4 right-4 z-20 w-8 h-8 bg-background/80 border border-border rounded-full flex items-center justify-center hover:bg-secondary transition backdrop-blur-md shadow-sm"
                          data-testid="btn-remove-file"
                        >
                          <XCircle className="w-4 h-4 text-foreground/70" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 md:space-y-3">
                      <label className="text-[10px] md:text-xs font-medium text-muted-foreground uppercase tracking-widest font-display">Caption</label>
                      <textarea 
                        className="w-full bg-transparent border-b border-border p-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none font-light text-xs md:text-sm transition-colors"
                        rows={3}
                        placeholder="Write your post caption here..."
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        disabled={isUploading || analysis !== null}
                        data-testid="input-caption"
                      />
                    </div>

                    {!analysis && (
                      <div className="pt-2 md:pt-4">
                        {isUploading ? (
                          <div className="space-y-3 md:space-y-4">
                            <div className="flex justify-between text-[10px] md:text-xs font-display uppercase tracking-widest text-muted-foreground">
                              <span className="animate-pulse">Analyzing Hook...</span>
                              <span>{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-1 bg-border" />
                          </div>
                        ) : (
                          <Button 
                            className="w-full py-4 md:py-6 text-xs md:text-sm font-display uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 rounded-none shadow-md"
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
          <div className="h-full flex flex-col lg:h-auto w-full pb-8 md:pb-0">
            <AnimatePresence mode="wait">
              {analysis ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full flex flex-col relative bg-card/5 lg:bg-transparent border lg:border-none border-border rounded-xl md:rounded-none p-4 md:p-0"
                  data-testid="analysis-results"
                >
                  <div className="flex flex-col-reverse md:flex-row md:items-end justify-between gap-4 md:gap-0 mb-6 md:mb-8 pb-4 md:pb-6 border-b border-border">
                    <div>
                      <h2 className="font-display font-medium text-xl md:text-3xl uppercase tracking-wider mb-1 md:mb-2 text-foreground">Analysis</h2>
                      <div className="text-muted-foreground text-xs md:text-sm font-light leading-relaxed max-w-sm line-clamp-2 md:line-clamp-none">
                        {analysis.summary}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end">
                      <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mb-1 md:mb-2 font-display">Virality Score</div>
                      <div className={`text-5xl md:text-7xl font-display font-light leading-none tracking-tighter ${getScoreColor(analysis.score)}`}>
                        {analysis.score}
                        <span className="text-2xl md:text-3xl text-muted-foreground/50">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8 text-center">
                    <div className="bg-card/50 border border-border rounded-lg p-2 md:p-3">
                      <div className="text-[8px] md:text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">Category</div>
                      <div className="font-medium text-xs md:text-sm truncate px-1">{analysis.category}</div>
                    </div>
                    <div className="bg-card/50 border border-border rounded-lg p-2 md:p-3">
                      <div className="text-[8px] md:text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">Format</div>
                      <div className="font-medium text-xs md:text-sm">{analysis.format}</div>
                    </div>
                    <div className="bg-card/50 border border-border rounded-lg p-2 md:p-3">
                      <div className="text-[8px] md:text-[10px] font-display uppercase tracking-widest text-muted-foreground mb-1">Length</div>
                      <div className="font-medium text-xs md:text-sm">{analysis.length}</div>
                    </div>
                  </div>

                  <div className="space-y-6 md:space-y-8 flex-1 overflow-y-visible md:overflow-y-auto md:pr-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    
                    <div className="grid grid-cols-1 gap-6">
                      {/* Good Column */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-emerald-500 dark:text-emerald-400" />
                          <h3 className="font-display font-medium text-sm md:text-base uppercase tracking-wider text-foreground">What's Working Well</h3>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          {analysis.good.map((item, i) => (
                            <div key={i} className="text-foreground/80 font-light flex items-start gap-2 md:gap-3">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 dark:bg-emerald-400 shrink-0" />
                              <span className="leading-snug text-xs md:text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Bad Column */}
                      <div>
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <XCircle className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />
                          <h3 className="font-display font-medium text-sm md:text-base uppercase tracking-wider text-foreground">Areas to Improve</h3>
                        </div>
                        <div className="space-y-2 md:space-y-3">
                          {analysis.bad.map((item, i) => (
                            <div key={i} className="text-foreground/70 font-light flex items-start gap-2 md:gap-3">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-border shrink-0" />
                              <span className="leading-snug text-xs md:text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 md:pt-6 border-t border-border">
                      <div className="flex items-center gap-2 mb-3 md:mb-4">
                        <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-accent dark:text-accent" />
                        <h3 className="font-display font-medium text-sm md:text-base uppercase tracking-wider text-foreground">Pro Tips for Next Time</h3>
                      </div>
                      <div className="space-y-2 md:space-y-3">
                        {analysis.tips.map((tip, i) => (
                          <div key={i} className="text-foreground/80 font-light flex items-start gap-2 md:gap-3">
                            <span className="mt-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center text-[10px] md:text-xs shrink-0 font-medium">
                              {i + 1}
                            </span>
                            <span className="leading-snug text-xs md:text-sm">{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="mt-6 md:mt-8 pt-4 md:pt-8 flex items-center justify-between border-t border-border">
                    <button className="text-[10px] md:text-xs uppercase tracking-widest font-display text-muted-foreground hover:text-foreground transition-colors" onClick={reset}>
                      Test Another
                    </button>
                    <button className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs uppercase tracking-widest font-display text-foreground hover:text-foreground/80 transition-colors group">
                      Export Report <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[30vh] lg:h-full flex flex-col items-center justify-center p-4 md:p-8 text-center opacity-40">
                  <BarChart3 className="w-10 h-10 md:w-16 md:h-16 mb-4 md:mb-6 stroke-1 text-foreground" />
                  <h3 className="font-display text-lg md:text-2xl mb-2 md:mb-3 uppercase tracking-widest text-foreground">Awaiting Analysis</h3>
                  <p className="font-light max-w-sm leading-relaxed text-foreground text-xs md:text-base px-4">
                    Upload your content to reveal virality score, retention breakdown, and expert hooks.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
      
      {/* Footer Text */}
      <div className="relative z-10 py-3 md:py-6 text-center text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-display flex-shrink-0 bg-background/80 backdrop-blur-sm">
        Generated based on your past 3-month performance, and Creators in your same category.
      </div>
    </div>
  );
}