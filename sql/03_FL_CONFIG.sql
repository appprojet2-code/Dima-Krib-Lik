-- ============================================================
-- fl_config — table de config clé/valeur, sondée par le badge
-- "Supabase / DB offline" du BackOffice (BackOfficeLayout.tsx,
-- SyncBanner.tsx). Sans cette table, l'app reste "DB offline"
-- même si toutes les autres tables sont bien en place.
-- ============================================================

CREATE TABLE IF NOT EXISTS fl_config (
  id TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE fl_config DISABLE ROW LEVEL SECURITY;

INSERT INTO fl_config (id, value) VALUES
  ('company', '{
    "nom": "Dima Krib Lik",
    "appName": "FreshLink Pro",
    "appSlogan": "Powered by Vita Tech",
    "ville": "Casablanca, Maroc",
    "email": "contact@dimakriblik.ma",
    "couleurEntete": "#0F3460"
  }'::jsonb)
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value, updated_at = now();
