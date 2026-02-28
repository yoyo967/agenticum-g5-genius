# 🎨 UI/UX HANDBOOK: THE G5 AESTHETIC

## 1. Design Philosophy: "Obsidian & Chrome"

The AGENTICUM G5 interface is designed to evoke power, autonomy, and technological superiority. It is not a "tool"; it is an **Operating System for the future of work**.

### **Core Tenets:**

- **Zero-Depth Transparency**: Use "Glassmorphism" to show the neural substrate beneath the logic.
- **Holographic Precision**: Elements should feel projected rather than rendered.
- **Technical Pulsing**: Icons and status badges should breathe at different frequencies (e.g., SN-00 at 0.5Hz, RA-01 at 0.3Hz).

## 2. Visual Palette (GenIUS Suite)

The G5 color system is built on deep darks and vibrant, tactical accents.

| Element                | Color / HSL              | CSS Variable       |
| ---------------------- | ------------------------ | ------------------ |
| **Midnight (Base)**    | `#0A0118`                | `--color-midnight` |
| **Obsidian (Panels)**  | `#0D0D12`                | `--color-obsidian` |
| **Accent (Cyan)**      | `#00E5FF`                | `--color-accent`   |
| **Gold (Strategic)**   | `#FBBC04`                | `--color-gold`     |
| **Magenta (Creative)** | `#FF007A`                | `--color-magenta`  |
| **Grid Lines**         | `rgba(255,255,255,0.03)` | `--color-grid`     |

## 3. Typography: The Display Hierarchy

- **Font Primary**: _Inter_ (Clean, Sans-serif)
- **Font Display**: _Outfit_ (Black/Bold for Headlines)
- **Font Mono**: _JetBrains Mono_ (For telemetry and code snippets)

## 4. Animation Theory (Framer Motion)

- **The GenIUS Entrance**: Every module enters with a `scale: 1.05` to `1.0` and a `blur(30px)` to `0`. This creates a "Holographic Focusing" effect.
- **Neural Pulse**: Status badges use a `scale: [1, 1.1, 1]` and `opacity: [0.5, 0.8, 0.5]` loop.
- **Micro-Interactions**: Buttons use a `repeat: Infinity` ping effect when an agent is active.

## 5. Component Standards

- **Ultra-Lucid Cards**: 1px border with `border-white/5` and `backdrop-blur-3xl`.
- **Status Badges**: Always uppercase, tracking-widest, with a pulsing dot.
- **Scanlines**: A 3% opacity CSS overlay to maintain the "Retro-Futuristic Terminal" feel.

---

_Status: NEURAL_DESIGN_VERIFIED_
