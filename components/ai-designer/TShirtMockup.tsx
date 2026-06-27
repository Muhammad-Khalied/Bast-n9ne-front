'use client';

import { useState } from 'react';

// T-shirt color to hex mapping
const COLOR_MAP: Record<string, string> = {
  White: '#FFFFFF',
  Black: '#1a1a1a',
  Navy: '#1B2A4A',
  Gray: '#6B7280',
  Red: '#DC2626',
};

interface TShirtMockupProps {
  color: string;
  designImageUrl?: string | null;
  className?: string;
}

export function TShirtMockup({ color, designImageUrl, className = '' }: TShirtMockupProps) {
  const fillColor = COLOR_MAP[color] || COLOR_MAP.White;
  const isLight = color === 'White' || color === 'Gray';

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* T-shirt SVG silhouette */}
      <svg
        viewBox="0 0 400 480"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="200" cy="468" rx="140" ry="8" fill="rgba(0,0,0,0.06)" />

        {/* T-shirt body */}
        <path
          d={`
            M 140 60
            L 90 80
            L 20 130
            L 45 175
            L 95 145
            L 95 430
            L 305 430
            L 305 145
            L 355 175
            L 380 130
            L 310 80
            L 260 60
            Q 250 90 200 95
            Q 150 90 140 60
            Z
          `}
          fill={fillColor}
          stroke={isLight ? '#d4cdc4' : 'rgba(255,255,255,0.1)'}
          strokeWidth="1.5"
        />

        {/* Collar */}
        <path
          d={`
            M 140 60
            Q 150 90 200 95
            Q 250 90 260 60
            Q 240 45 200 40
            Q 160 45 140 60
            Z
          `}
          fill={fillColor}
          stroke={isLight ? '#d4cdc4' : 'rgba(255,255,255,0.15)'}
          strokeWidth="1.5"
        />

        {/* Subtle fabric texture lines */}
        <line x1="95" y1="145" x2="95" y2="430" stroke={isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'} strokeWidth="1" />
        <line x1="305" y1="145" x2="305" y2="430" stroke={isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)'} strokeWidth="1" />

        {/* Sleeve seam lines */}
        <line x1="95" y1="145" x2="90" y2="80" stroke={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'} strokeWidth="0.8" />
        <line x1="305" y1="145" x2="310" y2="80" stroke={isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)'} strokeWidth="0.8" />
      </svg>

      {/* Design overlay — positioned on the chest area */}
      {designImageUrl && (
        <div
          className="absolute"
          style={{
            top: '28%',
            left: '30%',
            width: '40%',
            height: '35%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={designImageUrl}
            alt="Custom design"
            className="max-w-full max-h-full object-contain drop-shadow-md"
            style={{
              mixBlendMode: isLight ? 'multiply' : 'screen',
              opacity: 0.95,
            }}
          />
        </div>
      )}
    </div>
  );
}
