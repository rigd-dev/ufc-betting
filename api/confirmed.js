const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const headers = () => ({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json'
});

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Missing Supabase environment variables' });
  }

  if (req.method === 'POST') {
    const { fight_id } = req.body;
    if (!fight_id) {
      return res.status(400).json({ error: 'Missing fight_id' });
    }
    // Delete any existing confirmed record for this fight
    await fetch(
      `${SUPABASE_URL}/rest/v1/results?fight_id=eq.${fight_id}&field=eq.confirmed`,
      { method: 'DELETE', headers: headers() }
    );
    // Insert confirmed record
    const r = await fetch(`${SUPABASE_URL}/rest/v1/results`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'return=representation' },
      body: JSON.stringify({ fight_id, field: 'confirmed', value: 'true' })
    });
    if (!r.ok) return res.status(r.status).json({ error: 'Supabase error' });
    return res.json(await r.json());
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
