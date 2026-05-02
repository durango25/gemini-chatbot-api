# BizAI — AI Business Assistant

Tugas Akhir Pelatihan **Maju Bareng AI** — _AI Productivity and AI API Integration for Developers_ oleh **Hacktiv8**.

BizAI adalah landing page interaktif yang dilengkapi chatbot berbasis AI untuk membantu pengunjung mendapatkan konsultasi bisnis secara instan. Ditenagai oleh **Google Gemini AI**.

---

## ✨ Fitur

- Landing page responsif (Tailwind CSS) dengan Hero, Manfaat, Fitur, Testimoni, dan CTA
- Floating chat widget di pojok kanan bawah
- Auto-greeting saat chat pertama dibuka
- Quick suggestion chips
- Konteks percakapan (session-based conversation history)
- Render markdown dari respons AI (bold, italic, list, heading, code)
- Animasi loading dots saat menunggu respons

---

## 🏗️ Tech Stack

| Layer    | Teknologi                           |
| -------- | ----------------------------------- |
| Frontend | HTML, Tailwind CSS, Vanilla JS      |
| Backend  | Node.js, Express                    |
| AI       | Google Gemini API (`@google/genai`) |

---

## 📁 Struktur Proyek

```
gemini-chatbot-api/
├── index.js          # Express server + Gemini API integration
├── package.json
├── .env.example      # Template environment variables
└── public/
    ├── index.html    # Landing page + chat widget
    ├── script.js     # Frontend logic
    ├── style.css     # Custom styles
    └── favicon.ico
```

---

## 🚀 Cara Instalasi

### Prasyarat

- Node.js v18 atau lebih baru
- Google Gemini API Key → [aistudio.google.com](https://aistudio.google.com)

### Langkah-langkah

1. **Clone repository**

   ```bash
   git clone <url-repo-ini>
   cd gemini-chatbot-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Buat file `.env`** dari template yang tersedia

   ```bash
   cp .env.example .env
   ```

4. **Isi API Key** di file `.env`

   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash-lite
   ```

5. **Jalankan server**

   ```bash
   node index.js
   ```

6. **Buka di browser**

   ```
   http://localhost:3000
   ```

---

## 📡 API Endpoint

### `POST /api/chat`

**Request body:**

```json
{
  "conversation": [
    {
      "role": "user",
      "text": "Saya punya bisnis kuliner, bagaimana cara meningkatkan penjualan?"
    }
  ]
}
```

**Response:**

```json
{
  "reply": "Untuk bisnis kuliner, Anda bisa mulai dengan memanfaatkan AI untuk analisis pelanggan..."
}
```

---

## 🔑 Environment Variables

| Variable         | Keterangan                    |
| ---------------- | ----------------------------- |
| `PORT`           | Port server (default: `3000`) |
| `GEMINI_API_KEY` | API Key dari Google AI Studio |
| `GEMINI_MODEL`   | Model Gemini yang digunakan   |

---

## 👤 Author

**Hanggara Bima Pramesti**  
Peserta Pelatihan Maju Bareng AI — Hacktiv8
