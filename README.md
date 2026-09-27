# AI Political Poster Maker — Frontend Client

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-political-poster-maker-client.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_16-App_Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Modern_UI-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A fullstack Next.js web application designed to generate authentic, print-ready (1200×1600 px) Bangladeshi political posters for national events (Victory Day), election campaigns, and memorial tributes.

🌐 **Live Deployed Application:** [https://ai-political-poster-maker-client.vercel.app](https://ai-political-poster-maker-client.vercel.app)

---

## 🎨 Sample Generated Output

Below is an authentic 1200×1600px political poster generated through the platform:

<div align="center">
  <img src="public/sample-poster.png" alt="Sample Generated Political Poster" width="400" style="border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);" />
  <p><em>Generated with 100% correct Bengali TrueType font (Kalpurush), top leader circular vignettes, and gold borders.</em></p>
</div>

---

## 💡 AI-Assisted UI/UX Design

> **Design Attribution:**  
> Special thanks to **Google Gemini** for assisting in the UI/UX design, layout wireframing, color palette harmony (Bangladeshi patriotic green `#006A4E` & red `#F42A41`), and intuitive form workflows. Gemini's recommendations helped achieve a clean, modern aesthetic while maintaining authentic cultural design traditions.

---

## ✨ Features

- **Template Selection Gallery:** Browse pre-configured templates categorized by occasion (`All`, `Victory Day`, `Campaign`, `Memorial`) with color palette swatches and 3:4 preview cards.
- **Bengali Candidate Input Form:** Intuitive form for entering Bengali political text (Candidate Name, Designation, Political Party, Locality, Main Slogan, and Sponsoring Line).
- **Drag-and-Drop Photo Uploads:** Integrated with Cloudinary. Supports candidate portraits and up to two party leaders with instant image preview.
- **Asynchronous Status Polling Screen:** Non-blocking generation screen with dynamic step-by-step progress feedback:
  1. *Analyzing occasion and designing color harmony (Gemini AI)*
  2. *Rendering 1200×1600 canvas with Kalpurush TrueType Bengali typography*
  3. *Finalizing composite and streaming high-resolution PNG to Cloudinary CDN*
- **1-Click High-Res PNG Download:** Downloads the print-ready 1200×1600 PNG directly to disk via in-memory Blob conversion (bypassing cross-origin browser tab redirection).
- **Bounded Poster Regeneration Modal:** Allows tweaking slogans and re-generating fresh design palettes (strictly capped at 3 regenerations per poster to conserve resources).
- **User Poster History Dashboard (`/history`):** Complete gallery of past generated posters with status badges, creation timestamps, and 1-click re-download options.
- **Persistent JWT Authentication:** Secure login, registration, and persistent user session management via React `AuthContext`.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **API Client:** Custom modular `apiClient` (`lib/api-client.ts`) with automatic `Authorization: Bearer <token>` injection
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```
client/
├── public/                     # Static assets and sample generated posters
│   └── sample-poster.png
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── create/page.tsx     # Candidate form & template switcher
│   │   ├── history/page.tsx    # User poster history dashboard
│   │   ├── login/page.tsx      # Sign in page
│   │   ├── preview/[id]/page.tsx # Live preview & status polling screen
│   │   ├── register/page.tsx   # Sign up page
│   │   ├── layout.tsx          # Root layout with Navbar and Footer
│   │   └── page.tsx            # Template selection gallery (Homepage)
│   ├── components/             # Reusable UI components
│   │   ├── DownloadButton.tsx  # Direct blob-to-disk PNG download button
│   │   ├── HistoryPosterCard.tsx # Dashboard poster card
│   │   ├── Navbar.tsx          # Responsive navigation bar with auth state
│   │   ├── OccasionFilter.tsx  # Occasion category filter buttons
│   │   ├── PhotoUploadDropzone.tsx # Drag & drop image uploader
│   │   ├── PosterForm.tsx      # Multi-section candidate input form
│   │   ├── RegenerateModal.tsx # Bounded regeneration modal
│   │   └── TemplateCard.tsx    # Gallery template display card
│   ├── context/
│   │   └── AuthContext.tsx     # JWT authentication session provider
│   ├── lib/
│   │   ├── api-client.ts       # Centralized Fetch HTTP client wrapper
│   │   └── utils.ts            # Utility helpers (cn, formatDate, toBengaliDigits)
│   └── types/                  # TypeScript interface definitions
│       ├── poster.ts
│       └── template.ts
├── vercel.json                 # Vercel cloud deployment configuration
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- Node.js v20+ or v22+
- Running backend server (default: `http://localhost:5000`)

### 2. Installation
```bash
# Navigate to the client directory
cd client

# Install dependencies
npm install
```

### 3. Environment Configuration
Create a `.env.local` file inside the `client/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> **For Production:** Set `NEXT_PUBLIC_API_URL` to your live deployed backend URL (e.g., `https://ai-political-poster-server.onrender.com`).

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment (Vercel)

This frontend is configured for zero-configuration deployment on **Vercel**:

1. Import the `AI-Political-Poster-Maker-Client` repository into [Vercel](https://vercel.com).
2. Framework Preset: **Next.js**.
3. Set the Environment Variable:
   - `NEXT_PUBLIC_API_URL`: Your live backend server URL.
4. Click **Deploy**.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
