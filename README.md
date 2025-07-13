# AI Code Generator (Unit Tested)

A responsive, production-grade AI-powered code generation app built with React, TypeScript, and Vite. It allows users to describe a coding task, select a language, and generate valid code using the Google Gemini Pro API (via OpenRouter). It includes features such as dark/light mode, multilingual support, animated code output, and syntax highlighting – all designed with a developer-first UX and minimalistic UI.

[Live App](https://ai-code-generator-lyart.vercel.app/)

---

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- Google Gemini Pro API via OpenRouter
- React Hot Toast
- react-i18next (i18n)
- Prism + React Syntax Highlighter
- Vitest + React Testing Library
- Custom Typewriter Hook

---

## Features

- AI Code Generation via Google Gemini Pro (OpenRouter)
- Animated typewriter-style output rendering
- Internationalization support (English, Spanish)
- Language dropdown with support for JavaScript, Python, TypeScript, C++, Go, and Rust
- Dark/Light mode toggle with persistent theme via localStorage
- Syntax highlighting using Prism One Dark theme
- Copy-to-clipboard functionality
- Error handling with toast feedback
- Responsive layout with Tailwind CSS
- Unit tested UI components and hooks

---

## Installation

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

## Implementation Details

### Design and Architecture

- Gemini Pro API is integrated through OpenRouter with Axios
- Typewriter effect implemented using a custom `useTypewriter` hook with controlled rendering
- Dark mode respects system preferences and persists via localStorage
- i18n implemented via `react-i18next`, with dropdown for runtime language switching
- PrismJS + `react-syntax-highlighter` used for line-wrapped syntax blocks
- Tailwind’s utility classes used across the entire layout – no external CSS
- Output is always visible without horizontal scrolling by enabling line wrapping

### Optimizations and Fixes

- Dark mode flashes were resolved using `background-color: inherit` and `color-scheme` meta tag
- The typewriter bug where the first letter was skipped was resolved by prepending a zero-width space (`\u200B`)
- All runtime prompts and output logic is encapsulated in `App.tsx` for clarity and isolation

---

## Testing

Unit tests have been written using Vitest and React Testing Library.

### Covered:

- Theme toggle (dark/light mode)
- Language dropdown rendering and selection
- Clipboard copy behavior
- Mocked generateCode API responses
- Edge case handling (empty prompt, API error)
- Hook behavior validation (typewriter output)

---

## Folder Structure

```
/src
  /api
    generateCode.ts
  /hooks
    useTypewriter.ts
  App.tsx
  App.test.tsx
  main.tsx
  index.css
```

---

## Notes

- API keys are managed using environment variables. Ensure `VITE_GEMINI_API_KEY` is set in `.env`.
- Typewriter behavior has been adjusted for more consistent output across multiline content.
- Build is optimized for deployment via Vercel and currently live at the link above.
- All changes are committed to GitHub and redeployed via the Vercel dashboard.

---

## Author

**Archit Sharma**\
Frontend Developer | React | TypeScript | Tailwind CSS

- [GitHub](https://github.com/archit-react)
- [LinkedIn](https://www.linkedin.com/in/archit-react)
- [Portfolio](https://your-portfolio.com)

