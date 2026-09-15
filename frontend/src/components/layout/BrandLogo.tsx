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
    sm: { box: "h-8 w-8", img: 32, text: "text-lg", sub: "text-[9px]" },
    md: { box: "h-10 w-10", img: 40, text: "text-xl", sub: "text-[10px]" },
    lg: { box: "h-12 w-12", img: 48, text: "text-2xl", sub: "text-xs" },
    xl: { box: "h-14 w-14", img: 56, text: "text-3xl", sub: "text-xs" },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`flex items-center gap-3 group select-none ${className}`}>
      {/* 3D Cyan/Emerald Ribbon "N" Mark in Obsidian Capsule */}
      <div
        className={`relative flex ${currentSize.box} shrink-0 items-center justify-center rounded-xl bg-slate-950 border border-emerald-500/40 shadow-md shadow-emerald-500/25 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-emerald-400 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]`}
      >
        {/* Subtle Ambient Cyber Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-emerald-500/10 to-transparent pointer-events-none" />
        
        <Image
          src="/images/nexora-icon-v3.png"
          alt={`${BRAND.name} Logo`}
          width={currentSize.img}
          height={currentSize.img}
          className="w-full h-full object-contain p-0.5 transition-transform duration-300 group-hover:scale-110"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-display font-extrabold tracking-tight text-slate-950 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-none ${currentSize.text}`}
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
