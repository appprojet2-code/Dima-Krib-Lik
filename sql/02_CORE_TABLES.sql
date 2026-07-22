-- ============================================================
-- Dima Krib Lik — Fresh Link Pro
-- Tables coeur restantes (au-delà de fl_clients / fl_articles)
-- pour sortir complètement du "Mode local" et travailler 100% Supabase.
-- ============================================================

-- ── USERS (seul le master_admin Jawad est stocké côté Supabase) ──────────────
CREATE TABLE IF NOT EXISTS fl_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  password_hash TEXT,
  role TEXT NOT NULL,
  access_type TEXT,
  secteur TEXT,
  phone TEXT,
  telephone TEXT,
  actif BOOLEAN DEFAULT true,
  photo_url TEXT,
  can_view_achat BOOLEAN DEFAULT false,
  can_view_commercial BOOLEAN DEFAULT false,
  can_view_logistique BOOLEAN DEFAULT false,
  can_view_stock BOOLEAN DEFAULT false,
  can_view_cash BOOLEAN DEFAULT false,
  can_view_finance BOOLEAN DEFAULT false,
  can_view_recap BOOLEAN DEFAULT false,
  can_view_database BOOLEAN DEFAULT false,
  objectif_clients NUMERIC,
  objectif_tonnage NUMERIC,
  objectif_journalier_ca NUMERIC,
  objectif_hebdomadaire_ca NUMERIC,
  objectif_mensuel_ca NUMERIC,
  objectif_journalier_clients NUMERIC,
  objectif_hebdomadaire_clients NUMERIC,
  objectif_mensuel_clients NUMERIC,
  notif_achat BOOLEAN DEFAULT false,
  notif_commercial BOOLEAN DEFAULT false,
  notif_livraison BOOLEAN DEFAULT false,
  notif_recap BOOLEAN DEFAULT false,
  notif_besoin_achat BOOLEAN DEFAULT false,
  fournisseur_id TEXT,
  client_id TEXT
);

-- ── FOURNISSEURS ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_fournisseurs (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  contact TEXT,
  telephone TEXT,
  email TEXT,
  adresse TEXT,
  ville TEXT,
  region TEXT,
  specialites JSONB DEFAULT '[]'::jsonb,
  "modalitePaiement" TEXT,
  "delaiPaiement" NUMERIC,
  ice TEXT,
  rc TEXT,
  notes TEXT,
  actif BOOLEAN DEFAULT true,
  itineraires JSONB
);

