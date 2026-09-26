import React, { useEffect, useState, useRef } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  encryptedClassName?: string;
  trigger?: any;
}

// Proportional character width mapping for zero layout shift in Quicksand font
const CHAR_WIDTH_MAP: Record<string, string> = {
  g: '0.52em',
  i: '0.24em',
  t: '0.32em',
  c: '0.46em',
  o: '0.54em',
  r: '0.34em',
  e: '0.48em',
  G: '0.62em',
  I: '0.26em',
  T: '0.50em',
  C: '0.58em',
  O: '0.64em',
  R: '0.54em',
  E: '0.50em',
  A: '0.58em',
  M: '0.74em',
  L: '0.44em',
};

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 28,
  maxIterations = 12,
  characters = '0123456789abcdefghijklmnopqrstuvwxyz',
  className = '',
  encryptedClassName = 'text-[#20c997] drop-shadow-[0_0_8px_rgba(32,201,151,0.6)]',
  trigger,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const intervalRef = useRef<any>(null);

  const startAnimation = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    setIsAnimating(true);

    intervalRef.current = setInterval(() => {
      setDisplayText(() =>
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / (maxIterations / text.length)) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsAnimating(false);
      }

      iteration++;
    }, speed);
  };

  useEffect(() => {
    startAnimation();
    return () => clearInterval(intervalRef.current);
  }, [text, trigger]);

  return (
    <span
      className={`inline-flex items-baseline cursor-pointer select-none font-quicksand ${className}`}
      onMouseEnter={() => {
        startAnimation();
      }}
    >
      {displayText.split('').map((char, index) => {
        const originalChar = text[index] || char;
        const isEncrypted = isAnimating && char !== originalChar;
        const slotWidth = CHAR_WIDTH_MAP[originalChar] || '0.5em';

        return (
          <span
            key={index}
            className={`inline-block text-center transition-colors duration-75 ${
              isEncrypted ? encryptedClassName : ''
            }`}
            style={{
              width: slotWidth,
              minWidth: slotWidth,
              maxWidth: slotWidth,
              overflow: 'visible',
            }}
          >
            {char}
          </span>
        );
      })}
    </span>
  );
};

export default DecryptedText;
