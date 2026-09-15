"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/config/brand";

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  subtitle?: string;
  className?: string;
}

export function BrandLogo({
  href = "/",
  size = "md",
  showText = true,
  subtitle,
  className = "",
}: BrandLogoProps) {
  const sizeMap = {
    sm: { box: "h-7 w-7", img: 24, text: "text-base", sub: "text-[9px]" },
    md: { box: "h-9 w-9", img: 32, text: "text-lg", sub: "text-[10px]" },
    lg: { box: "h-10 w-10", img: 36, text: "text-2xl", sub: "text-xs" },
    xl: { box: "h-12 w-12", img: 44, text: "text-3xl", sub: "text-xs" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* 3D Ribbon "N" Glowing Mark in High-End Obsidian Capsule */}
      <div
        className={`relative flex ${currentSize.box} shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-emerald-500/30 shadow-md shadow-emerald-500/20 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400/60 group-hover:shadow-[0_0_18px_rgba(16,185,129,0.45)]`}
      >
        {/* Subtle Ambient Cyber Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-emerald-500/10 to-transparent pointer-events-none" />
        
        <Image
          src="/images/nexora-icon-v3.png"
          alt={`${BRAND.name} Logo`}
          width={currentSize.img}
          height={currentSize.img}
          className="w-full h-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-display font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-none ${currentSize.text}`}
          >
            {BRAND.name}
          </span>
          {subtitle && (
            <span
              className={`font-mono tracking-wider font-semibold uppercase mt-1 leading-none ${currentSize.sub}`}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
