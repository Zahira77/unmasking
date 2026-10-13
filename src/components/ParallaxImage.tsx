import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  maxOffset?: number; // Capped at max 40px
  speed?: number; // 0.3x scroll speed
}

export function ParallaxImage({
  src,
  alt,
  className,
  maxOffset = 40,
  speed = 0.3,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Only calculate when element is in or near viewport
      if (rect.top < windowHeight && rect.bottom > 0) {
        const centerOffset = rect.top - windowHeight / 2;
        const calculatedOffset = Math.min(
          maxOffset,
          Math.max(-maxOffset, centerOffset * speed * -0.1)
        );
        setOffset(calculatedOffset);
      }
    };

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(handleScroll);
    };

    handleScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxOffset, speed]);

  return (
    <div ref={containerRef} className={cn("overflow-hidden relative", className)}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${offset}px) scale(1.05)` }}
      />
    </div>
  );
}
