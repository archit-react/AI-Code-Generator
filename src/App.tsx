import { useState, useEffect } from "react";
import { generateCode } from "./api/generateCode";
import { Toaster, toast } from "react-hot-toast";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTypewriter } from "./hooks/useTypewriter";
import { useTranslation } from "react-i18next";

const languages = [
  { name: "JavaScript", icon: "JS" },
  { name: "Python", icon: "Py" },
  { name: "C++", icon: "C++" },
  { name: "TypeScript", icon: "TS" },
  { name: "Go", icon: "Go" },
  { name: "Rust", icon: "Rs" },
];

export default function App() {
  const [language, setLanguage] = useState(languages[0].name);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () =>
      localStorage.getItem("theme") === "dark" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Fix: Always prepend zero-width space to output
  const typedOutput = useTypewriter(
    output ? (output.startsWith("\u200B") ? output : `\u200B${output}`) : ""
  );

  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleGenerateCode = async () => {
    if (!prompt.trim()) {
      toast.error(t("promptRequired"));
      return;
    }

    setIsLoading(true);
    setOutput("  Generating...");

    try {
      const result = await generateCode(language, prompt);
      if (typeof result === "string" && result.trim() !== "") {
        // Prepend zero-width space to protect first character
        setOutput(result.startsWith("\u200B") ? result : `\u200B${result}`);
      } else {
        throw new Error("Empty response from server");
      }
    } catch (err) {
      const error = err as {
        response?: { data?: { error?: { message?: string } } };
        message?: string;
      };

      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        t("defaultError");

      toast.error(`${t("error")}: ${errorMessage}`);
      setOutput(`// ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success(t("copied"));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleGenerateCode();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "!bg-white/80 !backdrop-blur-sm dark:!bg-gray-800/80 dark:!text-white",
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="relative max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {t("title")}
            </h1>
            <div className="flex items-center space-x-4">
              <select
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="text-sm bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded text-gray-800 dark:text-gray-200"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
              </select>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? (
                  <svg
                    className="h-5 w-5 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                    <line x1="12" y1="2" x2="12" y2="4" />
                    <line x1="12" y1="20" x2="12" y2="22" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="2" y1="12" x2="4" y2="12" />
                    <line x1="20" y1="12" x2="22" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="flex flex-col">
              <label
                htmlFor="language-select"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
              >
                {t("language")}
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-800 dark:text-gray-200"
              >
                {languages.map((lang) => (
                  <option
                    key={lang.name}
                    value={lang.name}
                    className="bg-white dark:bg-gray-800"
                  >
                    {lang.icon} • {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="prompt-input"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1"
              >
                {t("description")}
              </label>
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t("placeholder")}
                rows={5}
                className="bg-white/50 dark:bg-gray-700/50 border border-gray-300/50 dark:border-gray-600/50 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition text-gray-800 dark:text-gray-200"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t("pressCmdEnter")}
              </p>
            </div>

            <button
              onClick={handleGenerateCode}
              disabled={isLoading || !prompt.trim()}
              className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                isLoading || !prompt.trim()
                  ? "bg-blue-400/50 dark:bg-blue-600/50 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-sm"
              } text-white`}
            >
              {isLoading ? t("generating") : t("generate")}
            </button>

            {/* Output */}
            {typedOutput ? (
              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-300">
                    {language}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-xs flex items-center gap-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 px-2.5 py-1.5 rounded transition-colors text-gray-700 dark:text-gray-300"
                  >
                    {t("copy")}
                  </button>
                </div>
                <SyntaxHighlighter
                  language={language.toLowerCase()}
                  style={oneDark}
                  customStyle={{
                    borderRadius: "0.5rem",
                    padding: "1.25rem",
                    fontSize: "0.85rem",
                    background: darkMode ? "#1E1E2E" : "#282C34",
                  }}
                  showLineNumbers
                  wrapLines
                  wrapLongLines
                >
                  {typedOutput}
                </SyntaxHighlighter>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-8 text-center border border-dashed border-gray-300 dark:border-gray-600">
                <h3 className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("noCodeGenerated")}
                </h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
