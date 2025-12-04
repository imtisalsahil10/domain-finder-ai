import { GoogleGenAI } from "@google/genai";
import { CompanySearchParams, PersonSearchParams, DomainResult, EmailResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJson = (text: string): string => {
  if (text.includes("```json")) {
    return text.replace(/```json/g, "").replace(/```/g, "").trim();
  } else if (text.includes("```")) {
    return text.replace(/```/g, "").trim();
  }
  return text.trim();
};

const extractSources = (response: any) => {
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  return chunks
    .map((chunk: any) => chunk.web)
    .filter((web: any) => web && web.uri && web.title)
    .map((web: any) => ({ title: web.title, uri: web.uri }));
};

export const findCompanyDomain = async (params: CompanySearchParams): Promise<DomainResult> => {
  const { companyName, industry, location } = params;

  // Prompt designed to use Search to find the actual corporate domain
  const prompt = `
    You are a domain intelligence expert. Find the official website domain for the company: "${companyName}".
    ${industry ? `Industry: ${industry}` : ''}
    ${location ? `Location: ${location}` : ''}

    Task:
    1.  **Use Google Search** to find the official website.
    2.  **Identify the Primary Domain**:
        - Distinguish between consumer-facing brands and corporate entities.
        - If a company has a distinct corporate website (e.g., 'thekrogerco.com' for Kroger, 'aboutamazon.com' for Amazon) versus a consumer site (e.g., 'kroger.com', 'amazon.com'), **prefer the corporate/parent entity domain** as the primary result, as this is more accurate for business identification.
        - If the corporate domain is not widely used, fall back to the main consumer domain.
    3.  **Return Data**:
        - Provide the primary domain.
        - List the consumer domain or other regional domains as 'alternatives'.
        - Provide a confidence score based on the search results.

    Output Format:
    Return the result **strictly** as a valid JSON object with the following structure. Do not wrap in markdown code blocks if possible.
    {
      "domain": "string (the primary corporate domain)",
      "confidence": "High" | "Medium" | "Low",
      "reasoning": "string (brief explanation of why this domain was chosen, mentioning corporate vs consumer sites if relevant)",
      "alternatives": ["string", "string"] (list of related domains)
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = cleanJson(response.text || "{}");
    
    let result: any;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Text:", text);
      throw new Error("Received malformed data from AI. Please try again.");
    }

    return {
      type: 'domain',
      ...result,
      sources: extractSources(response),
    };
  } catch (error) {
    console.error("Error finding domain:", error);
    throw new Error("Failed to retrieve domain information. Please try again.");
  }
};

export const findPersonEmail = async (params: PersonSearchParams): Promise<EmailResult> => {
  const { personName, companyName, jobTitle, location } = params;

  const prompt = `
    You are a professional contact researcher. Find the professional email address for:
    Name: "${personName}"
    Company: "${companyName}"
    ${jobTitle ? `Job Title: ${jobTitle}` : ''}
    ${location ? `Location: ${location}` : ''}

    Task:
    1.  **Use Google Search** to find public professional profiles, company press releases, or contact pages.
    2.  **Identify or Deduce Email**:
        - Look for an exact match for the professional email address.
        - If the exact email is not publicly listed, find the standard email pattern for the company (e.g., 'first.last@company.com', 'f.last@company.com') and apply it to the person's name.
    3.  **Reasoning**:
        - Clearly state if the email was found directly or deduced from a pattern.

    Output Format:
    Return the result **strictly** as a valid JSON object.
    {
      "email": "string (the found or most likely email address)",
      "confidence": "High" | "Medium" | "Low",
      "reasoning": "string (explain if this is a direct find or a pattern deduction)",
      "pattern": "string (e.g., '{first}.{last}@domain.com' or 'N/A' if direct match)"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = cleanJson(response.text || "{}");

    let result: any;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Text:", text);
      throw new Error("Received malformed data from AI. Please try again.");
    }

    return {
      type: 'email',
      ...result,
      sources: extractSources(response),
    };
  } catch (error) {
    console.error("Error finding email:", error);
    throw new Error("Failed to retrieve email information. Please try again.");
  }
};