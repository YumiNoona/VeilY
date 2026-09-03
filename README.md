<div align="center">

# Veily

Create editable chat, AI conversation, social post, comment, story, email, and group-call mockups in your browser or on desktop.

[Open the web app](https://veily.venusapp.in/) · [Download the desktop app](https://github.com/YumiNoona/VeilY/releases/latest)

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![Tauri](https://img.shields.io/badge/Tauri-2-FFC131?style=flat-square&logo=tauri)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

</div>

## What Veily includes

- Chat editor for WhatsApp, iMessage, Discord, Instagram, Telegram, Messenger, TikTok, Slack, Reddit, Snapchat, LINE, Teams, Signal, Tinder, WeChat, and X
- Desktop-style chat previews where the platform supports a distinct web layout
- AI conversation previews for ChatGPT, Claude, Gemini, and Grok, including custom model names
- Social post previews for X, Instagram, LinkedIn, Facebook, and Reddit
- Comment previews for Instagram, TikTok, X, and YouTube
- Story, email, and group-call editors
- Call layouts for WhatsApp, Discord, FaceTime, Zoom, and Google Meet
- Editable people, avatars, messages, timestamps, metrics, themes, wallpapers, and device details
- PNG and WebM export at Standard, HD, or 4K output sizes
- Local templates and randomized scenarios with Indian and global conversations

No account is required for the editor. Most work stays in the browser or desktop app.

## Template library

| Editor | Included content |
| --- | --- |
| Chat | 30 templates and more than 60 randomized conversations |
| AI Chat | 11 templates with customizable provider and model labels |
| Social | 10 templates and 20 randomized posts |
| Comments | 5 templates and 20 randomized threads |
| Email | 15 templates and 20 randomized email scenarios |
| Stories | 18 templates and 20 randomized story scenarios |
| Calls | Presets for five calling platforms |

## Local development

### Requirements

- Node.js 20 or newer
- npm
- Rust and the Tauri prerequisites only if you want to run or build the desktop app

```bash
npm install
npm run dev
```

The development server opens at `http://localhost:8080` by default.

### Quality checks

```bash
npm run lint
npm run build
```

### Desktop app

```bash
npm run tauri:dev
npm run tauri:build
```

### Optional Smart Fill keys

Smart Fill can use Groq or Gemini when the corresponding key is available. Keep keys in a local `.env` file; environment files are ignored by Git.

```dotenv
VITE_GROQ_API_KEY=your_key
VITE_GEMINI_API_KEY=your_key
```

## Project structure

```text
Veily/
├── public/                         Static assets
├── src/
│   ├── components/
│   │   ├── platforms/              Chat platform previews
│   │   ├── social/                 Social post previews
│   │   ├── comments/               Comment previews
│   │   ├── call/                   Calling-platform previews
│   │   ├── modals/                 Export, support, import, and update dialogs
│   │   ├── sidebar/sections/       Chat configuration panels
│   │   └── ui/                     Shared UI primitives
│   ├── hooks/                      Editor state and randomized scenarios
│   ├── lib/templates/              Preset content by editor
│   ├── pages/                      Application routes
│   └── types/                      Shared TypeScript models
├── src-tauri/                      Tauri desktop application
├── package.json
└── vite.config.ts
```

## Export notes

- Image export creates a PNG from the active preview only.
- Video export records the active preview as WebM and can restart chat animation before capture.
- Standard preserves the preview dimensions. HD and 4K scale the longest edge up to 1920 and 3840 pixels.
- Browser support for WebM recording depends on `MediaRecorder` and canvas capture support.

## License

Veily is available under the [MIT License](./LICENSE).
