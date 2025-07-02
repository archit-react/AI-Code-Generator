import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { describe, it, expect, vi, beforeAll } from "vitest";

// ✅ Fix matchMedia error (for react-hot-toast)
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// ✅ Mock generateCode API
vi.mock("./api/generateCode", () => ({
  generateCode: vi.fn(() => Promise.resolve("console.log('Hello World!');")),
}));

// ✅ Realistic mock for i18n language switching
const changeLanguageMock = vi.fn();
let currentLang = "en";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      key === "title"
        ? "AI Code Generator"
        : key === "copied"
        ? "Copied!"
        : key === "generate"
        ? "Generate"
        : key === "generating"
        ? "Generating..."
        : key === "placeholder"
        ? "placeholder"
        : key,
    i18n: {
      changeLanguage: (lang: string) => {
        currentLang = lang;
        return Promise.resolve();
      },
      get language() {
        return currentLang;
      },
    },
  }),
}));

describe("App", () => {
  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText(/AI Code Generator/i)).toBeInTheDocument();
  });

  it("toggles dark mode and shows ☀️ Light", async () => {
    render(<App />);
    const toggleButton = screen.getByRole("button", { name: /dark/i });

    await act(async () => {
      fireEvent.click(toggleButton);
    });

    expect(screen.getByRole("button", { name: /light/i })).toBeInTheDocument();
  });

  it("toggles back to 🌙 Dark", async () => {
    render(<App />);
    const toggleButton = screen.getByRole("button", { name: /dark/i });

    await act(async () => {
      fireEvent.click(toggleButton); // dark
    });

    const lightToggleButton = screen.getByRole("button", { name: /light/i });
    await act(async () => {
      fireEvent.click(lightToggleButton); // light
    });

    expect(screen.getByRole("button", { name: /dark/i })).toBeInTheDocument();
  });

  it("switches language when dropdown is changed", async () => {
    render(<App />);
    const langSelect = screen.getAllByRole("combobox")[0];

    expect(langSelect).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(langSelect, { target: { value: "es" } });
    });

    // 💡 Expect internal lang change mock to be called
    expect(currentLang).toBe("es");
  });

  it("copies output text to clipboard when copy button is clicked", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });

    render(<App />);

    const textarea = screen.getByPlaceholderText("placeholder");
    fireEvent.change(textarea, { target: { value: "print hello" } });

    const generateBtn = screen.getByRole("button", { name: /generate/i });
    await act(async () => {
      fireEvent.click(generateBtn);
    });

    const copyButton = await screen.findByRole("button", {
      name: /copy code/i,
    });

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "console.log('Hello World!');"
    );
  });
});
