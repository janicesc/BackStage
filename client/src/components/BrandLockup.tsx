import { useEffect, useRef } from "react";

type RingKey = "outer" | "mid" | "inner" | "core" | "dot";

const RING_CONFIG: Array<{
  key: RingKey;
  amp: number;
  jitter: number;
  resp: number;
  phase: number;
  baseR: number;
  fill: string;
}> = [
  { key: "outer", amp: 0.1, jitter: 5, resp: 0.55, phase: 1.1, baseR: 180, fill: "#0d3f0d" },
  { key: "mid", amp: 0.28, jitter: 8, resp: 0.3, phase: 2.7, baseR: 135, fill: "#167a16" },
  { key: "inner", amp: 0.55, jitter: 10, resp: 0.18, phase: 4.3, baseR: 90, fill: "#2bd62b" },
  { key: "core", amp: 0.8, jitter: 9, resp: 0.1, phase: 5.9, baseR: 55, fill: "#6dff80" },
  { key: "dot", amp: 1, jitter: 0, resp: 0, phase: 0, baseR: 22, fill: "#050505" },
];

function noise(t: number, seed: number) {
  return (
    Math.sin(t * 0.31 + seed * 1.7) * 0.5 +
    Math.sin(t * 0.73 + seed * 3.1) * 0.3 +
    Math.sin(t * 1.27 + seed * 5.3) * 0.15
  );
}

export function BrandLockup() {
  const ringRefs = useRef<Record<RingKey, SVGCircleElement | null>>({
    outer: null,
    mid: null,
    inner: null,
    core: null,
    dot: null,
  });

  useEffect(() => {
    const centerX = 250;
    const centerY = 250;
    const scale = 110;

    const state = RING_CONFIG.map(() => ({ x: centerX, y: centerY }));
    let rafId = 0;
    let lastTime = 0;
    const start = performance.now();

    const animate = (now: number) => {
      const time = (now - start) / 1000;
      const dt = lastTime ? Math.min(0.1, (now - lastTime) / 1000) : 1 / 60;
      lastTime = now;

      const dotDriftX = scale * noise(time, 1.0);
      const dotDriftY = scale * noise(time, 5.0);

      RING_CONFIG.forEach((ring, i) => {
        const node = ringRefs.current[ring.key];
        if (!node) return;

        const tx = centerX + ring.amp * dotDriftX + ring.jitter * noise(time * 1.4, ring.phase + 11);
        const ty = centerY + ring.amp * dotDriftY + ring.jitter * noise(time * 1.4, ring.phase + 21);

        if (ring.resp <= 0) {
          state[i].x = tx;
          state[i].y = ty;
        } else {
          const smoothFactor = 1 - Math.exp(-dt / ring.resp);
          state[i].x += (tx - state[i].x) * smoothFactor;
          state[i].y += (ty - state[i].y) * smoothFactor;
        }

        const breathe = 1 + 0.04 * Math.sin(time * Math.PI + i * 0.08);
        node.setAttribute("cx", state[i].x.toFixed(2));
        node.setAttribute("cy", state[i].y.toFixed(2));
        node.setAttribute("r", (ring.baseR * breathe).toFixed(2));
      });

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="flex items-center gap-0.5 md:gap-1 cursor-pointer" onClick={() => (window.location.href = "/")}>
      <div className="relative h-[46px] w-[46px] md:h-[54px] md:w-[54px] lg:h-[60px] lg:w-[60px] shrink-0 rounded-full">
        <div className="absolute inset-[12%] rounded-full bg-[#3fff5a]/26 blur-lg" />
        <svg viewBox="0 0 500 500" role="img" aria-label="simrun" className="relative h-full w-full">
          <defs>
            <filter id="simrun-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {RING_CONFIG.map((ring) => (
            <circle
              key={ring.key}
              ref={(el) => {
                ringRefs.current[ring.key] = el;
              }}
              cx="250"
              cy="250"
              r={ring.baseR}
              fill={ring.fill}
              filter={ring.key === "inner" || ring.key === "core" ? "url(#simrun-glow)" : undefined}
            />
          ))}
        </svg>
      </div>

      <div className="leading-none -ml-1 md:-ml-1.5 translate-y-[0.25px]">
        <div className="font-display text-[1.28rem] md:text-[1.62rem] font-bold tracking-[-0.016em] lowercase text-foreground/98">
          simrun
        </div>
        <div className="mt-[1px] flex items-center">
          <div className="font-ui text-[5.7px] md:text-[6.3px] font-medium tracking-[0.12em] text-foreground/80 uppercase">
            synthetic audience
          </div>
        </div>
      </div>
    </div>
  );
}
