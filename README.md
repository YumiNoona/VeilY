<div align="center">

# 🌕 Veily

### Chat Mockup Design Tool

Create pixel-perfect chat screenshots for 20+ platforms. No signup. No paywall. Just beautiful mockups.

[![Live Web App](https://img.shields.io/badge/🌐_Live_App-veily.app-00ff41?style=for-the-badge)](https://veily.app)
[![Download Desktop](https://img.shields.io/badge/⬇️_Download-.exe-ff6600?style=for-the-badge)](https://github.com/YumiNoona/VeilY/releases/latest)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![Tauri](https://img.shields.io/badge/Tauri-Desktop-FFC131?style=flat-square&logo=tauri)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>

---

## ✨ Features

### 💬 Chat Mockups
- **20+ Platforms** — WhatsApp, iMessage, Discord, Instagram, Telegram, Signal, Snapchat, Slack, Teams, WeChat, LINE, Reddit, X, Messenger, TikTok, Tinder, Facebook, LinkedIn
- **Pixel-perfect rendering** — Every platform faithfully recreated with proper colors, fonts, bubble shapes, read receipts, and platform-specific UI elements
- **Dark & Light mode** — Full theme support per platform
- **Typing indicators, timestamps, status messages** — All the small details that make mockups look real

### 🤖 AI Chat
- **4 AI platforms** — ChatGPT, Claude (4.8 Opus), Gemini (2.5 Pro), Grok (4)
- **Dumb & fun scenarios** — 20 pre-built Q&A scenarios that feel genuinely human
- **Custom model selection** — Pick from GPT-4.1, Claude 4.8 Opus, Gemini 2.5 Pro, Grok 4 and more

### 🎨 Social & Comments
- **Social post mockups** — Twitter/X, Instagram, LinkedIn, Facebook, Reddit posts with likes, comments, reposts, views
- **Comment threads** — YouTube, TikTok, Instagram, Twitter comment sections
- **20 randomized scenarios** per tab — Fresh content every time you hit randomize

### 📧 Email Preview
- **Gmail, Outlook, Generic** email providers
- **Redacted text** — Black-box sensitive content using `**double asterisks**`
- **Attachments, timestamps, participant fields**

### 📸 Stories
- **Instagram & Snapchat** story mockups
- **15 photo templates** with unique Unsplash imagery
- **Multiple slides** with captions and timestamps

### 🔧 Editor Features
- **30 chat templates + 60 randomize scenarios** (Global & Indian styles)
- **20 scenarios each** for Social, Comments, Email, and Stories randomize
- **Bulk import** of real WhatsApp `.txt` and Telegram `.json` exports
- **AI Smart Fill** — Generate entire conversations with one click using Gemini
- **Full customization** — Names, avatars, timestamps, wallpapers, device frames, fonts, chat style

### 🖥️ Desktop App
- **Tauri native app** — Windows/macOS executables with auto-updates from GitHub releases
- **Fully offline** — Everything runs locally. No server dependencies.
- **Update checker** — Notifies when a new version is available on GitHub

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- (Optional) Google Gemini API key for AI Smart Fill
- (Optional) Rust toolchain for Tauri desktop builds

### Quick Start
```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Build for production
npm run build

# 4. Optional: Set AI key for Smart Fill
echo "VITE_GEMINI_API_KEY=your_key_here" > .env
```

### Tauri Desktop
```bash
# Development
npm run tauri:dev

# Production build
npm run tauri:build
```

---

## 📂 Project Structure

```text
Veily/
├── src/
│   ├── components/
│   │   ├── platforms/          # 20+ chat platform renderers
│   │   ├── social/              # Social post renderers
│   │   ├── comments/            # Comment thread renderers
│   │   ├── modals/              # Dialog modals (Support, Download, etc.)
│   │   ├── sidebar/sections/   # Editor sidebar sections
│   │   └── ui/                  # ShadCN UI primitives
│   ├── hooks/
│   │   ├── useChatState.ts      # Chat state management
│   │   ├── scenarios.ts         # 60 chat randomize scenarios
│   │   └── scenarios/           # Social, Comments, Email, Stories scenarios
│   ├── lib/
│   │   ├── templates/           # Modular template files (30 chat, 15 stories, etc.)
│   │   ├── avatar-utils.ts      # Gendered avatar generation
│   │   └── ai-utils.ts          # Gemini AI integration
│   ├── pages/                   # Route pages (Index, AIChat, Social, etc.)
│   ├── contexts/                # AuthContext (local-only premium user)
│   └── types/                   # TypeScript type definitions
├── src-tauri/                   # Tauri Rust backend
├── public/                      # Static assets
├── index.html                   # Entry point
└── package.json
```

---

## 🎮 Powered By

| Layer | Technology |
|---|---|
| **UI Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **Styling** | TailwindCSS 3 + ShadCN UI |
| **Desktop Shell** | Tauri 2 (Rust) |
| **AI (Optional)** | Google Gemini API |
| **Animations** | CSS + Lucide React Icons |

---

## 📝 License

MIT License — see [LICENSE](./LICENSE) file.

---

<div align="center">

**Veily** is built with ❤️ by [Vexo Labs](https://vexo.venusapp.in)

</div>
