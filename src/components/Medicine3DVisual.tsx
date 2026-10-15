import React from 'react';
import { motion } from 'motion/react';

interface Medicine3DVisualProps {
  type: 'bottle' | 'blister' | 'box' | 'tablet' | 'capsule';
  brandColor?: string;
  pillColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
  animate?: boolean;
}

export const Medicine3DVisual: React.FC<Medicine3DVisualProps> = ({
  type,
  brandColor = '#2563EB',
  pillColor = '#FFFFFF',
  size = 'md',
  className = '',
  animate = false,
}) => {
  const containerDimensions = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
    hero: 'w-full h-full',
  }[size];

  // Render dedicated realistic 3D objects
  if (type === 'bottle') {
    return (
      <div className={`relative flex items-center justify-center ${containerDimensions} ${className}`}>
        {/* Soft studio contact shadow */}
        <div className="absolute bottom-2 w-3/4 h-3 bg-slate-900/10 rounded-full blur-[6px] transform scale-y-50" />

        <svg
          viewBox="0 0 200 240"
          className="w-full h-full drop-shadow-md overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Bottle body cylindrical gradient */}
            <linearGradient id="bottleBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="15%" stopColor="#F8FAFC" />
              <stop offset="45%" stopColor="#FFFFFF" />
              <stop offset="70%" stopColor="#F1F5F9" />
              <stop offset="90%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Cap cylindrical gradient */}
            <linearGradient id="bottleCap" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="25%" stopColor="#2563EB" />
              <stop offset="55%" stopColor="#60A5FA" />
              <stop offset="85%" stopColor="#1D4ED8" />
              <stop offset="100%" stopColor="#1E3A8A" />
            </linearGradient>

            {/* Soft highlight reflection */}
            <linearGradient id="specularGlint" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Bottle Neck */}
          <rect x="75" y="42" width="50" height="22" rx="4" fill="url(#bottleBody)" />

          {/* Child-resistant Cap with ribbed texture */}
          <rect x="68" y="16" width="64" height="30" rx="6" fill="url(#bottleCap)" />
          {/* Vertical cap grip ribs */}
          {[74, 82, 90, 98, 106, 114, 122].map((x) => (
            <line key={x} x1={x} y1="20" x2={x} y2="42" stroke="#93C5FD" strokeWidth="1" strokeOpacity="0.6" />
          ))}

          {/* Bottle Body */}
          <rect x="44" y="60" width="112" height="150" rx="22" fill="url(#bottleBody)" />

          {/* Label Wrap (White with clean blue medical accent) */}
          <rect x="45" y="90" width="110" height="96" rx="6" fill="#FFFFFF" />
          {/* Label Blue Header Band */}
          <rect x="45" y="92" width="110" height="14" fill={brandColor} />
          {/* Minimal Medical Cross Icon on Label */}
          <rect x="58" y="96" width="6" height="6" rx="1.5" fill="#FFFFFF" />

          {/* Label Typography Lines */}
          <rect x="58" y="116" width="60" height="7" rx="3.5" fill="#0F172A" />
          <rect x="58" y="128" width="42" height="4" rx="2" fill="#2563EB" />
          <rect x="58" y="137" width="76" height="3" rx="1.5" fill="#94A3B8" />
          <rect x="58" y="144" width="68" height="3" rx="1.5" fill="#CBD5E1" />
          <rect x="58" y="151" width="54" height="3" rx="1.5" fill="#CBD5E1" />

          {/* Dosage / Rx badge on bottle */}
          <rect x="58" y="163" width="32" height="14" rx="4" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
          <text x="63" y="173" fontSize="8" fontWeight="bold" fill="#1D4ED8" fontFamily="Manrope">Rx 500</text>

          {/* Glossy vertical studio light reflection across body */}
          <rect x="62" y="64" width="12" height="142" rx="6" fill="url(#specularGlint)" opacity="0.45" />
        </svg>
      </div>
    );
  }

  if (type === 'blister') {
    return (
      <div className={`relative flex items-center justify-center ${containerDimensions} ${className}`}>
        {/* Contact shadow */}
        <div className="absolute bottom-2 w-4/5 h-3 bg-slate-900/10 rounded-full blur-[6px] transform scale-y-50" />

        <svg
          viewBox="0 0 220 180"
          className="w-full h-full drop-shadow-md overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Metallic Aluminum Blister Foil Gradient */}
            <linearGradient id="foilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="25%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>

            {/* Bubble Dome Shading */}
            <radialGradient id="bubbleGrad" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#DBEAFE" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#93C5FD" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#64748B" stopOpacity="0.3" />
            </radialGradient>

            <linearGradient id="capsuleBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="40%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1D4ED8" />
            </linearGradient>

            <linearGradient id="capsuleWhite" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="40%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD5E1" />
            </linearGradient>
          </defs>

          {/* Aluminum Foil Plate with rounded beveled corners */}
          <rect x="20" y="20" width="180" height="140" rx="14" fill="url(#foilGrad)" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Clean Embossed Edge Rim */}
          <rect x="25" y="25" width="170" height="130" rx="10" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeOpacity="0.8" />

          {/* Foil Perforation Pattern Grid (Push-through marks) */}
          <line x1="110" y1="20" x2="110" y2="160" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="20" y1="90" x2="200" y2="90" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />

          {/* 4 Blister Cavities containing dual-tone capsules */}
          {[
            { x: 42, y: 38 },
            { x: 128, y: 38 },
            { x: 42, y: 104 },
            { x: 128, y: 104 },
          ].map((pos, idx) => (
            <g key={idx}>
              {/* Cavity indentation shadow */}
              <rect x={pos.x - 2} y={pos.y - 2} width="54" height="38" rx="19" fill="#94A3B8" opacity="0.25" />

              {/* Clear PVC Blister Dome */}
              <rect x={pos.x} y={pos.y} width="50" height="34" rx="17" fill="url(#bubbleGrad)" stroke="#FFFFFF" strokeWidth="1" />

              {/* Inside Capsule: Left half (White) + Right half (Blue) */}
              <rect x={pos.x + 6} y={pos.y + 7} width="19" height="20" rx="9" fill="url(#capsuleWhite)" />
              <rect x={pos.x + 25} y={pos.y + 7} width="19" height="20" rx="9" fill="url(#capsuleBlue)" />

              {/* Capsule glossy reflection stripe */}
              <line x1={pos.x + 10} y1={pos.y + 11} x2={pos.x + 40} y2={pos.y + 11} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (type === 'box') {
    return (
      <div className={`relative flex items-center justify-center ${containerDimensions} ${className}`}>
        {/* Soft realistic studio contact shadow */}
        <div className="absolute bottom-2 w-4/5 h-3 bg-slate-900/10 rounded-full blur-[6px] transform scale-y-50" />

        <svg
          viewBox="0 0 200 200"
          className="w-full h-full drop-shadow-md overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cleanBoxFront" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="85%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#E2E8F0" />
            </linearGradient>
            <linearGradient id="boxGloss" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Clean Front-Facing Medicine Packaging Carton */}
          <rect x="35" y="30" width="130" height="140" rx="14" fill="url(#cleanBoxFront)" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Top Brand Stripe */}
          <rect x="35" y="30" width="130" height="24" rx="14" fill={brandColor} />
          <rect x="35" y="44" width="130" height="10" fill={brandColor} />

          {/* Clinical Cross Mark on header */}
          <rect x="50" y="38" width="8" height="8" rx="2" fill="#FFFFFF" />

          {/* Rx Badge */}
          <rect x="50" y="66" width="34" height="14" rx="4" fill="#EFF6FF" stroke="#BFDBFE" strokeWidth="1" />
          <text x="55" y="76" fontSize="8" fontWeight="bold" fill="#1D4ED8" fontFamily="Manrope">Rx Only</text>

          {/* Packaging Typography Lines */}
          <rect x="50" y="90" width="80" height="8" rx="3" fill="#0F172A" />
          <rect x="50" y="104" width="56" height="4" rx="2" fill="#64748B" />
          <rect x="50" y="112" width="70" height="3" rx="1.5" fill="#94A3B8" />
          <rect x="50" y="118" width="60" height="3" rx="1.5" fill="#CBD5E1" />

          {/* Realistic Barcode / Batch Seal at bottom */}
          <g transform="translate(50, 134)">
            {[0, 4, 7, 12, 16, 18, 24, 28, 33, 36, 42, 45, 50, 56, 62].map((bx) => (
              <line key={bx} x1={bx} y1="0" x2={bx} y2="18" stroke="#64748B" strokeWidth={bx % 3 === 0 ? "2" : "1"} />
            ))}
          </g>

          {/* Security Hologram Pill on Right Bottom */}
          <circle cx="140" cy="144" r="10" fill="#DBEAFE" stroke="#93C5FD" strokeWidth="1" />
          <text x="135" y="147" fontSize="7" fontWeight="bold" fill="#2563EB" fontFamily="Manrope">OK</text>

          {/* Subtle diagonal specular glint */}
          <rect x="36" y="31" width="128" height="60" rx="13" fill="url(#boxGloss)" opacity="0.4" pointerEvents="none" />
        </svg>
      </div>
    );
  }

  if (type === 'capsule') {
    return (
      <div className={`relative flex items-center justify-center ${containerDimensions} ${className}`}>
        <div className="absolute bottom-2 w-3/4 h-2.5 bg-slate-900/10 rounded-full blur-[4px]" />
        <svg
          viewBox="0 0 160 100"
          className="w-full h-full drop-shadow-md overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="capsuleColor1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="50%" stopColor="#DC2626" />
              <stop offset="100%" stopColor="#991B1B" />
            </linearGradient>
            <linearGradient id="capsuleColor2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="capsuleShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Left half shell */}
          <path d="M 70 20 L 40 20 A 30 30 0 0 0 40 80 L 70 80 Z" fill={pillColor === '#FFFFFF' ? 'url(#capsuleColor1)' : pillColor} stroke="#991B1B" strokeWidth="1" />
          {/* Right half shell */}
          <path d="M 70 20 L 110 20 A 30 30 0 0 1 110 80 L 70 80 Z" fill="url(#capsuleColor2)" stroke="#1E40AF" strokeWidth="1" />
          {/* Center Seam Ring */}
          <line x1="70" y1="20" x2="70" y2="80" stroke="#0F172A" strokeWidth="1.5" opacity="0.4" />
          {/* Specular Highlight Arc along top */}
          <path d="M 30 28 Q 70 22 120 28" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.8" />
        </svg>
      </div>
    );
  }

  // Fallback / Tablet
  return (
    <div className={`relative flex items-center justify-center ${containerDimensions} ${className}`}>
      <div className="absolute bottom-2 w-3/4 h-2.5 bg-slate-900/10 rounded-full blur-[4px]" />
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-sm overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="tabletGrad" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F8FAFC" />
            <stop offset="85%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </radialGradient>
        </defs>
        {/* Scored Round White Tablet */}
        <circle cx="60" cy="60" r="42" fill="url(#tabletGrad)" stroke="#CBD5E1" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="38" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
        {/* Center Score Line for split dosing */}
        <line x1="60" y1="24" x2="60" y2="96" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
        {/* Subtle Imprint */}
        <text x="44" y="64" fontSize="9" fontWeight="bold" fill="#64748B" fontFamily="Manrope">500</text>
      </svg>
    </div>
  );
};
