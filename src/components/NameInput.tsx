import { useState } from "react";

interface NameInputProps {
  onSubmit: (name: string) => void;
}

export function NameInput({ onSubmit }: NameInputProps) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);

  const trimmed = value.trim();
  const hasError = touched && trimmed.length === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (trimmed.length > 0) onSubmit(trimmed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-block border-4 border-primary rounded-sm px-5 py-1 mb-4">
          <span className="text-primary font-bold tracking-widest text-xs uppercase">
            Selamat Hari Raya
          </span>
        </div>
        <h1
          className="text-5xl font-bold text-foreground mb-3 leading-tight"
          style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
        >
          Roda Putar THR
        </h1>
        <p className="text-muted-foreground text-base max-w-sm mx-auto">
          Masukkan namamu untuk mulai memutar roda dan dapatkan THR-mu!
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="name"
            className="text-sm font-bold uppercase tracking-wider text-foreground"
          >
            Nama Kamu
          </label>
          <input
            id="name"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Tulis nama lengkapmu..."
            autoFocus
            maxLength={40}
            style={{
              border: hasError
                ? "2px solid hsl(4 72% 38%)"
                : "2px solid hsl(36 20% 75%)",
              background: "hsl(0 0% 100%)",
              color: "hsl(20 15% 12%)",
              padding: "12px 16px",
              borderRadius: "4px",
              fontSize: "1.05rem",
              fontFamily: "Georgia, serif",
              outline: "none",
              transition: "border-color 150ms ease",
              width: "100%",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "hsl(4 72% 38%)";
            }}
          />
          {hasError && (
            <p className="text-sm" style={{ color: "hsl(4 72% 38%)" }}>
              Nama tidak boleh kosong.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
        >
          Lanjut ke Roda Putar →
        </button>
      </form>

      {/* Decorative dividers */}
      <div className="mt-12 flex items-center gap-3">
        <div className="h-px w-12 bg-border" />
        <span className="text-muted-foreground text-xs tracking-widest uppercase">
          THR 1445 H
        </span>
        <div className="h-px w-12 bg-border" />
      </div>

      <style>{`
        .submit-btn {
          background: hsl(4 72% 38%);
          color: hsl(36 80% 96%);
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: 1rem;
          letter-spacing: 0.03em;
          padding: 13px 28px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          box-shadow: 0 4px 0 hsl(4 72% 22%);
          transition: transform 120ms ease-out, box-shadow 120ms ease-out;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 hsl(4 72% 22%), 0 10px 20px hsl(4 72% 38% / 0.25);
        }
        .submit-btn:active {
          transform: translateY(2px) scale(0.97);
          box-shadow: 0 2px 0 hsl(4 72% 22%);
        }
      `}</style>
    </div>
  );
}
