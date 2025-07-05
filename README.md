# AI Code Generator (Unit Tested)

A responsive, multilingual AI-powered code generation app built with **React**, **TypeScript**, and **Vite**. Users can describe what they want to build, select a language, and generate working code using an AI API (Google Gemini via OpenRouter). It features **dark/light mode**, **typewriter animation**, **language selector**, and **syntax highlighting** with a clean, developer-friendly UI.

📍 **Live Demo**  
[View Live App](https://ai-code-generator-lyart.vercel.app/)

---

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Google Gemini Pro API via OpenRouter
- React Hot Toast
- react-i18next (i18n)
- Prism + React Syntax Highlighter
- Custom Typewriter Hook

---

## 🚀 Features

- AI Code Generation (via Gemini Pro API)
- Multi-language support (English, Español)
- Theme toggle: Dark Mode / Light Mode
- Typewriter effect for output animation
- Language dropdown (JavaScript, Python, C++, TypeScript)
- Syntax highlighting with Prism (One Dark theme)
- Responsive layout with Tailwind CSS
- Copy-to-clipboard functionality
- Toast notifications for feedback

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/archit-react/ai-code-generator.git

# Navigate into the project directory
cd ai-code-generator

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

### ✅ Things Done Differently:

- Used **Google Gemini API** via **OpenRouter** instead of OpenAI (to avoid API costs).
- Implemented **Typewriter effect** with a custom React hook (`useTypewriter`).
- Built **Dark Mode** using `localStorage` + Tailwind `dark` class with full layout adaptation.
- Integrated **react-i18next** for internationalization (English, Spanish).
- Applied **Prism OneDark** theme using `react-syntax-highlighter` for clean code blocks.
- Used Tailwind CSS throughout instead of custom CSS.

### 🛠️ Mistakes Faced:

- ❌ Dark mode was applied but **top white border** stayed in `<body>` due to incorrect root background.
- ❌ `className="dark"` wasn’t taking full effect because `html, body` background wasn’t set globally.
- ❌ Used `className="bg-white"` directly without inheritance, overriding global dark styles.

### 🧪 Fixes:

- ✅ Added `document.body.classList.toggle('dark')` and `localStorage.getItem("theme")` on initial load inside `main.tsx`.
- ✅ Applied `background-color: inherit` on `#root` and `body` to fix **white flash bug**.
- ✅ Used Tailwind’s `dark:bg-...` + `bg-inherit` correctly to control layout-level backgrounds.
- ✅ Set `color-scheme: dark` for full system dark mode support.

---

## 🖌️ Customization Highlights

- Font: System UI
- Background: Dark Gray (`#111827`) with gradient for contrast
- Buttons: Tailwind blue with transitions
- Text Color: White & Muted Gray in dark mode
- Clean component structure with **App.tsx**, `api/generateCode.ts`, `hooks/useTypewriter.ts`
- Smart UX with **toast errors**, **loading state**, **language tag** rendering, and more

---

## ✅ Unit Testing

This project includes unit tests written using **Vitest** (https://vitest.dev/) and **React Testing Library** (https://testing-library.com/) for testing.

### 🔍 Tested Features

- 🌗 Dark mode toggle
- 🌐 Language dropdown (i18n)
- 📋 Copy to clipboard functionality
- 🧪 Mocked `generateCode()` API
- 💡 Custom hooks and rendering logic

---

## 📂 Folder Structure

```
/src
  /api
    generateCode.ts
  /hooks
    useTypewriter.ts
  App.tsx
  main.tsx
  index.css
  App.test.tsx
```

---

## ✍️ Author

**Archit Sharma**  
Frontend Developer · React · JavaScript · TypeScript

[GitHub](https://github.com/archit-react) • [LinkedIn](www.linkedin.com/in/archit-react) • [Portfolio](https://your-portfolio.com)
