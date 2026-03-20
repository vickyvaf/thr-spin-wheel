import { useRef, useEffect, useState, useCallback } from "react";

export interface WheelSegment {
  label: string;
  color: string;
  textColor: string;
}

// Segments layout (8 slots):
// Index: 0=2rb, 1=5rb, 2=2rb, 3=10rb, 4=2rb, 5=20rb, 6=2rb, 7=50rb
const SEGMENTS: WheelSegment[] = [
  { label: "Rp 2.000",  color: "hsl(4 72% 38%)",   textColor: "#fff8f0" },
  { label: "Rp 5.000",  color: "hsl(36 85% 48%)",  textColor: "#1a0a00" },
  { label: "Rp 2.000",  color: "hsl(145 45% 28%)", textColor: "#f0fff4" },
  { label: "Rp 10.000", color: "hsl(214 60% 28%)", textColor: "#f0f7ff" },
  { label: "Rp 2.000",  color: "hsl(4 72% 38%)",   textColor: "#fff8f0" },
  { label: "Rp 20.000", color: "hsl(36 85% 48%)",  textColor: "#1a0a00" },
  { label: "Rp 2.000",  color: "hsl(145 45% 28%)", textColor: "#f0fff4" },
  { label: "Rp 50.000", color: "hsl(214 60% 28%)", textColor: "#f0f7ff" },
];

// Win-index rules
const IDX_2000  = [0, 2, 4, 6]; // default → always Rp 2.000
const IDX_50000 = 7;             // vicky → Rp 50.000

function pickWinIndex(name: string): number {
  const lower = name.trim().toLowerCase();
  if (lower === "vicky") return IDX_50000;
  // default: always Rp 2.000 — pick one of the four 2.000 slots randomly
  return IDX_2000[Math.floor(Math.random() * IDX_2000.length)];
}

const TOTAL = SEGMENTS.length;
const ARC = (2 * Math.PI) / TOTAL;

interface SpinWheelProps {
  name: string;
  onResult: (segment: WheelSegment) => void;
  disabled: boolean;
}

export function SpinWheel({ name, onResult, disabled }: SpinWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0); // current rotation in radians
  const animRef = useRef<number | null>(null);
  const [spinning, setSpinning] = useState(false);

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
    ctx.strokeStyle = "hsl(4 72% 38%)";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, SIZE * 0.025, 0, 2 * Math.PI);
    ctx.fillStyle = "hsl(4 72% 38%)";
    ctx.fill();

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "hsl(4 72% 30%)";
    ctx.lineWidth = 5;
    ctx.stroke();
  }, []);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  const spin = useCallback(() => {
    if (spinning || disabled) return;

    // Pick a random winning segment
    const winIndex = Math.floor(Math.random() * TOTAL);

    // Target angle: pointer is at top (−π/2).
    // We want the center of winIndex segment to land at top.
    // winIndex segment center is at: winIndex * ARC + ARC/2 (from rotation=0)
    // We need: rotation + winIndex * ARC + ARC/2 = -π/2 + 2πk
    // So targetRotation = -π/2 - winIndex * ARC - ARC/2 + 2πk
    const fullSpins = 6 + Math.floor(Math.random() * 3); // 6–8 full spins
    const targetAngle = -Math.PI / 2 - winIndex * ARC - ARC / 2;
    const totalRotation = fullSpins * 2 * Math.PI + targetAngle;

    const startRotation = rotationRef.current;
    const deltaRotation = totalRotation - (startRotation % (2 * Math.PI)) + 2 * Math.PI * fullSpins;

    const duration = 5000; // ms
    let startTime: number | null = null;

    setSpinning(true);

    // Custom easing: fast start, slow end (cubic ease-out)
    const ease = (t: number) => 1 - Math.pow(1 - t, 3.5);

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = ease(t);

      rotationRef.current = startRotation + deltaRotation * eased;
      drawWheel(rotationRef.current);

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
  }, [spinning, disabled, drawWheel, onResult]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Pointer */}
      <div className="relative w-fit">
        {/* Triangle pointer at top */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-3 z-10"
          style={{
            width: 0,
            height: 0,
            borderLeft: "14px solid transparent",
            borderRight: "14px solid transparent",
            borderTop: "28px solid hsl(4 72% 38%)",
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
          }}
        />
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="spin-wheel-container block"
          style={{ borderRadius: "50%" }}
        />
      </div>

      <button
        onClick={spin}
        disabled={spinning || disabled}
        className="spin-btn"
      >
        {spinning ? "Sedang Memutar…" : "🎉 PUTAR SEKARANG"}
      </button>

      <style>{`
        .spin-btn {
          background: hsl(4 72% 38%);
          color: hsl(36 80% 96%);
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
          padding: 14px 42px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 4px 0 hsl(4 72% 22%), 0 6px 16px hsl(4 72% 38% / 0.3);
          transition: transform 120ms ease-out, box-shadow 120ms ease-out;
        }
        .spin-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 hsl(4 72% 22%), 0 10px 24px hsl(4 72% 38% / 0.35);
        }
        .spin-btn:active:not(:disabled) {
          transform: translateY(2px) scale(0.97);
          box-shadow: 0 2px 0 hsl(4 72% 22%), 0 4px 10px hsl(4 72% 38% / 0.2);
        }
        .spin-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
