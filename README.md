# 🎉 Roda Putar THR (THR Spin Wheel)

An interactive, festive web application to gamify the tradition of giving *Tunjangan Hari Raya* (THR) during Eid al-Fitr.

## ✨ Features

- **Interactive Spin Wheel**: A smooth, canvas-based animation with realistic deceleration.
- **Festive Eid Theme**: Elegant design using a curated color palette (Red, Gold, Green) and classic typography.
- **Personalized Experience**: Users enter their name to participate.
- **Responsive Design**: Works perfectly on both Mobile and Desktop browsers.
- **Smart Result Logic**: Hardcoded probability logic for specific fun interactions.

## 🚀 Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Build Tool)
- **Tailwind CSS** (Styling)
- **Shadcn/UI** (Component library)
- **HTML5 Canvas** (Wheel Rendering)
- **Radix UI** (Accessible primitives)

## 🛠️ Project Structure

- `src/components/SpinWheel.tsx`: Core logic and Canvas rendering for the wheel.
- `src/components/NameInput.tsx`: Initial greeting and name capture form.
- `src/components/ResultModal.tsx`: Visual feedback for the winning outcome.
- `src/pages/Index.tsx`: Main application flow and state management.

## 📦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- [pnpm](https://pnpm.io/) v9 (Managed via Corepack)

### Installation
```bash
# Enable corepack to use the pinned pnpm version
corepack enable

# Install dependencies
pnpm install
```

### Development
```bash
pnpm dev
```

### Build
```bash
pnpm build
```

## 📜 Documentation
Check out the [PRD.md](./PRD.md) for detailed product requirements and the future roadmap.