-- ── COMMANDES ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_commandes (
  id TEXT PRIMARY KEY,
  date TEXT,
  "commercialId" TEXT,
  "commercialNom" TEXT,
  "clientId" TEXT,
  "clientNom" TEXT,
  secteur TEXT,
  zone TEXT,
  "gpsLat" NUMERIC,
  "gpsLng" NUMERIC,
  lignes JSONB DEFAULT '[]'::jsonb,
  heurelivraison TEXT,
  statut TEXT,
  "emailDestinataire" TEXT,
  "teamLeadId" TEXT,
  "teamLeadNom" TEXT,
  notes TEXT,
  "motifRefus" TEXT,
  approbateur TEXT,
  "approbateurId" TEXT,
  "dateApprobation" TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── VISITES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_visites (
  id TEXT PRIMARY KEY,
  date TEXT,
  "prevendeurId" TEXT,
  "prevendeurNom" TEXT,
  "clientId" TEXT,
  "clientNom" TEXT,
  "commandeId" TEXT,
  resultat TEXT,
  "gpsLat" NUMERIC,
  "gpsLng" NUMERIC,
  "raisonSansCommande" TEXT
);

-- ── TRIPS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_trips (
  id TEXT PRIMARY KEY,
  date TEXT,
  numero TEXT,
  "livreurId" TEXT,
  "livreurNom" TEXT,
  vehicule TEXT,
  "commandeIds" JSONB DEFAULT '[]'::jsonb,
  statut TEXT,
  itineraire JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── BONS LIVRAISON ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_bons_livraison (
  id TEXT PRIMARY KEY,
  date TEXT,
  "tripId" TEXT,
  "commandeId" TEXT,
  "clientId" TEXT,
  "clientNom" TEXT,
  secteur TEXT,
  zone TEXT,
  "livreurNom" TEXT,
  "prevendeurNom" TEXT,
  statut TEXT,
  "statutLivraison" TEXT,
  "valideMagasinier" BOOLEAN DEFAULT false,
  "montantTotal" NUMERIC,
  tva NUMERIC,
  "montantTTC" NUMERIC,
  lignes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── RETOURS ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_retours (
  id TEXT PRIMARY KEY,
  date TEXT,
  "tripId" TEXT,
  "livreurNom" TEXT,
  lignes JSONB DEFAULT '[]'::jsonb,
  statut TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ── BONS ACHAT ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_bons_achat (
  id TEXT PRIMARY KEY,
  date TEXT,
  "acheteurId" TEXT,
  "acheteurNom" TEXT,
  "fournisseurId" TEXT,
  "fournisseurNom" TEXT,
  lignes JSONB DEFAULT '[]'::jsonb,
  statut TEXT,
  "emailDestinataire" TEXT,
  "depotId" TEXT,
  "depotNom" TEXT
);

-- ── PURCHASE ORDERS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_purchase_orders (
  id TEXT PRIMARY KEY,
  date TEXT,
  "articleId" TEXT,
  "articleNom" TEXT,
  "articleUnite" TEXT,
  "fournisseurId" TEXT,
  "fournisseurNom" TEXT,
  "fournisseurEmail" TEXT,
  quantite NUMERIC,
  "prixUnitaire" NUMERIC,
  total NUMERIC,
  statut TEXT,
  notes TEXT,
  "createdBy" TEXT,
  "depotId" TEXT,
  "depotNom" TEXT,
  "montantPaye" NUMERIC,
  "statutPaiement" TEXT,
  "datePaiement" TEXT,
  "notePaiement" TEXT,
  "genereAuto" BOOLEAN DEFAULT false
);

-- ── RECEPTIONS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_receptions (
  id TEXT PRIMARY KEY,
  date TEXT,
  "bonAchatId" TEXT,
  "purchaseOrderId" TEXT,
  source TEXT,
  "fournisseurNom" TEXT,
  lignes JSONB DEFAULT '[]'::jsonb,
  statut TEXT,
  "operateurId" TEXT,
  notes TEXT
);

-- ── BONS PREPARATION ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_bons_preparation (
  id TEXT PRIMARY KEY,
  nom TEXT,
  date TEXT,
  mode TEXT,
  type TEXT,
  format TEXT,
  "tripId" TEXT,
  "clientIds" JSONB DEFAULT '[]'::jsonb,
  "clientsInfo" JSONB DEFAULT '[]'::jsonb,
  "sequenceMode" TEXT,
  lignes JSONB DEFAULT '[]'::jsonb,
  statut TEXT,
  "createdBy" TEXT,
  "validatedAt" TEXT,
  "validatedBy" TEXT
);

-- ── TRANSFERTS STOCK ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_transferts_stock (
  id TEXT PRIMARY KEY,
  date TEXT,
  "articleId" TEXT,
  "articleNom" TEXT,
  quantite NUMERIC,
  sens TEXT,
  motif TEXT,
  "operateurId" TEXT
);

-- ── LIVREURS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_livreurs (
  id TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  prenom TEXT,
  type TEXT,
  telephone TEXT,
  actif BOOLEAN DEFAULT true,
  matricule TEXT,
  cin TEXT,
  "capaciteCaisses" NUMERIC,
  "capaciteTonnage" NUMERIC,
  "typeVehicule" TEXT,
  "marqueVehicule" TEXT
);

-- ── MOTIFS RETOUR ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_motifs_retour (
  id TEXT PRIMARY KEY,
  libelle TEXT,
  actif BOOLEAN DEFAULT true
);

-- ── MESSAGES (chat interne) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_messages (
  id TEXT PRIMARY KEY,
  "senderId" TEXT,
  "senderName" TEXT,
  role TEXT,
  text TEXT,
  "createdAt" TEXT
);

-- ── NOTICES ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fl_notices (
  id TEXT PRIMARY KEY,
  titre TEXT,
  contenu TEXT,
  "createdBy" TEXT,
  "createdAt" TEXT
);

-- ── RLS off (cohérent avec fl_clients / fl_articles) ──────────────────────
ALTER TABLE fl_users             DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_fournisseurs      DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_commandes         DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_visites           DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_trips             DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_bons_livraison    DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_retours           DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_bons_achat        DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_purchase_orders   DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_receptions        DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_bons_preparation  DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_transferts_stock  DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_livreurs          DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_motifs_retour     DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_messages          DISABLE ROW LEVEL SECURITY;
ALTER TABLE fl_notices           DISABLE ROW LEVEL SECURITY;

-- ── Seed: master_admin Jawad (seul compte stocké dans Supabase) ──────────
INSERT INTO fl_users (id, name, email, password_hash, role, telephone, actif)
VALUES ('u-master', 'Jawad', 'jawad@empire.fresh.co.site', 'Medghaly@22', 'master_admin', '0660671709', true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, email = EXCLUDED.email, password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role, telephone = EXCLUDED.telephone, actif = EXCLUDED.actif;
