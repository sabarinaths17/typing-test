/* ============================================================
   SUPABASE CONFIG — fill in your project URL and anon key.
   Get them from: Supabase Dashboard → Settings → API
   ============================================================ */

const SUPABASE_URL  = '';   // e.g. 'https://abcxyz.supabase.co'
const SUPABASE_ANON = '';   // e.g. 'eyJhbGci...'

// If both values are filled in, we use Supabase.
// Otherwise we fall back to localStorage-only mode (works offline).
const supabase = (SUPABASE_URL && SUPABASE_ANON)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON)
  : null;

/* ----------------------------------------------------------
   saveScoreCloud(entry)
   Saves a score entry to Supabase. Silently falls back to
   localStorage if Supabase is not configured.
   ---------------------------------------------------------- */
async function saveScoreCloud(entry) {
  if (!supabase) return;
  const { error } = await supabase.from('scores').insert([{
    name:       entry.name,
    wpm:        entry.wpm,
    accuracy:   entry.accuracy,
    difficulty: entry.difficulty,
    duration:   entry.duration,
  }]);
  if (error) console.warn('Supabase insert error:', error.message);
}

/* ----------------------------------------------------------
   getScoresCloud(filters, limit)
   Fetches top scores from Supabase. Falls back to empty array
   if not configured.
   ---------------------------------------------------------- */
async function getScoresCloud(filters = {}, limit = 20) {
  if (!supabase) return [];
  let q = supabase
    .from('scores')
    .select('*')
    .order('wpm', { ascending: false })
    .limit(limit);

  if (filters.diff && filters.diff !== 'all') q = q.eq('difficulty', filters.diff);
  if (filters.dur  && filters.dur  !== 'all') q = q.eq('duration', Number(filters.dur));

  const { data, error } = await q;
  if (error) { console.warn('Supabase fetch error:', error.message); return []; }
  return data || [];
}
