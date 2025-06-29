import { useState } from "react";
import { generateCode } from "./api/generateCode";
import { Toaster, toast } from "react-hot-toast";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const languages = ["JavaScript", "Python", "C++", "TypeScript"];

export default function App() {
  const [language, setLanguage] = useState(languages[0]);
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateCode = async () => {
    setIsLoading(true);
    setOutput("// Generating...");
    try {
      const result = await generateCode(language, prompt);
      setOutput(result);
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
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white p-8 rounded-2xl shadow-xl transition-all">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 tracking-tight">
            AI Code Generator
          </h1>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full mb-4 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {languages.map((lang) => (
              <option key={lang}>{lang}</option>
            ))}
          </select>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you want to build..."
            rows={6}
            className="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleGenerateCode}
            className={`w-full bg-blue-600 text-white py-2 rounded transition ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Code"}
          </button>

          {output && (
            <div className="mt-6 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {language}
            </div>
          )}

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
            {output}
          </SyntaxHighlighter>

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
    </>
  );
}
