import { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import confetti from "canvas-confetti";
import { NameInput } from "@/components/NameInput";
import { SpinWheel, type WheelSegment } from "@/components/SpinWheel";
import { ResultModal } from "@/components/ResultModal";
import { Music, Music2, BellRing, BellOff } from "lucide-react";

type Step = "input" | "wheel";

const Index = () => {
  const { width, height } = useWindowSize();
  const [step, setStep] = useState<Step>("input");
  const [name, setName] = useState("");
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [isBacksoundMuted, setIsBacksoundMuted] = useState(false);
  const [isTickMuted, setIsTickMuted] = useState(false);

  useEffect(() => {
    if (result) {
      const colors = ["#28713E", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

      // Tembakan pertama (dari bawah tengah)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 1 },
        zIndex: 9999,
        colors: colors,
      });

      // Tembakan samping (kiri bawah dan kanan bawah) untuk kemeriahan ekstra
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 1 },
          zIndex: 9999,
          colors: colors,
        });
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 1 },
          zIndex: 9999,
          colors: colors,
        });
      }, 250);
    }
  }, [result]);

  useEffect(() => {
    let audio: HTMLAudioElement | null = null;

    if (step === "wheel") {
      audio = new Audio("/backsound.mp3");
      audio.loop = true;
      audio.volume = 0.2;
      audio.muted = isBacksoundMuted;
      audio.play().catch((err) => {
        console.warn("Autoplay audio blocked:", err);
      });
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.src = "";
      }
    };
  }, [step, isBacksoundMuted]);

  const handleNameSubmit = (n: string) => {
    setName(n);
    setStep("wheel");
  };

  const handleResult = (seg: WheelSegment) => {
    setResult(seg);
  };

  const handleCloseResult = () => {
    setResult(null);
    setSpinCount((c) => c + 1);
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {step === "input" && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <NameInput onSubmit={handleNameSubmit} />
          </div>
        </div>
      )}

      {step === "wheel" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {/* Main Content Area (No Background) */}
          <div className="flex flex-col items-center">
            {/* Header */}
            <div className="mb-8 text-center max-w-md w-full">
              <h1
                className="text-4xl font-bold text-foreground leading-tight mb-2"
                style={{
                  fontFamily: "Georgia, serif",
                  letterSpacing: "-0.02em",
                  textShadow: "0 1px 2px rgba(255,255,255,0.8)",
                }}
              >
                Dapatkan THR🤑
              </h1>
              <p className="text-foreground/80 text-sm mb-6 font-medium">
                Halo, <span className="font-bold text-foreground">{name}</span>!
                Putar roda untuk mendapatkan THR-mu.
              </p>

              <SpinWheel
                key={spinCount}
                name={name}
                onResult={handleResult}
                disabled={!!result}
                isTickMuted={isTickMuted}
              />

              {/* Back link */}
              <button
                onClick={() => {
                  setStep("input");
                  setResult(null);
                  setSpinCount(0);
                }}
                className="mt-8 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ← Ganti nama
              </button>
            </div>
          </div>
        </div>
      )}

      {result && (
        <ResultModal name={name} result={result} onClose={handleCloseResult} />
      )}

      {/* Floating Audio Controls */}
      <div className="fixed top-8 right-8 z-50 flex items-center gap-3">
        {/* Backsound Control */}
        <button
          onClick={() => setIsBacksoundMuted(!isBacksoundMuted)}
          className="flex items-center p-3.5 rounded-full bg-white border border-border shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-primary hover:bg-slate-50 transition-all active:scale-95 group focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label={isBacksoundMuted ? "Unmute Backsound" : "Mute Backsound"}
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-sm font-medium pl-0 group-hover:pl-2">
            {isBacksoundMuted ? "Music Off" : "Music On"}
          </span>
          <div className="relative">
            {isBacksoundMuted ? (
              <Music2 className="w-5 h-5 opacity-40" />
            ) : (
              <Music className="w-5 h-5 transition-transform group-hover:scale-110" />
            )}
          </div>
        </button>

        {/* Tick Sound Control */}
        <button
          onClick={() => setIsTickMuted(!isTickMuted)}
          className="flex items-center p-3.5 rounded-full bg-white border border-border shadow-[0_4px_20px_rgba(0,0,0,0.15)] text-primary hover:bg-slate-50 transition-all active:scale-95 group focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label={isTickMuted ? "Unmute Tick Sound" : "Mute Tick Sound"}
        >
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-sm font-medium pl-0 group-hover:pl-2">
            {isTickMuted ? "Tick Off" : "Tick On"}
          </span>
          <div className="relative">
            {isTickMuted ? (
              <BellOff className="w-5 h-5 opacity-40" />
            ) : (
              <BellRing className="w-5 h-5" />
            )}
          </div>
        </button>
      </div>

      <style>{`
        @keyframes bell-shake {
          0%, 100% { transform: rotate(0); }
          10%, 20% { transform: rotate(15deg); }
          30%, 40% { transform: rotate(-15deg); }
          50%, 60% { transform: rotate(10deg); }
          70%, 80% { transform: rotate(-10deg); }
          90% { transform: rotate(5deg); }
        }
      `}</style>
    </div>
  );
};

export default Index;
