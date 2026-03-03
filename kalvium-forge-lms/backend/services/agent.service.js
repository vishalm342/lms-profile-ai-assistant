const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage, SystemMessage } = require("@langchain/core/messages");
const db = require("./db.service");

// Initialize Gemini model once (no heavy agent setup needed)
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0,
  apiKey: process.env.GOOGLE_API_KEY,
});

const SYSTEM_PROMPT = `You are the Kalvium Forge LMS Assistant. Help students view and update their profile.

DATABASE SCHEMA (SQLite):
- students        (id INTEGER, full_name TEXT, email TEXT, password TEXT, phone TEXT, date_of_birth TEXT, city TEXT)
- education_details (student_id INTEGER, tenth_board TEXT, tenth_percentage REAL, twelfth_board TEXT, twelfth_percentage REAL)
- courses         (id INTEGER, title TEXT, duration_months INTEGER, fee REAL)
- applications    (student_id INTEGER, course_id INTEGER, status TEXT) // status is ALWAYS uppercase e.g. 'ACTIVE'

You must reply with ONLY a raw JSON object (no markdown, no code fences) in this exact shape:
{
  "sql": "<valid SQLite query, or null>",
  "type": "SELECT" | "UPDATE" | "INSERT" | "NONE",
  "explanation": "<one-line description of what you are doing>"
}

RULES FOR QUERY GENERATION:
1. Student Scope: ALWAYS scope queries to the current student using the provided student_id.
2. Personal Data (Read/Write): You can SELECT or UPDATE the 'students' and 'education_details' tables. NEVER SELECT the password column.
3. Course Data (Read-Only): You can SELECT data from 'courses' and 'applications'. You must NEVER generate INSERT, UPDATE, or DELETE statements for these tables.
4. Relational Joins: ANY query about courses, fees, or duration MUST use INNER JOIN: applications AS T1 INNER JOIN courses AS T2 ON T1.course_id = T2.id WHERE T1.student_id = <student_id>. NEVER query the courses table alone without this JOIN.
5. Specific Course Columns: If the user asks for duration, SELECT T2.title, T2.duration_months. If the user asks for fees, SELECT T2.title, T2.fee. Always include T2.title so the response is human-readable.
6. Title Matching: When the user refers to a course by name, ALWAYS use LIKE with wildcards: e.g. WHERE T2.title LIKE '%GEN AI%'. NEVER use exact equality (=) on course titles since stored names may differ slightly from what the user typed.
7. Status: Note that the status column expects uppercase values (e.g., status = 'ACTIVE').
8. Rejection: If the request is unrelated to LMS profile or course data, set type to NONE and sql to null.
9. Format: Return ONLY the JSON — no extra text, explanations, or code blocks.`;

/**
 * Main entry point: given a user message and student ID, query the DB via the LLM and return a reply.
 */
async function askAgent(userMessage, studentId) {
  // Step 1: Ask LLM to produce the SQL
  const step1 = await llm.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(`student_id = ${studentId}\n\nUser: ${userMessage}`),
  ]);

  let parsed;
  try {
    const raw = step1.content.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    parsed = JSON.parse(raw);
  } catch (_) {
    // Fallback: extract JSON block if model wrapped it anyway
    const match = step1.content.match(/\{[\s\S]*\}/);
    if (!match) {
      return { reply: "Sorry, I could not understand that request. Please try again.", databaseUpdated: false };
    }
    parsed = JSON.parse(match[0]);
  }

  const { sql, type, explanation } = parsed;
  console.log("🧠 AI GENERATED SQL:", sql);

  // Step 2: Execute the SQL
  let dbResult = null;
  if (sql && type !== "NONE") {
    if (type === "SELECT") {
      dbResult = await db.all(sql);
    } else {
      await db.run(sql);
    }
  } else {
    return { reply: explanation || "I can only help with LMS profile-related queries.", databaseUpdated: false };
  }

  // Step 3: Ask the LLM to format the result as a natural language reply
  const step2 = await llm.invoke([
    new SystemMessage("You are a friendly LMS assistant. Turn the database result below into a clean, concise, human-readable reply. Do not mention SQL. Keep it short."),
    new HumanMessage(
      `User asked: "${userMessage}"\nAction: ${explanation}\nDB result: ${JSON.stringify(dbResult ?? "Operation completed successfully.")}`
    ),
  ]);

  return {
    reply: step2.content,
    databaseUpdated: type !== "SELECT",
  };
}

module.exports = { askAgent };