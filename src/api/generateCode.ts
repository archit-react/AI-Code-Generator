import axios from "axios";

export const generateCode = async (language: string, prompt: string) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const response = await axios.post(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    {
      contents: [
        {
          parts: [
            {
              text: `Write a ${language} code snippet for: ${prompt}`,
            },
          ],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        key: apiKey,
      },
    }
  );

  return response.data.candidates[0].content.parts[0].text;
};
