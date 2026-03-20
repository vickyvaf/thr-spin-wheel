# Product Requirements Document (PRD) - Roda Putar THR

## 1. Project Overview
**Roda Putar THR** is a web-based interactive application designed to gamify the distribution of *Tunjangan Hari Raya* (THR) during the Eid al-Fitr (Lebaran) celebration. Instead of giving physical envelopes directly, the host (donor) can use this app to let recipients "spin" for their prize amount, adding an element of surprise and fun to the tradition.

## 2. Objectives
- Provide a visually appealing and interactive way to distribute small gifts/bonuses.
- Ensure a smooth user experience on both mobile and desktop devices.
- Offer a festive theme consistent with Eid al-Fitr aesthetics (Red, Gold, Green accents).

## 3. Target Audience
- Individuals hosting family gatherings during Eid.
- Office managers looking for a fun way to distribute symbolic bonuses.
- Families celebrating Lebaran together.

## 4. Functional Requirements

### 4.1. User Identification
- **Requirement**: Users must enter their name before spinning.
- **Details**: A simple input field focused on the welcome screen.
- **Validation**: Name cannot be empty.

### 4.2. Spin Wheel Interaction
- **Requirement**: A physics-based animated wheel.
- **Details**:
    - The wheel should be divided into 8 segments with different prize values.
    - Animation must include an "ease-out" effect to feel natural.
    - A "Spin" button starts the animation and becomes disabled during the spin.

### 4.3. Prize Logic (Outcome Determination)
- **Requirement**: The outcome is determined the moment the spin starts.
- **Current Logic**:
    - Default prize: Rp 2.000.
    - Special prize: Rp 50.000 (Triggered by specific names like "Vicky").
- **Goal**: In future versions, this should be configurable via an Admin Panel.

### 4.4. Result Presentation
- **Requirement**: A modal pop-up displaying the final result.
- **Details**:
    - Show the recipient's name and the prize won.
    - Provide a "Spin Again" option to reset the flow.

## 5. Non-Functional Requirements
- **Performance**: The canvas animation must run at 60fps on modern mobile browsers.
- **Aesthetics**: Premium, festive design with Georgia/Serif fonts for a classic look.
- **Reliability**: Result calculations must match the visual landing position precisely.

## 6. Technical Stack
- **Frontend Framework**: React 18 (Vite-powered).
- **Language**: TypeScript.
- **Styling**: Tailwind CSS + Shadcn UI components.
- **Graphics**: HTML5 Canvas API for the Spin Wheel.
- **Deployment**: Optimized for static hosting (Vercel/Netlify/GitHub Pages).

## 7. Future Roadmap
- [ ] **Admin Dashboard**: For setting probabilities and prize pool.
- [ ] **History Log**: Track who won what.
- [ ] **Confetti Effect**: Add JS-based confetti on big wins.
- [ ] **Sound Effects**: Add "click-click" sounds for the wheel and festive music on win.
- [ ] **QR Code Integration**: Easy access for guests via scanned QR.
