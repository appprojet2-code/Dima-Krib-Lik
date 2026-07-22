-- ============================================================
-- fl_familles — gestion des familles/categories d'articles
-- Seedee avec les 12 familles reellement utilisees dans le catalogue
-- (l'ancienne liste FAMILLES_ARTICLES codee en dur etait un reliquat
-- fruits & legumes, sans rapport avec le catalogue Dima Krib Lik).
-- ============================================================

CREATE TABLE IF NOT EXISTS fl_familles (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  couleur TEXT,
  ordre NUMERIC,
  actif BOOLEAN DEFAULT true,
  notes TEXT
);

ALTER TABLE fl_familles DISABLE ROW LEVEL SECURITY;

INSERT INTO fl_familles (id, nom, couleur, ordre) VALUES
  ('FAM_01', 'Épicerie & Alimentation',     '#0F3460', 1),
  ('FAM_02', 'Boissons',                    '#0EA5E9', 2),
  ('FAM_03', 'Confiserie & Chocolat',       '#EC4899', 3),
  ('FAM_04', 'Hygiène & Beauté',            '#8B5CF6', 4),
  ('FAM_05', 'Rasage & Épilation',          '#F59E0B', 5),
  ('FAM_06', 'Coton & Pansements',          '#10B981', 6),
  ('FAM_07', 'Puériculture & Bébé',         '#F2811F', 7),
  ('FAM_08', 'Insecticides & Entretien',    '#EF4444', 8),
  ('FAM_09', 'Cuisson & Gaz',               '#6B7280', 9),
  ('FAM_10', 'Quincaillerie & Divers',      '#78716C', 10),
  ('FAM_11', 'Électronique & Accessoires',  '#3B82F6', 11),
  ('FAM_12', 'Papeterie & Loisirs',         '#14B8A6', 12)
ON CONFLICT (id) DO UPDATE SET nom = EXCLUDED.nom, couleur = EXCLUDED.couleur, ordre = EXCLUDED.ordre;
