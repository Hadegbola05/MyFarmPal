import * as React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
  variant?: 'full' | 'icon-only';
  hasBox?: boolean;
  direction?: 'row' | 'col';
}

const sizeMap = {
  xs: { img: 'w-8 h-8', text: 'text-sm', sub: 'text-[9px]' },
  sm: { img: 'w-11 h-11', text: 'text-lg', sub: 'text-[11px]' },
  md: { img: 'w-14 h-14', text: 'text-xl', sub: 'text-xs' },
  lg: { img: 'w-20 h-20', text: 'text-2xl', sub: 'text-sm' },
  xl: { img: 'w-28 h-28', text: 'text-3xl', sub: 'text-sm' },
};

export default function AppLogo({
  className = '',
  size = 'md',
  showText = true,
  textClassName = '',
  variant = 'full',
  hasBox = false,
  direction = 'row',
}: AppLogoProps) {
  const [imgSrc, setImgSrc] = React.useState('/logo-transparent.png');
  const [imgError, setImgError] = React.useState(false);
  const { img, text, sub } = sizeMap[size];

  const handleImageError = () => {
    if (imgSrc === '/logo-transparent.png') {
      // Fallback to original logo.png
      setImgSrc('/logo.png');
    } else {
      setImgError(true);
    }
  };

  const isCol = direction === 'col';

  return (
    <div className={`flex ${isCol ? 'flex-col items-center text-center gap-2.5' : 'items-center gap-3'} ${className}`}>
      <div 
        className={
          hasBox
            ? `relative flex items-center justify-center shrink-0 rounded-2xl bg-white shadow-md border-2 border-emerald-500/20 p-1 overflow-hidden transition-transform duration-200 hover:scale-105 ${img}`
            : `relative flex items-center justify-center shrink-0 transition-transform duration-200 hover:scale-105 ${img}`
        }
      >
        {!imgError ? (
          <img
            src={imgSrc}
            alt="MyFarmPal Mascot Logo"
            className="w-full h-full object-contain filter drop-shadow-xs"
            onError={handleImageError}
            referrerPolicy="no-referrer"
          />
        ) : (
          /* SVG Mascot representation matching the uploaded image */
          <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background Sprout 'f' (Green) */}
            <path
              d="M38 18C44 14 55 16 57 26C59 36 57 44 57 48H44C38 48 37 54 37 60H53V72H37V92C37 98 33 103 27 106M27 106L22 113M27 106L29 114M27 106L34 112"
              stroke="#2B1608"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Leaf on top of green f */}
            <path
              d="M55 24C62 10 74 12 73 22C63 26 58 24 55 24Z"
              fill="#52B824"
              stroke="#2B1608"
              strokeWidth="3.5"
            />
            {/* Green 'f' body */}
            <path
              d="M36 28C36 20 44 17 52 17C57 17 59 20 59 26C59 38 56 46 56 47H45V60H53V72H45V92C45 98 42 102 38 104C34 102 33 97 33 92V38C33 32 34 29 36 28Z"
              fill="#54B82A"
            />
            {/* 'm' branch on left */}
            <path
              d="M33 66L23 60C20 58 16 63 19 66L20 72C22 75 26 73 28 71"
              stroke="#6F4223"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Golden Yellow 'P' Character */}
            <path
              d="M65 32C65 24 73 20 84 20C96 20 102 28 102 38C102 48 94 56 83 56H75V92C75 98 71 103 66 105M66 105L61 113M66 105L67 114M66 105L73 112"
              fill="#FFBD0A"
              stroke="#2B1608"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* P body center */}
            <path
              d="M75 32H83C88 32 92 35 92 40C92 45 88 48 83 48H75V32Z"
              fill="#FFF2B2"
            />
            {/* Eyes & Smiles */}
            <circle cx="43" cy="38" r="2.5" fill="#2B1608" />
            <circle cx="51" cy="38" r="2.5" fill="#2B1608" />
            <path d="M45 42C47 44 49 44 51 42" stroke="#2B1608" strokeWidth="2" strokeLinecap="round" />
            
            <circle cx="78" cy="38" r="2.5" fill="#2B1608" />
            <circle cx="89" cy="39" r="2.5" fill="#2B1608" />
            <path d="M80 43C83 45 86 45 88 43" stroke="#2B1608" strokeWidth="2" strokeLinecap="round" />
            <path d="M81 50C85 52 89 50 90 49" stroke="#2B1608" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </div>

      {showText && variant === 'full' && (
        <div className={`flex flex-col ${isCol ? 'items-center text-center' : ''}`}>
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight leading-tight ${text} ${textClassName || 'text-slate-900'}`}>
              <span className="text-slate-900">My</span>
              <span className="text-[#4AA823]">Farm</span>
              <span className="text-[#FAB814]">Pal</span>
            </span>
          </div>
          <p className={`${sub} text-muted-foreground font-medium tracking-tight ${isCol ? 'mt-1' : '-mt-0.5 hidden sm:block'}`}>
            Your Smart Farming Companion
          </p>
        </div>
      )}
    </div>
  );
}
