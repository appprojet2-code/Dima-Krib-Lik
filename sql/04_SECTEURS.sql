-- ============================================================
-- fl_secteurs — gestion des secteurs commerciaux (nouvel onglet BackOffice)
-- ============================================================

CREATE TABLE IF NOT EXISTS fl_secteurs (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  ville TEXT,
  zones JSONB DEFAULT '[]'::jsonb,
  "responsableId" TEXT,
  "responsableNom" TEXT,
  couleur TEXT,
  actif BOOLEAN DEFAULT true,
  notes TEXT
);

ALTER TABLE fl_secteurs DISABLE ROW LEVEL SECURITY;
