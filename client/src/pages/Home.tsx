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
  score: 94,
  topic: "Celebrity Salon Hair Transformation",
  category: "Beauty & Lifestyle",
  summary: "An incredibly engaging vlog-style transformation at a premium Korean hair salon. The pacing is snappy, the hooks are immediately captivating, and the final reveal drives strong viewer satisfaction and re-watchability.",
  format: "Video",
  length: "52s",
  good: [
    "The first 3 seconds hook the viewer instantly with a bold visual change and fast motion.",
    "The pacing is perfect, keeping the viewer engaged through the entire process without dragging.",
    "The final reveal is striking, clearly demonstrates value, and encourages shares and saves."
  ],
  bad: [
    "The music could be slightly louder during the transformation montage to build more excitement.",
    "A few of the text overlays fade out a bit too quickly for slower readers.",
    "The final call-to-action could be more direct about saving the video for future reference."
  ],
  tips: [
    "Increase audio levels by 10-15% during the high-energy transformation sequence.",
    "Extend the duration of text overlays by 0.5 seconds.",
    "Add a clear verbal or visual CTA at the end like 'Save this for your next trip to Seoul!'."
  ]
};

const INITIAL_CAPTION = `Visiting one of the best beauty salons in Korea, Chahong Ardor Flagship in 🇰🇷 All their hairstylists are amazing and have great techniques. Above all they have the best vibes!!! Here come all the famous Korean TV, kpop and kdramas artists 💕 My stylist was and I loved her ❤️ Follow her for hair tips ✨ If you travel to Korea and don't go to a Korea Hair Salon... did you really go to Korea? 🤯 I just went with a friend and they treated me amazing!!!! Thank you for the complementary service, they made me feel like a. ❤️ @Yun jin _ Chahong@차홍 CHAHONG OFFICIAL#celebrityhairstylist#hairstylisttips`;

export default function Home() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [hookText, setHookText] = useState('');
  const [platform, setPlatform] = useState('');
  const [category, setCategory] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

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

  const handleAnalyze = () => {
    if (!hookText || !platform || !category) return;
    
    setIsUploading(true);
    setProgress(0);
    
    // Mock analyze process
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
    setHookText('');
    setPlatform('');
    setCategory('');
    setHashtags('');
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

            <div className="bg-card/40 border border-border rounded-[1.25rem] p-6 lg:p-8 backdrop-blur-xl relative shadow-sm max-w-[560px] mx-auto lg:mx-0 w-full">
              <div className="space-y-6">
                {/* Field 1: Hook */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest block mb-1 font-display">Your hook</label>
                  <textarea 
                    className="w-full bg-background border border-border/80 rounded-xl p-3 md:p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 resize-none transition-all shadow-sm"
                    rows={4}
                    placeholder='Describe your opening line or video concept — e.g. "I tried every viral breakfast hack so you don&apos;t have to…"'
                    value={hookText}
                    onChange={(e) => setHookText(e.target.value)}
                    disabled={isUploading}
                    data-testid="input-hook"
                  />
                  <p className="text-[12px] text-muted-foreground font-light pt-1">Write it like you'd actually say it on camera.</p>
                </div>

                {/* Field 2 & 3: Platform and Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest block mb-1 font-display">Platform</label>
                    <select 
                      className="w-full bg-background border border-border/80 rounded-xl p-3 md:p-3.5 text-sm text-foreground focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 transition-all appearance-none cursor-pointer shadow-sm disabled:opacity-50"
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      disabled={isUploading}
                      data-testid="select-platform"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                    >
                      <option value="" disabled>Select platform</option>
                      <option value="tiktok">TikTok</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest block mb-1 font-display">Content category</label>
                    <select 
                      className="w-full bg-background border border-border/80 rounded-xl p-3 md:p-3.5 text-sm text-foreground focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 transition-all appearance-none cursor-pointer shadow-sm disabled:opacity-50"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      disabled={isUploading}
                      data-testid="select-category"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.5)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '16px' }}
                    >
                      <option value="" disabled>Select category</option>
                      <optgroup label="Entertainment">
                        <option value="cosplay">🎭 Cosplay</option>
                        <option value="dance">💃 Dance</option>
                        <option value="music">🎵 Music</option>
                        <option value="vocal">🎤 Vocal / Singing</option>
                        <option value="comedy">😂 Comedy & Pranks</option>
                        <option value="film">🎬 Film & TV</option>
                        <option value="sports">⚽ Sports</option>
                      </optgroup>
                      <optgroup label="Style & Beauty">
                        <option value="fashion">👗 Fashion</option>
                        <option value="beauty">💄 Beauty & Makeup</option>
                        <option value="fitness">💪 Fitness</option>
                        <option value="wellness">🧘 Self-Care & Wellness</option>
                      </optgroup>
                      <optgroup label="Gaming & Culture">
                        <option value="gaming">🎮 Gaming</option>
                        <option value="anime">🌸 Anime & Manga</option>
                        <option value="kpop">🎯 K-pop</option>
                      </optgroup>
                      <optgroup label="Identity & Culture">
                        <option value="latino">🌎 Latino</option>
                        <option value="asian">🌏 Asian</option>
                        <option value="black">✊ Black</option>
                        <option value="lgbtq">🏳️‍🌈 LGBTQ+</option>
                      </optgroup>
                      <optgroup label="Lifestyle">
                        <option value="vlog">🌿 Lifestyle & Vlog</option>
                        <option value="travel">🎒 Travel</option>
                        <option value="food">🍳 Food & Cooking</option>
                        <option value="pets">🐾 Pets</option>
                        <option value="parenting">👶 Parenting & Family</option>
                      </optgroup>
                      <optgroup label="Creative & Education">
                        <option value="art">🎨 Art & Design</option>
                        <option value="diy">✂️ DIY & Crafts</option>
                        <option value="books">📚 Books & Reading</option>
                        <option value="advice">💡 Advice & Education</option>
                        <option value="plants">🌱 Plants & Nature</option>
                      </optgroup>
                      <option value="other">＋ Other</option>
                    </select>
                  </div>
                </div>

                {/* Field 4: Hashtag */}
                <div className="space-y-1.5 pb-2">
                  <label className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest block mb-1 font-display">Hashtag</label>
                  <input 
                    type="text"
                    className="w-full bg-background border border-border/80 rounded-xl p-3 md:p-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/30 transition-all shadow-sm"
                    placeholder="#foodtok, #grwm, #gamingsetup"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    disabled={isUploading}
                    data-testid="input-hashtags"
                  />
                  <p className="text-[12px] text-muted-foreground font-light pt-1">Add 1–3 tags your audience would actually search.</p>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  {isUploading ? (
                    <div className="space-y-3 bg-secondary/30 p-4 rounded-xl border border-border/50">
                      <div className="flex justify-between text-[11px] font-display uppercase tracking-widest text-foreground">
                        <span className="animate-pulse">Analyzing Hook...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-background/50" />
                    </div>
                  ) : (
                    <button 
                      className="w-full py-3.5 md:py-4 px-4 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:bg-foreground"
                      onClick={handleAnalyze}
                      disabled={!hookText || !platform || !category}
                      data-testid="btn-analyze"
                    >
                      Analyze my hook
                    </button>
                  )}
                </div>
              </div>
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
                      Test Another Hook
                    </button>
                    <button className="flex items-center gap-1 md:gap-2 text-[10px] md:text-xs uppercase tracking-widest font-display text-foreground hover:text-foreground/80 transition-colors group">
                      Export Report <ChevronRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-[30vh] lg:h-full"></div>
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