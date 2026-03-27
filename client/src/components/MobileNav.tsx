import { Home, Users, MonitorCheck, User } from "lucide-react";
import { useLocation } from "wouter";

export default function MobileNav() {
  const [location, setLocation] = useLocation();

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-[2rem] flex items-center justify-between px-2 py-2 w-full max-w-[340px] shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] pointer-events-auto">
        <button 
          onClick={() => setLocation('/')} 
          className={`transition-all duration-300 flex items-center justify-center w-[4.5rem] h-12 rounded-2xl ${location === '/' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
        >
          <Home className="w-6 h-6" strokeWidth={location === '/' ? 2 : 1.5} />
        </button>
        <button 
          className={`transition-all duration-300 flex items-center justify-center w-[4.5rem] h-12 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary/50`}
        >
          <Users className="w-6 h-6" strokeWidth={1.5} />
        </button>
        <button 
          onClick={() => setLocation('/pricing')}
          className={`transition-all duration-300 flex items-center justify-center w-[4.5rem] h-12 rounded-2xl ${location === '/pricing' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}
        >
          <MonitorCheck className="w-6 h-6" strokeWidth={location === '/pricing' ? 2 : 1.5} />
        </button>
        <button 
          className={`transition-all duration-300 flex items-center justify-center w-[4.5rem] h-12 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-secondary/50`}
        >
          <User className="w-6 h-6" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
