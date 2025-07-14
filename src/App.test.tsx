import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";

// Mock matchMedia for dark mode
beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

// Mock generateCode API
vi.mock("./api/generateCode", () => ({
  generateCode: vi.fn(() => Promise.resolve("console.log('Hello World!');")),
}));

// Mock useTypewriter
vi.mock("./hooks/useTypewriter", () => ({
  useTypewriter: vi.fn((text: string) => text),
}));

// i18n mocks
const changeLanguageMock = vi.fn();
let currentLang = "en";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        title: "AI Code Generator",
        copied: "Copied!",
        generate: "Generate",
        generating: "Generating...",
        placeholder: "placeholder",
        language: "Language",
        description: "Description",
        pressCmdEnter: "Press ⌘+Enter to generate",
        noCodeGenerated: "No code generated yet",
        promptRequired: "Prompt is required",
        defaultError: "Something went wrong",
        error: "Error",
        switchToLight: "Switch to light mode",
        switchToDark: "Switch to dark mode",
        copy: "Copy",
      }[key]),
    i18n: {
      changeLanguage: (lang: string) => {
        currentLang = lang;
        changeLanguageMock(lang);
        return Promise.resolve();
      },
      language: currentLang,
    },
  }),
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.body.classList.remove("dark");
  });

  it("renders the title", () => {
    render(<App />);
    expect(screen.getByText(/AI Code Generator/i)).toBeInTheDocument();
  });

  it("switches language when dropdown is changed", async () => {
    render(<App />);
    const langSelect = screen.getAllByRole("combobox")[0];

    await act(async () => {
      fireEvent.change(langSelect, { target: { value: "es" } });
    });

    expect(changeLanguageMock).toHaveBeenCalledWith("es");
    expect(currentLang).toBe("es");
  });

  it("copies output text to clipboard when copy button is clicked", async () => {
    const mockWriteText = vi.fn();
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: mockWriteText,
      },
      writable: true,
    });

    render(<App />);

    const textarea = screen.getByPlaceholderText("placeholder");
    await act(async () => {
      fireEvent.change(textarea, { target: { value: "print hello" } });
    });

    const generateBtn = screen.getByRole("button", { name: /generate/i });
    await act(async () => {
      fireEvent.click(generateBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
    });

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(mockWriteText).toHaveBeenCalledWith(
      expect.stringContaining("console.log('Hello World!')")
    );
  });

  it("displays generated code", async () => {
    render(<App />);

    const textarea = screen.getByPlaceholderText("placeholder");
    await act(async () => {
      fireEvent.change(textarea, { target: { value: "print hello" } });
    });

    const generateBtn = screen.getByRole("button", { name: /generate/i });
    await act(async () => {
      fireEvent.click(generateBtn);
    });

    await waitFor(() => {
      expect(screen.getByText(/Hello World/i)).toBeInTheDocument();
    });
  });
});
