import { GoogleGenerativeAI } from "@google/generative-ai";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const headers = () => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
});

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Missing GEMINI_API_KEY' });
  }

  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        // Using grounding tool if available, but for now we'll just ask it to use its internal knowledge or search
        // Note: As of late 2024, grounding is available via tools
    });

    const prompt = `
      You are an expert UFC reporter. Find the official results for the UFC event: "UFC Perth: Della Maddalena vs Prates" (May 2, 2026).
      
      I need the results for these specific fighters:
      1. Jack Della Maddalena vs Carlos Prates
      2. Tai Tuivasa vs Louie Sutherland
      3. Beneil Dariush vs Quillan Salkilld
      4. Tim Elliott vs Steve Erceg
      5. Marwan Rahiki vs Ollie Schmid
      6. Shamil Gaziev vs Brando Pericic
      
      For each fight, provide:
      - winner: Full name of the winner (or "Empate" or "No Contest")
      - method: One of "Decisión", "KO/TKO", "Sumisión"
      - round: The round number (1, 2, 3, 4, 5) or "final" for decision.
      
      Return the data ONLY as a JSON array of objects with this structure:
      [
        { "id": 1, "winner": "Name", "method": "Method", "round": "Round" },
        ...
      ]
      
      If the fight hasn't happened yet or you don't have the results, return an empty array or omit those IDs.
      DO NOT include any explanation or markdown formatting, just the raw JSON array.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean text in case of markdown blocks
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const resultsData = JSON.parse(jsonStr);

    if (!Array.isArray(resultsData)) {
      throw new Error("Invalid response from Gemini");
    }

    // Update Supabase for each result
    const updatePromises = resultsData.flatMap(resData => [
      saveToSupabase(resData.id, 'winner', resData.winner),
      saveToSupabase(resData.id, 'method', resData.method),
      saveToSupabase(resData.id, 'round', resData.round),
      saveToSupabase(resData.id, 'confirmed', true) // Mark as confirmed
    ]);

    await Promise.all(updatePromises);

    return res.json({ 
      success: true, 
      message: `Updated ${resultsData.length} fight results.`,
      data: resultsData 
    });

  } catch (error) {
    console.error('Gemini Update Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function saveToSupabase(fight_id, field, value) {
    // Delete existing
    await fetch(
      `${SUPABASE_URL}/rest/v1/results?fight_id=eq.${fight_id}&field=eq.${encodeURIComponent(field)}`,
      { method: 'DELETE', headers: headers() }
    );
    // Insert new
    return fetch(`${SUPABASE_URL}/rest/v1/results`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ fight_id, field, value })
    });
}
