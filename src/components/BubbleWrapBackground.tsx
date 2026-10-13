import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";

interface Bubble {
  id: number;
  x: number;
  y: number;
  r: number;
  popped: boolean;
  popProgress: number;
  scale: number;
  pulsePhase: number;
}

export default function BubbleWrapBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [poppedCount, setPoppedCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isPopMode, setIsPopMode] = useState(true);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const bubblesRef = useRef<Bubble[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize a realistic crisp bubble pop sound using Web Audio API
  const playPopSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const baseFreq = 420 + Math.random() * 260;
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.8, ctx.currentTime + 0.04);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Audio playback ignored
    }
  }, [soundEnabled]);

  // Build the grid of bubble wrap cells
  const initBubbles = useCallback((width: number, height: number) => {
    const bubbles: Bubble[] = [];
    const spacing = Math.min(width < 768 ? 44 : 54, 62);
    const radius = spacing * 0.43;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / (spacing * 0.866)) + 1;

    let id = 0;
    for (let row = 0; row < rows; row++) {
      const offsetX = (row % 2) * (spacing / 2);
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + offsetX - spacing * 0.5;
        const y = row * (spacing * 0.866) - spacing * 0.5;
        bubbles.push({
          id: id++,
          x,
          y,
          r: radius,
          popped: false,
          popProgress: 0,
          scale: 1,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }
    bubblesRef.current = bubbles;
  }, []);

  const resetAllBubbles = useCallback(() => {
    bubblesRef.current.forEach((b) => {
      b.popped = false;
      b.popProgress = 0;
      b.scale = 1;
    });
    setPoppedCount(0);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    initBubbles(width, height);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initBubbles(width, height);
    };

    window.addEventListener("resize", handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains("dark");
      const mouse = mouseRef.current;

      const bubbles = bubblesRef.current;
      for (let i = 0; i < bubbles.length; i++) {
        const b = bubbles[i];

        if (b.popped && b.popProgress < 1) {
          b.popProgress = Math.min(1, b.popProgress + 0.12);
        }

        const dx = mouse.x - b.x;
        const dy = mouse.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const hoverRange = b.r * 2.6;

        let targetScale = b.popped ? 0.4 : 1;
        if (!b.popped && mouse.active && dist < hoverRange) {
          const proximity = 1 - dist / hoverRange;
          targetScale = 1 + proximity * 0.2;
        }

        b.scale += (targetScale - b.scale) * 0.15;
        const currentR = b.r * b.scale;

        ctx.save();
        ctx.translate(b.x, b.y);

        if (!b.popped) {
          // 1. Outer Glass Ambient Shadow
          ctx.beginPath();
          ctx.arc(0, 0, currentR, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? "rgba(15, 23, 42, 0.35)"
            : "rgba(219, 234, 254, 0.4)";
          ctx.fill();

          // 2. Glass Rim Gradient
          const rimGrad = ctx.createRadialGradient(
            0,
            0,
            currentR * 0.55,
            0,
            0,
            currentR
          );
          if (isDark) {
            rimGrad.addColorStop(0, "rgba(56, 189, 248, 0.02)");
            rimGrad.addColorStop(0.7, "rgba(99, 102, 241, 0.12)");
            rimGrad.addColorStop(1, "rgba(165, 180, 252, 0.32)");
          } else {
            rimGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
            rimGrad.addColorStop(0.7, "rgba(186, 230, 253, 0.35)");
            rimGrad.addColorStop(1, "rgba(255, 255, 255, 0.85)");
          }
          ctx.beginPath();
          ctx.arc(0, 0, currentR, 0, Math.PI * 2);
          ctx.fillStyle = rimGrad;
          ctx.fill();

          // 3. Crisp Glass Border
          ctx.beginPath();
          ctx.arc(0, 0, currentR, 0, Math.PI * 2);
          ctx.lineWidth = isDark ? 1.1 : 1.3;
          ctx.strokeStyle = isDark
            ? "rgba(147, 197, 253, 0.2)"
            : "rgba(255, 255, 255, 0.7)";
          ctx.stroke();

          // 4. Primary Specular Highlight (Upper Left 3D glint)
          const specGrad = ctx.createRadialGradient(
            -currentR * 0.32,
            -currentR * 0.32,
            1,
            -currentR * 0.32,
            -currentR * 0.32,
            currentR * 0.42
          );
          specGrad.addColorStop(
            0,
            isDark ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.95)"
          );
          specGrad.addColorStop(
            0.5,
            isDark ? "rgba(186, 230, 253, 0.35)" : "rgba(255, 255, 255, 0.4)"
          );
          specGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.beginPath();
          ctx.ellipse(
            -currentR * 0.3,
            -currentR * 0.3,
            currentR * 0.36,
            currentR * 0.22,
            -Math.PI / 4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = specGrad;
          ctx.fill();

          // 5. Secondary Bottom Crescent Refraction
          const bottomGrad = ctx.createRadialGradient(
            currentR * 0.22,
            currentR * 0.22,
            0,
            currentR * 0.22,
            currentR * 0.22,
            currentR * 0.45
          );
          bottomGrad.addColorStop(
            0,
            isDark ? "rgba(99, 102, 241, 0.22)" : "rgba(147, 197, 253, 0.35)"
          );
          bottomGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

          ctx.beginPath();
          ctx.ellipse(
            currentR * 0.2,
            currentR * 0.2,
            currentR * 0.32,
            currentR * 0.14,
            -Math.PI / 4,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = bottomGrad;
          ctx.fill();
        } else {
          // Popped state
          const popProgress = b.popProgress;

          if (popProgress < 1) {
            const rippleR = b.r * (1 + popProgress * 1.4);
            ctx.beginPath();
            ctx.arc(0, 0, rippleR, 0, Math.PI * 2);
            ctx.strokeStyle = isDark
              ? `rgba(165, 180, 252, ${0.4 * (1 - popProgress)})`
              : `rgba(59, 130, 246, ${0.5 * (1 - popProgress)})`;
            ctx.lineWidth = 2 * (1 - popProgress);
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.arc(0, 0, currentR, 0, Math.PI * 2);
          ctx.fillStyle = isDark
            ? "rgba(15, 23, 42, 0.3)"
            : "rgba(203, 213, 225, 0.25)";
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, currentR, 0, Math.PI * 2);
          ctx.strokeStyle = isDark
            ? "rgba(100, 116, 139, 0.25)"
            : "rgba(148, 163, 184, 0.35)";
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 3]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [initBubbles]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let poppedAny = false;
    for (let i = 0; i < bubblesRef.current.length; i++) {
      const b = bubblesRef.current[i];
      const dx = x - b.x;
      const dy = y - b.y;
      if (dx * dx + dy * dy <= b.r * b.r * 1.4) {
        if (!b.popped) {
          b.popped = true;
          b.popProgress = 0;
          poppedAny = true;
          setPoppedCount((c) => c + 1);
        }
      }
    }

    if (poppedAny) {
      playPopSound();
    }
  };

  return (
    <>
      {/* 1. Dynamic Ambient Glowing Glass Color Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-2]">
        <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-gradient-to-br from-primary/25 via-sky-400/20 to-purple-500/15 blur-[90px] animate-float opacity-75 dark:opacity-60" />
        <div
          className="absolute top-1/3 -right-24 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-indigo-500/20 via-primary/25 to-teal-400/15 blur-[80px] animate-float opacity-70 dark:opacity-50"
          style={{ animationDelay: "3s", animationDuration: "12s" }}
        />
        <div
          className="absolute -bottom-24 left-1/4 w-[36rem] h-[36rem] rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/20 to-violet-500/15 blur-[100px] animate-float opacity-65 dark:opacity-50"
          style={{ animationDelay: "6s", animationDuration: "15s" }}
        />
      </div>

      {/* 2. Interactive 3D Bubble Wrap Canvas Layer */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className={`fixed inset-0 w-full h-full z-[-1] transition-opacity duration-500 ${
          isPopMode ? "cursor-pointer" : "pointer-events-none"
        }`}
        style={{
          opacity: 0.9,
        }}
      />

      {/* 3. Floating Glassmorphic Bubble Wrap Control & Fidget Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        <div
          className={`glass-panel rounded-2xl shadow-xl transition-all duration-300 ${
            isWidgetOpen ? "p-4 w-72" : "p-2 px-3.5"
          }`}
        >
          {isWidgetOpen ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🫧</span>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Bubble Wrap Mode
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      {poppedCount} bubbles popped
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsWidgetOpen(false)}
                  className="text-xs text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setIsPopMode(!isPopMode)}
                  className={`py-2 px-2.5 rounded-lg border text-center font-medium transition-all ${
                    isPopMode
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-muted/40 hover:bg-muted text-foreground border-border"
                  }`}
                >
                  {isPopMode ? "Pop Active ⚡" : "Pop Disabled"}
                </button>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`py-2 px-2.5 rounded-lg border flex items-center justify-center gap-1.5 font-medium transition-all ${
                    soundEnabled
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted/40 text-muted-foreground border-border"
                  }`}
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 size={14} /> Sound ON
                    </>
                  ) : (
                    <>
                      <VolumeX size={14} /> Muted
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={resetAllBubbles}
                className="w-full py-2 px-3 rounded-lg border border-border/80 bg-background/50 hover:bg-background/80 text-foreground text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <RotateCcw size={13} /> Reset All Bubbles
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsWidgetOpen(true)}
              className="flex items-center gap-2 text-xs font-medium text-foreground group focus-visible:outline-none"
              title="Click to manage Bubble Wrap background"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-base group-hover:scale-110 transition-transform">
                🫧
              </span>
              <span className="hidden sm:inline font-semibold">
                Bubble Wrap:
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary/15 text-primary text-[11px] font-bold">
                {poppedCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
