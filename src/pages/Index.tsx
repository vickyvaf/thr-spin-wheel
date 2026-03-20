import { useState } from "react";
import { NameInput } from "@/components/NameInput";
import { SpinWheel, type WheelSegment } from "@/components/SpinWheel";
import { ResultModal } from "@/components/ResultModal";

type Step = "input" | "wheel";

const Index = () => {
  const [step, setStep] = useState<Step>("input");
  const [name, setName] = useState("");
  const [result, setResult] = useState<WheelSegment | null>(null);
  const [spinCount, setSpinCount] = useState(0);

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
      className="min-h-screen"
      style={{ background: "hsl(var(--background))" }}
    >
      {step === "input" && <NameInput onSubmit={handleNameSubmit} />}

      {step === "wheel" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-block border-4 border-primary rounded-sm px-5 py-1 mb-3">
              <span
                className="font-bold tracking-widest text-xs uppercase"
                style={{ color: "hsl(var(--primary))" }}
              >
                Selamat Hari Raya
              </span>
            </div>
            <h1
              className="text-4xl font-bold text-foreground leading-tight mb-2"
              style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
            >
              Roda Putar THR
            </h1>
            <p className="text-muted-foreground text-sm">
              Halo,{" "}
              <span className="font-bold text-foreground">{name}</span>!
              Putar roda untuk mendapatkan THR-mu.
            </p>
          </div>

          <SpinWheel
            key={spinCount}
            name={name}
            onResult={handleResult}
            disabled={!!result}
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
      )}

      {result && (
        <ResultModal
          name={name}
          result={result}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
};

export default Index;
