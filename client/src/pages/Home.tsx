import { useState, useRef, useEffect } from "react";
import { Upload, Play, CheckCircle2, AlertCircle, XCircle, ChevronRight, BarChart3, Clock, LayoutGrid, Tag, Video, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Use the attached image as background
import bgImage from "@assets/image_1772140166769.png";

type AnalysisResult = {
  score: number;
  verdict: string;
  topic: string;
  category: string;
  summary: string;
  format: string;
  length: string;
  good: string[];
  bad: string[];
  tips: string[];
  benchmarks: { text: string; views: string }[];
};

const MOCK_ANALYSIS: AnalysisResult = {
  score: 85,
  verdict: "Strong hook — ready to post",
  topic: "Gaming Stream Drama",
  category: "Gaming",
  summary: "An incredibly engaging vlog-style transformation at a premium Korean hair salon. The pacing is snappy, the hooks are immediately captivating, and the final reveal drives strong viewer satisfaction and re-watchability.",
  format: "Video",
  length: "52s",
  good: [
    "Open loop is airtight — \"something just went wrong\" withholds the payoff and forces completion.",
    "\"72 hours\" is a specific number that signals authenticity — outperforms vague claims with Gen Z audiences.",
    "Matches the 2026 raw content trend — unfiltered, high-stakes streaming drama is peaking in Gaming right now."
  ],
  bad: [
    "\"Something went wrong\" is vague — hinting at the type of problem (a ban, gear failure, health scare) would sharpen the hook further.",
    "High drop-off risk if your opening frame doesn't match the energy of this hook — you need an immediate visual payoff in the first 2 seconds."
  ],
  tips: [
    "Add one specific detail — try: \"…and my stream just got permanently banned.\" Specificity drives 30–40% higher retention in Gaming content.",
    "Open on your reaction face, not the setup — your expression in the first frame should match the stakes of the hook.",
    "Test a POV version: \"POV: hour 72 of my stream and everything just fell apart\" — POV format is outperforming standard hooks in Gaming TikTok this week."
  ],
  benchmarks: [
    { text: "\"Chat told me to do this and I actually did it…\"", views: "4.2M views" },
    { text: "\"I haven't slept in 3 days because of this game\"", views: "3.8M views" },
    { text: "\"My Twitch chat just changed my life by accident\"", views: "2.9M views" }
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
                  className="h-full flex flex-col relative bg-[#0f0f0f]/95 border border-border/40 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-2xl max-w-[600px] mx-auto w-full"
                  data-testid="analysis-results"
                >
                  {/* Hero Section */}
                  <div className="flex flex-col-reverse md:flex-row md:items-start justify-between gap-6 md:gap-4 mb-8">
                    <div className="flex-1">
                      <div className="text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3 font-display">Hook analysis</div>
                      <div className="text-[15px] text-muted-foreground/90 italic border-l-2 border-border/60 pl-3 leading-relaxed mb-4">
                        "{hookText || "I've been streaming for 72 hours straight and something just went wrong…"}"
                      </div>
                      <div className="inline-flex items-center text-[13px] font-medium text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">
                        {analysis.verdict}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-start md:items-end flex-shrink-0">
                      <div className="text-[10px] tracking-[0.1em] uppercase text-muted-foreground mb-1 font-display">Virality Score</div>
                      <div className="flex items-baseline">
                        <span className={`text-[64px] font-medium leading-none tracking-tight ${getScoreColor(analysis.score)}`}>
                          {analysis.score}
                        </span>
                        <span className="text-[20px] text-muted-foreground/60 ml-1">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Bars */}
                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground w-[120px] flex-shrink-0">Curiosity gap</div>
                      <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <div className="text-[11px] text-muted-foreground w-6 text-right flex-shrink-0">90</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground w-[120px] flex-shrink-0">Emotional stakes</div>
                      <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                      <div className="text-[11px] text-muted-foreground w-6 text-right flex-shrink-0">82</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground w-[120px] flex-shrink-0">Trend alignment</div>
                      <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      <div className="text-[11px] text-muted-foreground w-6 text-right flex-shrink-0">88</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground w-[120px] flex-shrink-0">Pacing & rhythm</div>
                      <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                      <div className="text-[11px] text-muted-foreground w-6 text-right flex-shrink-0">75</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground w-[120px] flex-shrink-0">Specificity</div>
                      <div className="flex-1 h-1.5 bg-border/40 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                      <div className="text-[11px] text-muted-foreground w-6 text-right flex-shrink-0">58</div>
                    </div>
                  </div>

                  <hr className="border-t border-border/40 my-6" />

                  <div className="space-y-8 flex-1 overflow-y-visible md:overflow-y-auto md:pr-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                    
                    {/* What's Working */}
                    <div>
                      <div className="flex items-center gap-2 mb-3.5 text-emerald-400">
                        <div className="w-[18px] h-[18px] rounded-full bg-emerald-400/15 flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                        <h3 className="font-medium text-xs tracking-[0.08em] uppercase">What's Working</h3>
                      </div>
                      <ul className="flex flex-col gap-2.5">
                        {analysis.good.map((item, i) => (
                          <li key={i} className="flex gap-2.5 text-[13px] text-foreground/80 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-1.5"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <hr className="border-t border-border/40" />

                    {/* Areas to Improve */}
                    <div>
                      <div className="flex items-center gap-2 mb-3.5 text-amber-400">
                        <div className="w-[18px] h-[18px] rounded-full bg-amber-400/15 flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-2.5 h-2.5" />
                        </div>
                        <h3 className="font-medium text-xs tracking-[0.08em] uppercase">Areas to Improve</h3>
                      </div>
                      <ul className="flex flex-col gap-2.5">
                        {analysis.bad.map((item, i) => (
                          <li key={i} className="flex gap-2.5 text-[13px] text-foreground/80 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0 mt-1.5"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <hr className="border-t border-border/40" />

                    {/* Pro Tips */}
                    <div>
                      <div className="flex items-center gap-2 mb-3.5 text-blue-400">
                        <div className="w-[18px] h-[18px] rounded-full bg-blue-400/15 flex items-center justify-center flex-shrink-0">
                          <ChevronRight className="w-2.5 h-2.5" />
                        </div>
                        <h3 className="font-medium text-xs tracking-[0.08em] uppercase">Pro Tips for Next Time</h3>
                      </div>
                      <ol className="flex flex-col gap-3">
                        {analysis.tips.map((tip, i) => (
                          <li key={i} className="flex gap-3 items-start">
                            <div className="text-[12px] font-medium text-blue-400 bg-blue-400/10 w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </div>
                            <div className="text-[13px] text-foreground/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: tip.replace(/"([^"]+)"/g, '<em>"$1"</em>') }} />
                          </li>
                        ))}
                      </ol>
                    </div>

                    <hr className="border-t border-border/40" />

                    {/* Benchmarks */}
                    <div>
                      <div className="flex items-center gap-2 mb-3.5 text-muted-foreground/80">
                        <div className="w-[18px] h-[18px] rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <LayoutGrid className="w-2.5 h-2.5 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-xs tracking-[0.08em] uppercase">Top Hooks in {analysis.category} This Week</h3>
                      </div>
                      <div className="flex flex-col">
                        {analysis.benchmarks.map((bench, i) => (
                          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
                            <div className="text-xs text-muted-foreground/60 w-4 flex-shrink-0">{i + 1}</div>
                            <div className="flex-1 text-[13px] text-muted-foreground/90 italic truncate pr-2">{bench.text}</div>
                            <div className="text-[11px] text-muted-foreground/80 bg-secondary/80 px-2 py-0.5 rounded-full flex-shrink-0">{bench.views}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <button 
                    className="w-full py-3 mt-8 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98] rounded-xl shadow-sm transition-all"
                    onClick={reset}
                  >
                    Test another hook
                  </button>
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