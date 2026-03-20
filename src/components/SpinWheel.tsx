import { useRef, useEffect, useState, useCallback } from "react";

export interface WheelSegment {
  label: string;
  color: string;
  textColor: string;
}

// Segments layout (8 slots):
// Index: 0=2rb, 1=5rb, 2=2rb, 3=10rb, 4=2rb, 5=20rb, 6=2rb, 7=100rb
const SEGMENTS: WheelSegment[] = [
  { label: "Rp 2.000", color: "hsl(138 48% 30%)", textColor: "#fff8f0" },
  { label: "Rp 5.000", color: "hsl(36 85% 48%)", textColor: "#1a0a00" },
  { label: "Rp 2.000", color: "hsl(145 45% 28%)", textColor: "#f0fff4" },
  { label: "Rp 10.000", color: "hsl(36 85% 48%)", textColor: "#1a0a00" },
  { label: "Rp 50.000", color: "hsl(214 60% 28%)", textColor: "#f0f7ff" },
  { label: "Rp 20.000", color: "hsl(36 85% 48%)", textColor: "#1a0a00" },
  { label: "Rp 2.000", color: "hsl(145 45% 28%)", textColor: "#f0fff4" },
  { label: "Rp 100.000", color: "hsl(214 60% 28%)", textColor: "#f0f7ff" },
];

// Aturan kemenangan khusus: Tambahkan nama dan indeks hadiah di sini
const WIN_RULES = [
  // { name: "vicky", index: 7 }, // Rp 100.000
];

// Indeks hadiah bawaan (Rp 2.000) untuk pengguna lain
// const DEFAULT_INDICES = [0, 1, 2, 3, 6];
const DEFAULT_INDICES = [0, 1, 2, 3, 4, 5, 6, 7];

function pickWinIndex(name: string): number {
  const lowerName = name.trim().toLowerCase();
  const specialRule = WIN_RULES.find(
    (rule) => rule.name.toLowerCase() === lowerName,
  );

  if (specialRule) {
    return specialRule.index;
  }

  // default: pilih salah satu dari indeks fallback secara acak
  return DEFAULT_INDICES[Math.floor(Math.random() * DEFAULT_INDICES.length)];
}

const TOTAL = SEGMENTS.length;
const ARC = (2 * Math.PI) / TOTAL;

interface SpinWheelProps {
  name: string;
  onResult: (segment: WheelSegment) => void;
  disabled: boolean;
  isTickMuted?: boolean;
}

export function SpinWheel({
  name,
  onResult,
  disabled,
  isTickMuted = false,
}: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0); // current rotation in radians
  const lastTickRef = useRef(-1); // track the last segment boundary index for sound
  const animRef = useRef<number | null>(null);
  const [spinning, setSpinning] = useState(false);

  // Audio refs for preloading
  const tickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/tick.MP3");
    audio.preload = "auto";
    tickAudioRef.current = audio;
  }, []);

  // Play tick sound using the loaded file
  const playTick = useCallback(() => {
    if (isTickMuted || !tickAudioRef.current) return;
    try {
      // Create a fresh instance for fast-overlapping ticks
      const sound = tickAudioRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 1;
      sound.play().catch(() => {});
    } catch (e) {
      console.warn("Tick sound error", e);
    }
  }, [isTickMuted]);

  const drawWheel = useCallback((rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = canvas.width;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const radius = SIZE / 2 - 6;

    ctx.clearRect(0, 0, SIZE, SIZE);

    // Draw segments
    SEGMENTS.forEach((seg, i) => {
      const startAngle = rotation + i * ARC;
      const endAngle = startAngle + ARC;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + ARC / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = seg.textColor;
      ctx.font = `bold ${SIZE * 0.044}px Georgia, serif`;
      ctx.fillText(seg.label, radius - 14, SIZE * 0.016);
      ctx.restore();
    });

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, SIZE * 0.09, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(36 30% 95%)";
    ctx.fill();
    ctx.strokeStyle = "hsl(138 48% 30%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, SIZE * 0.025, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(138 48% 30%)";
    ctx.fill();

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "hsl(138 48% 23%)";
    ctx.lineWidth = 5;
    ctx.stroke();
  }, []);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (spinning || disabled) return;

    // Determine winning index based on name rules
    const winIndex = pickWinIndex(name);

    // Target angle: pointer sits at top (−π/2).
    // We need the center of winIndex segment to land there.
    const extraSpins = 8;
    const startRotation = rotationRef.current;
    const currentAngle = startRotation % (2 * Math.PI);
    const targetAngle = -Math.PI / 2 - winIndex * ARC - ARC / 2;

    // Calculate how much we need to rotate to reach targetAngle from currentAngle
    let angleToTarget = targetAngle - currentAngle;
    while (angleToTarget < 0) angleToTarget += 2 * Math.PI;

    const deltaRotation = extraSpins * 2 * Math.PI + angleToTarget;

    const duration = 5000; // 5 seconds
    let startTime: number | null = null;

    setSpinning(true);

    // Ease-out: starts fast, decelerates to a smooth stop
    // Power of 4 provides a nice premium "fast-then-slow" feel
    const ease = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = ease(t);

      rotationRef.current = startRotation + deltaRotation * eased;
      drawWheel(rotationRef.current);

      // detect segment boundary crossing for tick sound
      // -rotationRef.current because the wheel rotates clockwise but angle math is counter-clockwise
      const currentTickIdx = Math.floor(rotationRef.current / ARC);
      if (currentTickIdx !== lastTickRef.current) {
        lastTickRef.current = currentTickIdx;
        playTick();
      }

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        rotationRef.current = startRotation + deltaRotation;
        drawWheel(rotationRef.current);
        setSpinning(false);
        onResult(SEGMENTS[winIndex]);
      }
    };

    animRef.current = requestAnimationFrame(animate);
  }, [spinning, disabled, name, drawWheel, onResult]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[380px] mx-auto overflow-visible">
      {/* Pointer */}
      <div className="relative w-full flex justify-center">
        {/* Triangle pointer at top */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-3 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "28px solid hsl(138 48% 30%)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="block w-full h-auto aspect-square"
          style={{ borderRadius: "50%" }}
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || disabled}
        className="spin-btn"
      >
        {spinning ? "Sedang Memutar…" : "PUTAR SEKARANG"}
      </button>

      <style>{`
        .spin-btn {
          background: hsl(138 48% 30%);
          color: hsl(36 80% 96%);
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
          padding: 14px 42px;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 4px 0 hsl(138 48% 18%), 0 6px 16px hsl(138 48% 30% / 0.3);
          transition: transform 120ms ease-out, box-shadow 120ms ease-out;
        }
        .spin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 hsl(138 48% 18%), 0 10px 24px hsl(138 48% 30% / 0.35);
        }
        .spin-btn:active:not(:disabled) {
          transform: translateY(2px) scale(0.97);
          box-shadow: 0 2px 0 hsl(138 48% 18%), 0 4px 10px hsl(138 48% 30% / 0.2);
        }
        .spin-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
