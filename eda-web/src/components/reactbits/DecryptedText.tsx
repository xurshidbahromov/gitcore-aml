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

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  speed = 28,
  maxIterations = 12,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~|}{[]:;?><,./-=',
  className = '',
  encryptedClassName = 'text-[#20c997] font-mono drop-shadow-[0_0_8px_rgba(32,201,151,0.6)]',
  trigger,
}) => {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const intervalRef = useRef<any>(null);

  const startAnimation = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

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
        setIsHovered(false);
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
      className={`inline-block font-mono cursor-pointer transition-colors duration-150 select-none ${className} ${
        isHovered ? encryptedClassName : ''
      }`}
      onMouseEnter={() => {
        setIsHovered(true);
        startAnimation();
      }}
    >
      {displayText}
    </span>
  );
};

export default DecryptedText;
