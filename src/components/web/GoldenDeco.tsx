import React from 'react';

// Hanging Marigold Toran / Garlands
export const MarigoldToran: React.FC = () => {
  return (
    <div className="w-full overflow-hidden leading-none pointer-events-none select-none relative h-4 bg-gradient-to-r from-[#C51C13] via-[#FFCB44] to-[#C51C13] flex justify-around items-end opacity-90 drop-shadow-md">
      {[...Array(24)].map((_, i) => (
        <span key={i} className="inline-block text-[10px] md:text-xs animate-bounce" style={{ animationDelay: `${i * 150}ms`, animationDuration: '3s' }}>
          🏮
        </span>
      ))}
    </div>
  );
};

// Animated Diwali Diya SVG
export const AnimatedDiya: React.FC<{ className?: string }> = ({ className = 'w-12 h-12' }) => {
  return (
    <svg viewBox="0 0 100 100" className={`${className} fill-none`} xmlns="http://www.w3.org/2000/svg">
      {/* Flame */}
      <path
        d="M50 10 C62 30 62 48 50 56 C38 48 38 30 50 10 Z"
        fill="url(#flameGrad)"
        className="animate-pulse origin-bottom"
        style={{ transformOrigin: '50px 56px', animationDuration: '1.5s' }}
      />
      {/* Glow */}
      <circle cx="50" cy="35" r="20" fill="url(#glowGrad)" opacity="0.4" className="animate-ping" style={{ animationDuration: '3s' }} />
      {/* Clay Pot Base / Diya Body */}
      <path
        d="M20 54 Q50 90 80 54 C80 54 85 48 70 48 Q50 54 30 48 C15 48 20 54 20 54 Z"
        fill="url(#diyaBody)"
        stroke="#FFB300"
        strokeWidth="2.5"
      />
      {/* Golden Ornamental Details */}
      <path d="M30 51 Q50 56 70 51" stroke="#FFD54F" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="50" cy="65" r="4" fill="#FFD54F" />
      <circle cx="40" cy="62" r="3" fill="#FFD54F" />
      <circle cx="60" cy="62" r="3" fill="#FFD54F" />

      <defs>
        <radialGradient id="flameGrad" cx="50%" cy="80%" r="80%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="30%" stopColor="#FFB300" />
          <stop offset="70%" stopColor="#FF3D00" />
          <stop offset="100%" stopColor="#B71C1C" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFEA00" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF3D00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diyaBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8D6E63" />
          <stop offset="40%" stopColor="#5D4037" />
          <stop offset="100%" stopColor="#3E2723" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// Rangoli Mandala Graphic
export const RangoliMandala: React.FC<{ className?: string }> = ({ className = 'w-48 h-48 opacity-10' }) => {
  return (
    <svg viewBox="0 0 200 200" className={`${className} transform animate-[spin_80s_linear_infinite]`} style={{ color: '#FFCB44' }}>
      {/* Outer Circle */}
      <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5, 5" fill="none" />
      <circle cx="100" cy="100" r="85" stroke="currentColor" strokeWidth="1" fill="none" />

      {/* Petals */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360) / 12;
        return (
          <path
            key={i}
            d="M100 100 C110 50 130 50 100 15 C70 50 90 50 100 100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}

      {/* Inner layer petals */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 360) / 12 + 15;
        return (
          <path
            key={i}
            d="M100 100 C105 70 120 70 100 45 C80 70 95 70 100 100 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.8"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}

      {/* Inner Dots and Circles */}
      <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {[...Array(8)].map((_, i) => {
        const angle = (i * 360) / 8;
        return (
          <circle
            key={i}
            cx="100"
            cy="68"
            r="3"
            fill="currentColor"
            transform={`rotate(${angle} 100 100)`}
          />
        );
      })}
      <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="1" fill="none" />
      <circle cx="100" cy="100" r="10" fill="currentColor" opacity="0.3" />
      <circle cx="100" cy="100" r="4" fill="currentColor" />
    </svg>
  );
};

// Reusable Mithila/Madhubani Painting Traditional Border Divider
export const MithilaPaintingDivider: React.FC<{ className?: string }> = ({ className = 'my-4' }) => {
  return (
    <div 
      className={`w-full h-[24px] bg-[#FAF8F5] border-y border-stone-800/10 dark:border-stone-950 flex overflow-hidden relative select-none pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='24' viewBox='0 0 160 24'%3E%3Crect width='100%25' height='100%25' fill='%23FAF6E9'/%3E%3C!-- Top Triangles --%3E%3Cpath d='M0,0 L6,0 L3,3 Z M12,0 L18,0 L15,3 Z M24,0 L30,0 L27,3 Z M36,0 L42,0 L39,3 Z M48,0 L54,0 L51,3 Z M60,0 L66,0 L63,3 Z M72,0 L78,0 L75,3 Z M84,0 L90,0 L87,3 Z M96,0 L102,0 L99,3 Z M108,0 L114,0 L111,3 Z M120,0 L126,0 L123,3 Z M132,0 L138,0 L135,3 Z M144,0 L150,0 L147,3 Z' fill='%23C51C13'/%3E%3Cpath d='M6,0 L12,0 L9,3 Z M30,0 L36,0 L33,3 Z M54,0 L60,0 L57,3 Z M78,0 L84,0 L81,3 Z M102,0 L108,0 L105,3 Z M126,0 L132,0 L129,3 Z M150,0 L156,0 L153,3 Z' fill='%23FFCB44'/%3E%3Cpath d='M18,0 L24,0 L21,3 Z M42,0 L48,0 L45,3 Z M66,0 L72,0 L69,3 Z M90,0 L96,0 L93,3 Z M114,0 L120,0 L117,3 Z M138,0 L144,0 L141,3 Z M156,0 L160,0 L158,1.5 Z' fill='%232E7D32'/%3E%3C!-- Bottom Triangles --%3E%3Cpath d='M0,24 L6,24 L3,21 Z M12,24 L18,24 L15,21 Z M24,24 L30,24 L27,21 Z M36,24 L42,24 L39,21 Z M48,24 L54,24 L51,21 Z M60,24 L66,24 L63,21 Z M72,24 L78,24 L75,21 Z M84,24 L90,24 L87,21 Z M96,24 L102,24 L99,21 Z M108,24 L114,24 L111,21 Z M120,24 L126,24 L123,21 Z M132,24 L138,24 L135,21 Z M144,24 L150,24 L147,21 Z' fill='%23C51C13'/%3E%3Cpath d='M6,24 L12,24 L9,21 Z M30,24 L36,24 L33,21 Z M54,24 L60,24 L57,21 Z M78,24 L84,24 L81,21 Z M102,24 L108,24 L105,21 Z M126,24 L132,24 L129,21 Z M150,24 L156,24 L153,21 Z' fill='%23FFCB44'/%3E%3Cpath d='M18,24 L24,24 L21,21 Z M42,24 L48,24 L45,21 Z M66,24 L72,24 L69,21 Z M90,24 L96,24 L93,21 Z M114,24 L120,24 L117,21 Z M138,24 L144,24 L141,21 Z M156,24 L160,24 L158,22.5 Z' fill='%232E7D32'/%3E%3C!-- Vine Path --%3E%3Cpath d='M0,12 C40,6 40,18 80,12 C120,6 120,18 160,12' stroke='%23191919' stroke-width='1.5' fill='none'/%3E%3C!-- Traditional Flowers --%3E%3Ccircle cx='40' cy='11' r='4' fill='%23C51C13' stroke='%23191919' stroke-width='0.75'/%3E%3Ccircle cx='40' cy='11' r='1.5' fill='%23FFCB44'/%3E%3Ccircle cx='120' cy='13' r='4' fill='%23C51C13' stroke='%23191919' stroke-width='0.75'/%3E%3Ccircle cx='120' cy='13' r='1.5' fill='%23FFCB44'/%3E%3C!-- Styled Mithila Birds --%3E%3Cpath d='M75,9 C72,7 68,9 66,13 C64,17 60,16 57,14 L55,16 C58,18 63,19 66,16 C69,13 71,11 75,9 Z' fill='%2300ACC1' stroke='%23191919' stroke-width='0.75'/%3E%3Cpolygon points='75,9 79,8 76,11' fill='%23FFCB44' stroke='%23191919' stroke-width='0.5'/%3E%3Ccircle cx='73' cy='8' r='0.5' fill='%23000'/%3E%3Cpath d='M145,9 C142,7 138,9 136,13 C134,17 130,16 127,14 L125,16 C128,18 133,19 136,16 C139,13 141,11 145,9 Z' fill='%2300ACC1' stroke='%23191919' stroke-width='0.75'/%3E%3Cpolygon points='145,9 149,8 146,11' fill='%23FFCB44' stroke='%23191919' stroke-width='0.5'/%3E%3Ccircle cx='143' cy='8' r='0.5' fill='%23000'/%3E%3C!-- Green Leaves --%3E%3Cpath d='M25,8 Q20,3 15,6 Q20,11 25,8 Z M105,8 Q100,3 95,6 Q100,11 105,8 Z' fill='%232E7D32' stroke='%23191919' stroke-width='0.5'/%3E%3Cpath d='M50,16 Q55,21 60,18 Q55,13 50,16 Z M130,16 Q135,21 140,18 Q135,13 130,16 Z' fill='%232E7D32' stroke='%23191919' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'auto 24px'
      }} 
    />
  );
};

// Mithila Painting Frame Border wrapper for cards
export const MithilaFrameCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`relative p-5 bg-[#FAF8F5] text-stone-900 border-4 border-double border-[#C51C13]/85 rounded-2xl shadow-md ${className}`}>
      {/* Decorative corners */}
      <span className="absolute top-1 left-1 font-serif text-[10px] text-[#C51C13] select-none">❖</span>
      <span className="absolute top-1 right-1 font-serif text-[10px] text-[#C51C13] select-none">❖</span>
      <span className="absolute bottom-1 left-1 font-serif text-[10px] text-[#C51C13] select-none">❖</span>
      <span className="absolute bottom-1 right-1 font-serif text-[10px] text-[#C51C13] select-none">❖</span>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
