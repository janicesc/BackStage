import { Check, Star, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Pricing() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    // Sync with the app theme
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

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

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <header className="relative z-10 p-4 md:p-6 flex items-center justify-between border-b border-border backdrop-blur-md bg-background/50">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.location.href = '/'}>
          <div className="w-6 h-6 md:w-8 md:h-8 bg-foreground text-background flex items-center justify-center font-display font-bold text-sm md:text-xl rounded-sm">B</div>
          <span className="font-display text-lg md:text-xl tracking-widest uppercase">BackStage</span>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden sm:block text-xs md:text-sm text-muted-foreground tracking-wide uppercase font-medium cursor-pointer hover:text-foreground transition-colors" onClick={() => window.location.href = '/'}>Home</div>
          <button 
            onClick={toggleTheme}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-border flex items-center justify-center bg-card hover:bg-secondary transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3 h-3 md:w-4 md:h-4 text-foreground" /> : <Moon className="w-3 h-3 md:w-4 md:h-4 text-foreground" />}
          </button>
        </div>
      </header>

      <div className="absolute inset-0 z-0 pointer-events-none mt-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full px-6 py-12 md:py-24 flex-1">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-tight">Stop Scrolling.<br/>Start Converting.</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
            Choose the plan that fits your content strategy. Test your hooks, boost retention, and go viral.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Free Tier */}
          <div className="bg-card/30 border border-border rounded-2xl p-8 backdrop-blur-sm flex flex-col hover:border-foreground/20 transition-colors shadow-sm">
            <div className="mb-8">
              <h3 className="font-display text-xl uppercase tracking-wider mb-2">BackStage Free</h3>
              <div className="text-3xl font-display font-medium mb-2">$0<span className="text-sm text-muted-foreground font-sans font-light">/forever</span></div>
              <p className="text-sm text-muted-foreground font-light">Perfect for getting started.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground/50 shrink-0 mt-0.5" />
                <span>10 Hook Tests total</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground/50 shrink-0 mt-0.5" />
                <span>Basic Virality Score</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light text-muted-foreground">
                <Check className="w-4 h-4 opacity-50 shrink-0 mt-0.5" />
                <span>Standard pacing analysis</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full rounded-full bg-transparent border-border hover:bg-secondary">
              Start Free
            </Button>
          </div>

          {/* Basic Tier */}
          <div className="bg-card/30 border border-border rounded-2xl p-8 backdrop-blur-sm flex flex-col hover:border-foreground/20 transition-colors relative overflow-hidden shadow-sm">
            <div className="mb-8 relative z-10">
              <h3 className="font-display text-xl uppercase tracking-wider mb-2">Creator</h3>
              <div className="text-3xl font-display font-medium mb-2">$9<span className="text-sm text-muted-foreground font-sans font-light">/mo</span></div>
              <p className="text-sm text-muted-foreground font-light">For the consistent poster.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>50 Hook Tests per month</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>Advanced pacing insights</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>Caption optimization</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 relative z-10 border-transparent shadow-sm">
              Upgrade to Creator
            </Button>
          </div>

          {/* Plus Tier - Highlighted */}
          <div className="bg-card/80 border border-accent rounded-2xl p-8 backdrop-blur-md flex flex-col relative overflow-hidden shadow-[0_0_30px_-10px_rgba(234,255,0,0.3)] dark:shadow-[0_0_40px_-15px_rgba(234,255,0,0.15)] transform md:-translate-y-4">
            <div className="absolute top-0 inset-x-0 h-1 bg-accent" />
            <div className="absolute top-4 right-4 bg-accent/20 text-accent text-[10px] uppercase tracking-widest px-2 py-1 rounded font-medium flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> Most Popular
            </div>
            
            <div className="mb-8 relative z-10">
              <h3 className="font-display text-xl uppercase tracking-wider mb-2">Influencer</h3>
              <div className="text-4xl font-display font-medium mb-2 text-foreground">$29<span className="text-sm text-muted-foreground font-sans font-light">/mo</span></div>
              <p className="text-sm text-muted-foreground font-light">Grow your audience faster.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1 relative z-10">
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Unlimited Hook Tests</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Deep competitor benchmarking</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>A/B test up to 3 hooks</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span>Trend forecasting alerts</span>
              </li>
            </ul>
            
            <Button className="w-full rounded-full bg-accent text-accent-foreground hover:bg-accent/90 relative z-10 border-transparent font-medium shadow-[0_0_20px_-5px_rgba(234,255,0,0.4)]">
              Get Influencer
            </Button>
          </div>

          {/* Premium Tier */}
          <div className="bg-card/30 border border-border rounded-2xl p-8 backdrop-blur-sm flex flex-col hover:border-foreground/20 transition-colors shadow-sm">
            <div className="mb-8">
              <h3 className="font-display text-xl uppercase tracking-wider mb-2">Agency</h3>
              <div className="text-3xl font-display font-medium mb-2">$99<span className="text-sm text-muted-foreground font-sans font-light">/mo</span></div>
              <p className="text-sm text-muted-foreground font-light">For teams managing multiple accounts.</p>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>Everything in Influencer</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>Up to 5 Creator Profiles</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>White-label PDF Reports</span>
              </li>
              <li className="flex items-start gap-3 text-sm font-light">
                <Check className="w-4 h-4 text-foreground shrink-0 mt-0.5" />
                <span>API Access</span>
              </li>
            </ul>
            
            <Button variant="outline" className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90 border-transparent shadow-sm">
              Upgrade to Agency
            </Button>
          </div>

        </div>
      </div>
      
      {/* Footer Text */}
      <div className="relative z-10 py-3 md:py-6 text-center text-[8px] md:text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-display flex-shrink-0 bg-background/80 backdrop-blur-sm border-t border-border mt-auto">
        Powered by BackStage Insights™
      </div>
    </div>
  );
}