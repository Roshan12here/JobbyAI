"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getCareerGuidance(career, queryType, specificQuery = "") {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) throw new Error("User not found");

  let prompt;

  if (queryType === "roadmap") {
    prompt = `
      Provide a structured career roadmap for a ${career} role.
      
      Sections:
      1. Key skills required
      2. Recommended learning path
      3. Industry demand and future-proof status
      4. Advantages and drawbacks
      5. Common challenges and solutions
      6. Potential job roles and salary expectations
      7. Tips for beginners and experienced professionals
    `;
  } else if (queryType === "salary") {
    prompt = `What is the average salary range for a ${career} role at different experience levels?`;
  } else if (queryType === "learning_curve") {
    prompt = `Describe the learning curve for a ${career} career, including estimated time to proficiency.`;
  } else if (queryType === "all" && specificQuery) {
    prompt = `Provide detailed information about ${specificQuery} for a career in ${career}.`;
  } else {
    prompt = `Provide general guidance and insights about a career in ${career}.`;
  }

  try {
    const result = await model.generateContent(prompt);
    let guidance = await result.response.text();
    
    // Remove Markdown-like formatting (asterisks, bold text, etc.)
    guidance = guidance.replace(/\*/g, "").trim();

    return guidance;
  } catch (error) {
    console.error("Error fetching career guidance:", error.message);
    throw new Error("Failed to fetch career guidance");
  }
}
