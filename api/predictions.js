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

  if (req.method === 'GET') {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/predictions`, { headers: headers() });
    if (!r.ok) return res.status(r.status).json({ error: 'Supabase error' });
    return res.json(await r.json());
  }

  if (req.method === 'POST') {
    const { fight_id, player, field, value } = req.body;
    if (!fight_id || !player || !field || value === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Delete existing record first (upsert pattern)
    await fetch(
      `${SUPABASE_URL}/rest/v1/predictions?fight_id=eq.${fight_id}&player=eq.${encodeURIComponent(player)}&field=eq.${encodeURIComponent(field)}`,
      { method: 'DELETE', headers: headers() }
    );
    // Insert new record
    const r = await fetch(`${SUPABASE_URL}/rest/v1/predictions`, {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'return=representation' },
      body: JSON.stringify({ fight_id, player, field, value })
    });
    if (!r.ok) return res.status(r.status).json({ error: 'Supabase error' });
    return res.json(await r.json());
  }

  if (req.method === 'DELETE') {
    // Clear all predictions
    const r = await fetch(`${SUPABASE_URL}/rest/v1/predictions?id=gt.0`, {
      method: 'DELETE',
      headers: { ...headers(), 'Prefer': 'return=minimal' }
    });
    if (!r.ok) return res.status(r.status).json({ error: 'Supabase error' });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
