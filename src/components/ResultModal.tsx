import type { WheelSegment } from "./SpinWheel";

interface ResultModalProps {
  name: string;
  result: WheelSegment;
  onClose: () => void;
}

export function ResultModal({ name, result, onClose }: ResultModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "hsla(20 15% 12% / 0.6)" }}
      onClick={onClose}
    >
      <div
        className="result-pop relative bg-card rounded-sm text-center max-w-sm w-full overflow-hidden"
        style={{
          border: "4px solid hsl(4 72% 38%)",
          boxShadow: "0 12px 48px hsl(4 72% 38% / 0.35)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div
          className="h-3 w-full"
          style={{ background: "hsl(4 72% 38%)" }}
        />

        <div className="px-8 pt-8 pb-10 flex flex-col items-center gap-4">
          {/* Star icon */}
          <div
            className="text-4xl"
            role="img"
            aria-label="selamat"
          >
            🎊
          </div>

          <div>
            <p
              className="text-xs font-bold tracking-widest uppercase mb-1"
              style={{ color: "hsl(4 72% 38%)" }}
            >
              Selamat, {name}!
            </p>
            <h2
              className="text-2xl font-bold text-foreground"
              style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.01em" }}
            >
              Kamu mendapatkan
            </h2>
          </div>

          {/* Prize box */}
          <div
            className="w-full py-5 rounded-sm"
            style={{
              background: result.color,
              border: "2px solid hsl(0 0% 0% / 0.08)",
            }}
          >
            <p
              className="text-3xl font-bold"
              style={{
                color: result.textColor,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              {result.label}
            </p>
          </div>

          <p className="text-muted-foreground text-sm">
            THR-mu sudah ditentukan! Semoga berkah. 🌙
          </p>

          <button
            onClick={onClose}
            className="close-btn"
          >
            Putar Lagi
          </button>
        </div>
      </div>

      <style>{`
        .close-btn {
          background: hsl(145 45% 28%);
          color: hsl(0 0% 100%);
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: 0.95rem;
          letter-spacing: 0.03em;
          padding: 11px 32px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 4px 0 hsl(145 45% 16%);
          transition: transform 120ms ease-out, box-shadow 120ms ease-out;
          margin-top: 4px;
        }
        .close-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 hsl(145 45% 16%), 0 10px 20px hsl(145 45% 28% / 0.25);
        }
        .close-btn:active {
          transform: translateY(2px) scale(0.97);
          box-shadow: 0 2px 0 hsl(145 45% 16%);
        }
      `}</style>
    </div>
  );
}
