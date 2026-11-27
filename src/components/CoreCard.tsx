"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Crown, Shield, Sparkles } from "lucide-react";
import type { CoreMember } from "@/lib/core-team";

interface CoreCardProps {
  member: CoreMember;
  index?: number;
}

const CARD_EASE = [0.16, 1, 0.3, 1] as const;

export default function CoreCard({ member, index = 0 }: CoreCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const displayName = member.title.trim() || "General Secretary";
  const isGS = member.subtitle === "GENERAL SECRETARY";
  const isHead = member.subtitle === "HEAD";
  const hasImage = Boolean(member.image.trim()) && !imgFailed;
  const hasUrl = Boolean(member.url.trim());
  const numLabel = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.6,
        delay: Math.min((index % 6) * 0.06, 0.3),
        ease: CARD_EASE,
      }}
      whileHover={{ y: -4 }}
      className="group relative flex w-[calc(50%-0.5rem)] max-w-[330px] flex-col overflow-hidden rounded-2xl border border-brand-border bg-[#0b0c12]/90 p-2.5 shadow-[0_14px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 hover:border-brand hover:shadow-glow-brand sm:w-[calc(50%-0.75rem)] sm:rounded-3xl sm:p-3.5 lg:w-[calc(33.333%-1.2rem)]"
    >
      {/* Top subtle theme hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/45 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Card Header Strip (Index & Role above image) */}
      <div className="mb-2.5 flex items-center justify-between gap-1.5 px-1 pt-0.5 sm:mb-3 sm:px-1.5">
        <span className="font-orbiter shrink-0 text-[11px] font-medium tracking-[0.18em] text-zinc-400 sm:text-xs">
          {numLabel}
        </span>

        <span
          className={`font-orbiter inline-flex min-w-0 items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] sm:px-3 sm:py-1 sm:text-[10.5px] sm:tracking-[0.14em] ${
            isGS || isHead
              ? "border-brand-border bg-brand-soft text-fg-brand"
              : "border-white/15 bg-white/[0.04] text-zinc-200"
          }`}
        >
          {(isGS || isHead) && <Sparkles size={10} className="shrink-0" />}
          <span className="truncate">{member.subtitle}</span>
        </span>
      </div>

      {/* Strict 1:1 Portrait Frame (full natural color, unobstructed) */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 bg-[#12131c] sm:rounded-2xl">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.image}
            alt={`${displayName} — ${member.subtitle}`}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-brand-soft/70 via-[#0e1018] to-[#08090d] p-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-border bg-[#080808]/75 text-fg-brand sm:h-14 sm:w-14">
              {isGS ? <Crown size={24} /> : <Shield size={22} />}
            </div>
            <span className="font-orbiter text-[10px] uppercase tracking-[0.2em] text-fg-brand/85">
              Council Portrait
            </span>
          </div>
        )}

        {/* Subtle bottom depth vignette only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#080808]/45 to-transparent"
        />
      </div>

      {/* Member Info Plate */}
      <div className="flex flex-1 flex-col justify-between gap-2 px-1 pb-1 pt-3 sm:px-1.5 sm:pt-3.5">
        <div className="min-w-0">
          <h3 className="truncate font-orbiter text-[1rem] font-medium leading-snug tracking-[0.01em] text-zinc-100 transition-colors duration-200 group-hover:text-fg-brand sm:text-[1.2rem]">
            {displayName}
          </h3>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-white/10 pt-2">
          {hasUrl ? (
            <a
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-orbiter inline-flex min-w-0 items-center gap-1 text-[11px] font-medium text-zinc-400 transition-colors duration-200 hover:text-fg-brand sm:text-[13px]"
            >
              <span className="truncate">
                {member.handle.trim() || "Connect"}
              </span>
              <ArrowUpRight
                size={13}
                className="shrink-0 text-fg-brand/80 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          ) : (
            <span className="font-orbiter truncate text-[11px] text-zinc-500 sm:text-[13px]">
              {member.handle.trim() || "Core Council"}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
