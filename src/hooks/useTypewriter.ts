import { useEffect, useState } from "react";

export function useTypewriter(text: string, speed: number = 30) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    if (typeof text !== "string" || text.length === 0) {
      setDisplayed(""); // no animation for empty or invalid text
      return;
    }

    let i = 0;
    setDisplayed(""); // reset before starting animation

    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i));
      i++;

      if (i >= text.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}
