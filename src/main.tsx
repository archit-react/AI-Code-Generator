import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import "./i18n";

// ✅ Apply dark mode class on page load from localStorage
const userTheme = localStorage.getItem("theme");
if (userTheme === "dark") {
  document.body.classList.add("dark");
} else {
  document.body.classList.remove("dark");
}


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
