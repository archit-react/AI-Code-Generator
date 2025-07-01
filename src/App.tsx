import { useState } from "react";
import { generateCode } from "./api/generateCode";
import { Toaster, toast } from "react-hot-toast";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTypewriter } from "./hooks/useTypewriter";
import { useTranslation } from "react-i18next";

const languages = ["JavaScript", "Python", "C++", "TypeScript"];

export default function App() {
  const [language, setLanguage] = useState(languages[0]);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const typedOutput = useTypewriter(output);
  const { t, i18n } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setOutput("  Generating...");

    try {
      const result = await generateCode(language, prompt);

      // Safety check: result must be a string
      if (typeof result === "string" && result.trim() !== "") {
        setOutput(result);
      } else {
        setOutput("// Failed to generate code.");
      }
    } catch (err) {
      const error = err as {
        response?: { data?: { error?: { message?: string } } };
        message?: string;
      };

      const errorMessage =
        error.response?.data?.error?.message ||
        error.message ||
        "Something went wrong.";
      toast.error(`Error: ${errorMessage}`);
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

  return (
    <div className="bg-inherit">
      <Toaster position="top-right" />
      <div className="flex justify-end gap-3 mt-2 mb-4 pr-2">
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          className="p-2 border rounded shadow-md bg-white text-black dark:bg-gray-900 dark:text-white dark:border-gray-700"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>

        <button
          onClick={() => {
            setDarkMode(!darkMode);
            localStorage.setItem("theme", !darkMode ? "dark" : "light");
            document.body.classList.toggle("dark");
          }}
          className="p-2 border rounded shadow-md bg-white text-black dark:bg-gray-900 dark:text-white dark:border-gray-700"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white dark:bg-gray-900 text-black dark:text-white p-8 rounded-2xl shadow-xl transition-all">
          <h1 className="text-3xl font-bold text-center mb-8 tracking-tight text-black dark:text-white">
            {t("title")}
          </h1>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          >
            {languages.map((lang) => (
              <option
                key={lang}
                className="text-black dark:text-white bg-white dark:bg-gray-800"
              >
                {lang}
              </option>
            ))}
          </select>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t("placeholder")}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black dark:bg-gray-800 dark:text-white"
          />

          <button
            onClick={handleGenerateCode}
            className={`w-full bg-blue-600 text-white py-2 rounded transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? t("generating") : t("generate")}
          </button>
          {typedOutput &&
            typedOutput.trim() !== "" &&
            !typedOutput.startsWith("//") && (
              <div className="mt-6 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {language}
              </div>
            )}

          {typedOutput &&
          typedOutput.trim() !== "" &&
          !typedOutput.toLowerCase().includes("undefined") ? (
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={oneDark}
              customStyle={{
                borderRadius: "0.5rem",
                padding: "1rem",
                fontSize: "0.9rem",
                marginTop: "1rem",
              }}
            >
              {typedOutput}
            </SyntaxHighlighter>
          ) : (
            <div className="mt-4 text-sm text-gray-400 dark:text-gray-500 italic">
              {t(" Your generated code will appear here.") ||
                "Your generated code will appear here."}
            </div>
          )}

          {output && (
            <button
              onClick={handleCopy}
              className="mt-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            >
              Copy Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
