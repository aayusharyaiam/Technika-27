import { useId } from "react";
import { Sparkles } from "lucide-react";

export function SnitchArtwork({ className = "" }: { className?: string }) {
  const id = useId().replaceAll(":", "");
  return (
    <svg className={className} viewBox="0 0 160 76" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-orb`} cx=".32" cy=".23" r=".8"><stop stopColor="#fff2bf" /><stop offset=".35" stopColor="#ecc25e" /><stop offset=".75" stopColor="#b58126" /><stop offset="1" stopColor="#5e3b10" /></radialGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fbf4d8" /><stop offset="1" stopColor="#bdb194" stopOpacity=".5" /></linearGradient>
      </defs>
      <g className="snitch-wing snitch-wing-left">
        <path d="M65 39C48 17 19 8 4 12c3 16 26 32 60 34" fill={`url(#${id}-wing)`} stroke="#ead6a3" strokeWidth=".7" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${9 + i * 8} ${14 + i * 2}Q${27 + i * 6} ${33 + i} 65 42`} stroke="#8f815f" strokeWidth=".8" />)}
      </g>
      <g className="snitch-wing snitch-wing-right">
        <path d="M95 39c17-22 46-31 61-27-3 16-26 32-60 34" fill={`url(#${id}-wing)`} stroke="#ead6a3" strokeWidth=".7" />
        {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${151 - i * 8} ${14 + i * 2}Q${133 - i * 6} ${33 + i} 95 42`} stroke="#8f815f" strokeWidth=".8" />)}
      </g>
      <circle cx="80" cy="43" r="17" fill={`url(#${id}-orb)`} stroke="#f9d987" />
      <path d="M71 30c-4 13 0 22 9 29m9-29c4 13 0 22-9 29M64 39c9 5 23 5 32 0m-31 9c8-3 22-3 30 0" stroke="#866126" strokeWidth="1.3" />
      <path d="M71 32c2-3 5-4 8-4" stroke="#fff8d8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`eyebrow ${className}`}><Sparkles size={12} strokeWidth={1.5} />{children}</span>;
}

export function Divider({ className = "" }: { className?: string }) {
  return <div className={`ornament-divider ${className}`} aria-hidden="true"><span /><i>✦</i><span /></div>;
}

export function AmbientParticles({ count = 20 }: { count?: number }) {
  return <div className="ambient-particles" aria-hidden="true">{Array.from({ length: count }, (_, i) => <i key={i} style={{ left: `${(i * 43 + 7) % 100}%`, top: `${(i * 37 + 13) % 100}%`, animationDelay: `${i * -.74}s`, animationDuration: `${5 + i % 6}s`, width: i % 3 === 0 ? 3 : 2, height: i % 3 === 0 ? 3 : 2 }} />)}</div>;
}
