'use client';
import React, { useEffect, useState, useRef } from 'react';

interface AnimateTextProps {
  children: number;
  duration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DigitRoller: React.FC<{
  targetDigit: string;
  duration: number;
  delay?: number;
}> = ({ targetDigit, duration, delay = 0 }) => {
  const [currentDigit, setCurrentDigit] = useState(targetDigit);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevDigitRef = useRef(targetDigit);

  useEffect(() => {
    if (targetDigit !== prevDigitRef.current) {
      setIsAnimating(true);
      
      setTimeout(() => {
        setCurrentDigit(targetDigit);
        prevDigitRef.current = targetDigit;
        
        setTimeout(() => {
          setIsAnimating(false);
        }, duration);
      }, delay);
    }
  }, [targetDigit, duration, delay]);

  const getDigitDirection = () => {
    const prev = parseInt(prevDigitRef.current) || 0;
    const curr = parseInt(targetDigit) || 0;
    return curr > prev ? 1 : -1; // 1 for up, -1 for down
  };

  const direction = getDigitDirection();

  return (
    <div 
      className="relative inline-block overflow-hidden"
      style={{ 
        width: '1ch',
        height: '1.2em',
        verticalAlign: 'top'
      }}
    >
      {/* All possible digits for smooth rolling */}
      <div
        className="absolute inset-0 flex flex-col items-center"
        style={{
          transform: `translateY(${isAnimating ? -parseInt(currentDigit) * 100 : -parseInt(prevDigitRef.current) * 100}%)`,
          transition: isAnimating ? `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none'
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="flex items-center justify-center"
            style={{ 
              height: '1.2em',
              width: '1ch'
            }}
          >
            {i}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnimateText: React.FC<AnimateTextProps> = ({
  children: value,
  duration = 600,
  className = '',
  style = {}
}) => {
  const [displayValue, setDisplayValue] = useState(value.toString());
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      setDisplayValue(value.toString());
      prevValueRef.current = value;
    }
  }, [value]);

  // Pad with leading zeros to maintain consistent width
  const maxLength = Math.max(displayValue.length, 1);
  const paddedValue = displayValue.padStart(maxLength, '0');

  return (
    <div 
      className={`inline-flex font-mono ${className}`}
      style={{
        ...style,
        fontVariantNumeric: 'tabular-nums'
      }}
    >
      {paddedValue.split('').map((digit, index) => (
        <DigitRoller
          key={`${maxLength}-${index}`}
          targetDigit={digit}
          duration={duration}
          delay={index * 50}
        />
      ))}
    </div>
  );
};