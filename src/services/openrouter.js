// import { env } from "../config/env";

// const PRICE_SUGGESTIONS = {
//   Electronics: "500 – 2,000 PKR/day",
//   Makeup: "200 – 800 PKR/day",
//   Others: "100 – 500 PKR/day",
// };

// export const getPriceSuggestion = (category) => {
//   return PRICE_SUGGESTIONS[category] || null;
// };

// export const generateProductDescription = async (name, category) => {
//   if (!env.openRouterApiKey?.trim()) {
//     throw new Error(
//       "OpenRouter API key is missing. Add VITE_OPENROUTER_API_KEY to .env and restart the dev server."
//     );
//   }

//   const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${env.openRouterApiKey}`,
//     },
//     body: JSON.stringify({
//       model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
//       messages: [
//         {
//           role: "user",
//           content: `Write a short rental product description for a ${category} product named "${name}". Keep it under 50 words, professional, and appealing to potential renters. Do not mention any price or cost. Only return the description, nothing else.`,
//         },
//       ],
//     }),
//   });

//   if (!response.ok) {
//     throw new Error("Failed to generate description. Please try again.");
//   }

//   const data = await response.json();
//   const text = data?.choices?.[0]?.message?.content?.trim();

//   if (!text) {
//     throw new Error("No description returned. Please try again.");
//   }

//   return text;
// };


import { env } from "../config/env";

export const generateProductDescription = async (name, category) => {
  if (!env.openRouterApiKey?.trim()) {
    throw new Error(
      "OpenRouter API key is missing. Add VITE_OPENROUTER_API_KEY to .env and restart the dev server."
    );
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openRouterApiKey}`,
    },
    body: JSON.stringify({
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
      messages: [
        {
          role: "user",
          content: `Write a short rental product description for a ${category} product named "${name}". Keep it under 50 words, professional, and appealing to potential renters. Do not mention any price or cost. Only return the description, nothing else.`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate description. Please try again.");
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content?.trim();

  if (!text) {
    throw new Error("No description returned. Please try again.");
  }

  return text;
};