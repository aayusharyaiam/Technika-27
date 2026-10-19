"use client";

import { useId } from "react";

export interface LoadingSceneProps {
  className?: string;
}

const stars = [
  [94, 92, 2.2],
  [174, 184, 1.6],
  [258, 74, 1.8],
  [342, 156, 2.6],
  [432, 94, 1.4],
  [518, 205, 2],
  [612, 116, 1.5],
  [702, 62, 2.5],
  [794, 166, 1.7],
  [884, 92, 1.5],
  [956, 220, 2.4],
  [1046, 72, 1.6],
  [1144, 130, 2.2],
  [1298, 70, 1.5],
  [1408, 216, 2.1],
  [1490, 102, 1.8],
  [1528, 286, 1.4],
];

const trees = [
  { x: -48, y: 578, scale: 1.3, opacity: 0.98 },
  { x: 94, y: 632, scale: 0.86, opacity: 0.92 },
  { x: 1300, y: 604, scale: 1.04, opacity: 0.96 },
  { x: 1436, y: 546, scale: 1.34, opacity: 1 },
  { x: 1550, y: 624, scale: 0.88, opacity: 0.9 },
];

export function LoadingScene({ className = "" }: LoadingSceneProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");

  return (
    <div className={`loading-scene ${className}`.trim()} aria-hidden="true">
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        aria-hidden="true"
        focusable="false"
        style={{ display: "block", width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#070b1d" />
            <stop offset="0.58" stopColor="#121d3a" />
            <stop offset="1" stopColor="#312743" />
          </linearGradient>
          <radialGradient id={`${id}-moon`} cx="35%" cy="30%" r="72%">
            <stop offset="0" stopColor="#fffbe8" />
            <stop offset="0.5" stopColor="#f5dca0" />
            <stop offset="1" stopColor="#c28f58" />
          </radialGradient>
          <radialGradient id={`${id}-moon-glow`}>
            <stop offset="0" stopColor="#ffe7a1" stopOpacity="0.3" />
            <stop offset="0.58" stopColor="#e2b46d" stopOpacity="0.1" />
            <stop offset="1" stopColor="#e2b46d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${id}-mountain-back`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#263453" />
            <stop offset="1" stopColor="#161d35" />
          </linearGradient>
          <linearGradient id={`${id}-mountain-front`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#1a253d" />
            <stop offset="1" stopColor="#0c1228" />
          </linearGradient>
          <linearGradient id={`${id}-castle`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#39415d" />
            <stop offset="1" stopColor="#12182d" />
          </linearGradient>
          <linearGradient id={`${id}-tree`} x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="#182744" />
            <stop offset="1" stopColor="#050a18" />
          </linearGradient>
          <linearGradient id={`${id}-owl`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#f2e8c7" />
            <stop offset="1" stopColor="#b58b66" />
          </linearGradient>
          <filter id={`${id}-soft-glow`} x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="16" />
          </filter>
          <filter id={`${id}-star-glow`} x="-200%" y="-200%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Deep blue night sky */}
        <g className="loading-layer loading-layer-sky">
          <rect width="1600" height="900" fill={`url(#${id}-sky)`} />
          <path
            d="M0 395C220 355 334 422 540 390c213-33 346-12 511 16 209 35 344 0 549-38v204H0Z"
            fill="#111b35"
            opacity="0.48"
          />
        </g>

        {/* Constellations and distant starlight */}
        <g className="loading-layer loading-layer-stars">
          <g fill="#fff5c8">
            {stars.map(([cx, cy, radius], index) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={radius} opacity={index % 3 === 0 ? 0.95 : 0.72} />
            ))}
          </g>
          <g fill="#ffe9a5" opacity="0.45" filter={`url(#${id}-star-glow)`}>
            {stars.slice(0, 7).map(([cx, cy, radius]) => (
              <circle key={`glow-${cx}-${cy}`} cx={cx} cy={cy} r={radius + 3} />
            ))}
          </g>
          <g fill="none" stroke="#c7d0e4" strokeWidth="1" opacity="0.25">
            <path d="M174 184L258 74L342 156L432 94" />
            <path d="M1046 72L1144 130L1298 70" />
          </g>
        </g>

        {/* Moon and its halo */}
        <g className="loading-layer loading-layer-moon">
          <circle cx="1252" cy="174" r="176" fill={`url(#${id}-moon-glow)`} filter={`url(#${id}-soft-glow)`} />
          <circle cx="1252" cy="174" r="82" fill={`url(#${id}-moon)`} />
          <path
            d="M1287 97c-20 10-35 31-35 57 0 45 36 81 81 81 19 0 37-7 51-19-16 34-50 58-90 58-55 0-100-45-100-100 0-52 40-95 93-100Z"
            fill="#0d1630"
            opacity="0.78"
          />
          <g fill="#b68858" opacity="0.28">
            <circle cx="1219" cy="143" r="9" />
            <circle cx="1274" cy="126" r="6" />
            <circle cx="1237" cy="201" r="5" />
          </g>
        </g>

        {/* Distant mountains */}
        <g className="loading-layer loading-layer-mountains">
          <path
            d="M0 570 180 386l104 110 152-188 185 210 170-160 154 145 173-226 158 176 159-112 165 229v330H0Z"
            fill={`url(#${id}-mountain-back)`}
          />
          <path
            d="m0 610 205-160 100 72 132-112 170 160 166-125 115 83 198-189 121 150 164-105 129 167v250H0Z"
            fill={`url(#${id}-mountain-front)`}
            opacity="0.95"
          />
          <g fill="#a7b7d3" opacity="0.18">
            <path d="m284 308 152-188 185 210-100-111-69 75-58-38Z" />
            <path d="m1106 271 173 196-89-85-63 53-42-50Z" />
          </g>
        </g>

        {/* Castle on the far ridge */}
        <g className="loading-layer loading-layer-castle">
          <g fill={`url(#${id}-castle)`} stroke="#a9a8b7" strokeOpacity="0.28" strokeWidth="2">
            <path d="M625 615V452l34-26 34 26v163Z" />
            <path d="M671 456v-93l22-32 22 32v93Z" />
            <path d="M726 615V397l47-36 47 36v218Z" />
            <path d="M773 401v-135l25-39 25 39v135Z" />
            <path d="M838 615V454l35-28 35 28v161Z" />
            <path d="M886 458v-102l23-33 23 33v102Z" />
            <path d="M682 615V528h165v87Z" />
            <path d="m616 454 43-62 43 62Z" />
            <path d="m714 400 59-82 59 82Z" />
            <path d="m830 457 43-65 43 65Z" />
          </g>
          <g fill="#f6cf7d" opacity="0.8">
            <path d="M683 481h13v23h-13zM786 426h14v25h-14zM891 483h13v24h-13z" />
            <path d="M732 545h13v25h-13zM774 545h13v25h-13zM816 545h13v25h-13z" />
          </g>
          <g fill="#d3ae70" opacity="0.7">
            <path d="M693 324h4v39h-4zM798 223h4v43h-4zM909 322h4v34h-4z" />
            <path d="m691 227 5 9 5-9Z" />
            <path d="m796 126 5 10 5-10Z" />
            <path d="m907 225 5 9 5-9Z" />
          </g>
        </g>

        {/* Mist around the castle foothills */}
        <g className="loading-layer loading-layer-mist" fill="none" stroke="#b5bed3" strokeLinecap="round" opacity="0.16">
          <path d="M304 646c150-42 260 23 390-7s263-30 392 6 260 32 410-9" strokeWidth="18" />
          <path d="M463 696c125-27 204 19 320-5s248-21 356 8 191 17 302-8" strokeWidth="10" />
        </g>

        {/* Small owl flying across the moonlit sky */}
        <g className="loading-layer loading-layer-owl" transform="translate(1050 355)" stroke="#332b3b" strokeWidth="4" strokeLinejoin="round">
          <path d="M0 20c-28-34-66-37-88-15 29 2 47 13 62 31Z" fill={`url(#${id}-owl)`} />
          <path d="M58 20c28-34 66-37 88-15-29 2-47 13-62 31Z" fill={`url(#${id}-owl)`} />
          <path d="M8 10c0-39 19-64 52-64s52 25 52 64c0 41-20 68-52 68S8 51 8 10Z" fill={`url(#${id}-owl)`} />
          <path d="m18-30 12-25 19 18M102-30 90-55 71-37" fill="#d5b37d" />
          <circle cx="38" cy="4" r="20" fill="#f7f0d8" />
          <circle cx="82" cy="4" r="20" fill="#f7f0d8" />
          <circle cx="40" cy="5" r="7" fill="#2b3348" stroke="none" />
          <circle cx="80" cy="5" r="7" fill="#2b3348" stroke="none" />
          <path d="m60 13 10 10-10 12-10-12Z" fill="#c78c50" />
          <path d="M38 43c11 9 33 9 44 0" fill="none" />
          <path d="M35 68 29 89M85 68l6 21" fill="none" />
        </g>

        {/* Foreground tree line */}
        <g className="loading-layer loading-layer-foreground">
          {trees.map((tree) => (
            <g
              key={`${tree.x}-${tree.y}`}
              transform={`translate(${tree.x} ${tree.y}) scale(${tree.scale})`}
              opacity={tree.opacity}
            >
              <path d="M78 288h22l-7-78h-8Z" fill="#080c1a" />
              <path d="M89 0 27 89h35L9 154h47L0 225h72v63h32v-63h72l-56-71h47l-53-65h35Z" fill={`url(#${id}-tree)`} />
              <path d="M89 30 61 89h18L48 139h30L23 207h52" fill="none" stroke="#455574" strokeOpacity="0.35" strokeWidth="4" />
            </g>
          ))}
          <path d="M0 845c205-35 325 9 488-18 177-29 309 12 492-7 221-23 385 26 620-14v94H0Z" fill="#050918" />
        </g>

        {/* Soft magical motes near the ground */}
        <g className="loading-layer loading-layer-motes" fill="#f5ca76">
          <circle cx="375" cy="735" r="3" opacity="0.72" />
          <circle cx="429" cy="680" r="2" opacity="0.58" />
          <circle cx="1191" cy="713" r="3" opacity="0.72" />
          <circle cx="1240" cy="666" r="2" opacity="0.55" />
        </g>
      </svg>

    </div>
  );
}
