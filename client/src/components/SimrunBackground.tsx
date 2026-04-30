import { useMemo } from "react";

type Star = {
  left: string;
  top: string;
  size: string;
  delay: string;
  duration: string;
};

export function SimrunBackground() {
  const stars = useMemo<Star[]>(
    () =>
      Array.from({ length: 70 }).map(() => {
        const size = (Math.random() * 1.4 + 0.5).toFixed(2);
        return {
          left: `${(Math.random() * 100).toFixed(2)}%`,
          top: `${(Math.random() * 100).toFixed(2)}%`,
          size: `${size}px`,
          delay: `${(Math.random() * 4).toFixed(2)}s`,
          duration: `${(Math.random() * 2 + 2).toFixed(2)}s`,
        };
      }),
    [],
  );

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[radial-gradient(ellipse_at_center,_#f7f9ff_0%,_#eef2ff_72%)] dark:bg-[radial-gradient(ellipse_at_center,_#0a1612_0%,_#03060a_75%)]">
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-emerald-400/35 dark:bg-[#aaffb5] opacity-20 animate-[simrun-twinkle_4s_ease-in-out_infinite]"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
