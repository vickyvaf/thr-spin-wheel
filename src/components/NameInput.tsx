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

  const hijriYear = new Intl.DateTimeFormat("en-u-ca-islamic-uma", {
    year: "numeric",
  })
    .format(new Date())
    .replace(/\D/g, "");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1
          className="text-5xl font-bold text-foreground mb-3 leading-tight"
          style={{ 
            fontFamily: "Georgia, serif", 
            letterSpacing: "-0.02em",
            textShadow: "0 1px 2px rgba(255,255,255,0.8)" 
          }}
        >
          Dapatkan THR🤑
        </h1>
        <p className="text-foreground/80 text-base max-w-sm mx-auto font-medium">
          Masukkan namamu untuk mulai memutar roda dan dapatkan THR-mu!
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm mx-auto flex flex-col gap-4"
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
            autoComplete="off"
            maxLength={40}
            style={{
              border: hasError
                ? "2px solid hsl(138 48% 30%)"
                : "2px solid hsl(36 20% 75%)",
              background: "rgba(255, 255, 255, 0.6)",
              color: "hsl(20 15% 12%)",
              padding: "12px 16px",
              borderRadius: "9999px",
              fontSize: "1.05rem",
              fontFamily: "Georgia, serif",
              outline: "none",
              transition: "border-color 150ms ease",
              width: "100%",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "hsl(138 48% 30%)";
            }}
          />
          {hasError && (
            <p className="text-sm" style={{ color: "hsl(138 48% 30%)" }}>
              Nama tidak boleh kosong.
            </p>
          )}
        </div>

        <button type="submit" className="submit-btn">
          Lanjut ke Roda Putar →
        </button>
      </form>

      <style>{`
        .submit-btn {
          background: hsl(138 48% 30%);
          color: hsl(36 80% 96%);
          font-family: Georgia, serif;
          font-weight: bold;
          font-size: 1rem;
          letter-spacing: 0.03em;
          padding: 13px 28px;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          box-shadow: 0 4px 0 hsl(138 48% 18%);
          transition: transform 120ms ease-out, box-shadow 120ms ease-out;
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 0 hsl(138 48% 18%), 0 10px 20px hsl(138 48% 30% / 0.25);
        }
        .submit-btn:active {
          transform: translateY(2px) scale(0.97);
          box-shadow: 0 2px 0 hsl(138 48% 18%);
        }
      `}</style>
    </div>
  );
}
