"use client"

// ════════════════════════════════════════════════════════════════════════════
// TYPES & ROLES
// ════════════════════════════════════════════════════════════════════════════

export type UserRole = 
  | "master_admin"
  | "super_admin"
  | "directeur_general"
  | "directeur_commercial"
  | "directeur_achat"
  | "directeur_logistique"
  | "directeur_financier"
  | "directeur_rh"
  | "directeur_it"
  | "resp_commercial"
  | "resp_achat"
  | "resp_logistique"
  | "resp_stock"
  | "resp_rh"
  | "resp_it"
  | "resp_qualite"
  | "cash_man"
  | "financier"
  | "comptable"
  | "acheteur"
  | "prevendeur"
  | "commercial"
  | "livreur"
  | "chauffeur"
  | "dispatcheur"
  | "magasinier"
  | "ctrl_achat"
  | "ctrl_prep"
  | "ctrl_retour"
  | "fournisseur"
  | "client"
  | "admin"
  | "team_leader"
  | "rh_manager"
  | "super_super_admin"

export const ROLE_LABELS: Record<UserRole, string> = {
  master_admin:         "Master Admin (Jawad)",
  super_admin:          "Super Admin",
  directeur_general:    "Directeur Général",
  directeur_commercial: "Directeur Commercial",
  directeur_achat:      "Directeur Achat",
  directeur_logistique: "Directeur Logistique",
  directeur_financier:  "Directeur Financier",
  directeur_rh:         "Directeur RH",
  directeur_it:         "Directeur IT",
  resp_commercial:      "Responsable Commercial",
  resp_achat:           "Responsable Achat",
  resp_logistique:      "Responsable Logistique",
  resp_stock:           "Responsable Stock",
  resp_rh:              "Responsable RH",
  resp_it:              "Responsable IT",
  resp_qualite:         "Responsable Qualité",
  cash_man:             "Cash Manager",
  financier:            "Financier",
  comptable:            "Comptable",
  acheteur:             "Acheteur",
  prevendeur:           "Pré-vendeur",
  commercial:           "Commercial Terrain",
  livreur:              "Livreur",
  chauffeur:            "Chauffeur",
  dispatcheur:          "Dispatcheur",
  magasinier:           "Magasinier",
  ctrl_achat:           "Contrôleur Achat",
  ctrl_prep:            "Contrôleur Préparation",
  ctrl_retour:          "Contrôleur Retour",
  fournisseur:          "Fournisseur",
  client:               "Client",
  admin:                "Administrateur",
  team_leader:          "Team Leader",
  rh_manager:           "Manager RH",
  super_super_admin:    "Super Super Admin",
}

export type UserType = "interne" | "externe"

export interface User {
  id:                string
  name:              string
  email:             string
  username?:         string
  password?:         string
  role:              UserRole
  type:              UserType
  interface:         "mobile" | "backoffice" | "client" | "both"
  telephone?:        string
  biometricId?:      string
  biometricPrompted?: boolean
  createdAt?:        string
  accessType?:       string
  secteur?:          string
  phone?:            string
  actif?:            boolean
  photoUrl?:         string
  canViewAchat?:            boolean
  canViewCommercial?:       boolean
  canViewLogistique?:       boolean
  canViewStock?:            boolean
  canViewCash?:             boolean
  canViewFinance?:          boolean
  canViewRecap?:            boolean
  canViewDatabase?:         boolean
  objectifClients?:              number
  objectifTonnage?:              number
  objectifJournalierCA?:         number
  objectifHebdomadaireCA?:       number
  objectifMensuelCA?:            number
  objectifJournalierClients?:    number
  objectifHebdomadaireClients?:  number
  objectifMensuelClients?:       number
  notifAchat?:       boolean
  notifCommercial?:  boolean
  notifLivraison?:   boolean
  notifRecap?:       boolean
  notifBesoinAchat?: boolean
  fournisseurId?:    string
  clientId?:         string
  depotId?:          string
  civilite?:         Civilite
  canViewRH?:            boolean
  canViewExternal?:      boolean
  canCreateCommandeBO?:  boolean
  passwordMobile?:   string
  passwordBO?:       string
  requireCameraAuth?: boolean
}

// ════════════════════════════════════════════════════════════════════════════
// UTILISATEURS PAR DÉFAUT
// Comptes de démo ci-dessous : seedés en local uniquement (jamais poussés à
// Supabase automatiquement). Tout utilisateur créé/édité depuis Utilisateurs
// & Rôles (BOUsers.tsx) est en revanche synchronisé vers fl_users (Supabase).
// ════════════════════════════════════════════════════════════════════════════

const DEFAULT_USERS: User[] = [
  // ─── 👑 MASTER ADMIN ─────────────────────────────────────────────────────
  {
    id:        "u-master",
    name:      "Jawad",
    email:     "jawad@empire.fresh.co.site",
    username:  "jawad",
    password:  "Medghaly@22",
    role:      "master_admin",
    type:      "interne",
    interface: "backoffice",
    telephone: "0660671709",
  },

  // ─── DIRECTION ───────────────────────────────────────────────────────────
  { id: "u-001", name: "Admin FreshLink",      email: "admin@freshlink.ma",       username: "admin",      password: "admin2024",  role: "super_admin",          type: "interne", interface: "backoffice" },
  { id: "u-002", name: "Directeur Général",    email: "dg@freshlink.ma",           username: "dg",         password: "dg2024",     role: "directeur_general",    type: "interne", interface: "backoffice", canViewAchat: true, canViewCommercial: true, canViewLogistique: true, canViewStock: true, canViewCash: true, canViewFinance: true, canViewRecap: true, canViewRH: true },
  { id: "u-003", name: "Directeur Commercial", email: "dc@freshlink.ma",           username: "dc",         password: "dc2024",     role: "directeur_commercial", type: "interne", interface: "backoffice", canViewCommercial: true, canViewRecap: true },
  { id: "u-004", name: "Directeur Achat",      email: "da@freshlink.ma",           username: "da",         password: "da2024",     role: "directeur_achat",      type: "interne", interface: "backoffice", canViewAchat: true, canViewRecap: true },
  { id: "u-005", name: "Directeur Logistique", email: "dl@freshlink.ma",           username: "dl",         password: "dl2024",     role: "directeur_logistique", type: "interne", interface: "backoffice", canViewLogistique: true, canViewStock: true, canViewRecap: true },
  { id: "u-006", name: "Directeur Financier",  email: "df@freshlink.ma",           username: "df",         password: "df2024",     role: "directeur_financier",  type: "interne", interface: "backoffice", canViewFinance: true, canViewCash: true, canViewRecap: true },
  { id: "u-008", name: "Directeur IT",         email: "dit@freshlink.ma",          username: "dit",        password: "it2024",     role: "directeur_it",         type: "interne", interface: "backoffice", canViewDatabase: true },

  // ─── RESPONSABLES ────────────────────────────────────────────────────────
  { id: "u-009", name: "Resp. Commercial",  email: "responsable@freshlink.ma",  username: "resp-com",   password: "1234",       role: "resp_commercial",  type: "interne", interface: "both",       canViewCommercial: true, canViewRecap: true },
  { id: "u-010", name: "Resp. Achat",       email: "resp.achat@freshlink.ma",   username: "resp-achat", password: "rach2024",   role: "resp_achat",       type: "interne", interface: "backoffice", canViewAchat: true, canViewRecap: true },
  { id: "u-011", name: "Resp. Logistique",  email: "logistique@freshlink.ma",   username: "resp-log",   password: "1234",       role: "resp_logistique",  type: "interne", interface: "backoffice", canViewLogistique: true, canViewStock: true, canViewRecap: true },
  { id: "u-012", name: "Resp. Stock",       email: "resp.stock@freshlink.ma",   username: "resp-stock", password: "stock2024",  role: "resp_stock",       type: "interne", interface: "backoffice", canViewStock: true },
  { id: "u-014", name: "Resp. IT",          email: "resp.it@freshlink.ma",      username: "resp-it",    password: "it1234",     role: "resp_it",          type: "interne", interface: "backoffice", canViewDatabase: true },
  { id: "u-015", name: "Resp. Qualité",     email: "resp.qualite@freshlink.ma", username: "resp-qual",  password: "qual2024",   role: "resp_qualite",     type: "interne", interface: "backoffice", canViewLogistique: true, canViewStock: true },

  // ─── FINANCE ─────────────────────────────────────────────────────────────
  { id: "u-016", name: "Cash Manager", email: "cashman@freshlink.ma",    username: "cash", password: "cash2024", role: "cash_man",  type: "interne", interface: "backoffice", canViewCash: true },
  { id: "u-017", name: "Financier",    email: "financier@freshlink.ma",  username: "fin",  password: "fin2024",  role: "financier", type: "interne", interface: "backoffice", canViewFinance: true, canViewCash: true, canViewRecap: true },
  { id: "u-018", name: "Comptable",    email: "comptable@freshlink.ma",  username: "cpt",  password: "cpt2024",  role: "comptable", type: "interne", interface: "backoffice", canViewFinance: true },

  // ─── OPÉRATIONS ──────────────────────────────────────────────────────────
  { id: "u-019", name: "Acheteur",               email: "acheteur@freshlink.ma",   username: "achat",      password: "1234",       role: "acheteur",   type: "interne", interface: "both",       canViewAchat: true },
  { id: "u-020", name: "Pré-vendeur",            email: "prevendeur@freshlink.ma", username: "prevelend",  password: "1234",       role: "prevendeur", type: "interne", interface: "mobile",     canViewCommercial: true },
  { id: "u-021", name: "Commercial Terrain",     email: "commercial@freshlink.ma", username: "com",        password: "com2024",    role: "commercial", type: "interne", interface: "mobile",     canViewCommercial: true },
  { id: "u-022", name: "Livreur",                email: "livreur@freshlink.ma",    username: "livr",       password: "1234",       role: "livreur",    type: "interne", interface: "mobile",     canViewLogistique: true },
  { id: "u-023", name: "Chauffeur",              email: "chauffeur@freshlink.ma",  username: "chauf",      password: "chauf2024",  role: "chauffeur",  type: "interne", interface: "mobile",     canViewLogistique: true },
  { id: "u-024", name: "Dispatcheur",            email: "dispatch@freshlink.ma",   username: "disp",       password: "1234",       role: "dispatcheur",type: "interne", interface: "backoffice", canViewLogistique: true },
  { id: "u-025", name: "Magasinier",             email: "magasin@freshlink.ma",    username: "mag",        password: "1234",       role: "magasinier", type: "interne", interface: "backoffice", canViewStock: true, canViewLogistique: true },
  { id: "u-026", name: "Contrôleur Achat",       email: "ctrl.achat@freshlink.ma", username: "ctrl-achat", password: "ctrl1234",   role: "ctrl_achat", type: "interne", interface: "backoffice", canViewAchat: true },
  { id: "u-027", name: "Contrôleur Préparation", email: "ctrl.prep@freshlink.ma",  username: "ctrl-prep",  password: "ctrl1234",   role: "ctrl_prep",  type: "interne", interface: "backoffice", canViewLogistique: true },
  { id: "u-028", name: "Contrôleur Retour",      email: "ctrl.retour@freshlink.ma",username: "ctrl-retour",password: "cret2024",   role: "ctrl_retour",type: "interne", interface: "backoffice", canViewLogistique: true },

  // ─── EXTERNES — CLIENTS ───────────────────────────────────────────────────
  { id: "c-001", name: "Restaurant Al Baraka", email: "albaraka@demo.ma", username: "albaraka", password: "client123", role: "client",      type: "externe", interface: "client" },
  { id: "c-002", name: "Superette Nour",       email: "nour@demo.ma",     username: "nour",     password: "nour2024",  role: "client",      type: "externe", interface: "client" },
  { id: "c-003", name: "Épicerie Al Amal",     email: "amal@demo.ma",     username: "amal",     password: "amal2024",  role: "client",      type: "externe", interface: "client" },

  // ─── EXTERNES — FOURNISSEURS ──────────────────────────────────────────────
  { id: "f-001", name: "Ferme Souss Agri",     email: "souss@demo.ma",  username: "souss",  password: "fourn2024", role: "fournisseur", type: "externe", interface: "client" },
  { id: "f-002", name: "Coopérative Meknès",   email: "meknes@demo.ma", username: "meknes", password: "fourn2024", role: "fournisseur", type: "externe", interface: "client" },
  { id: "f-003", name: "Coopérative Gharb",    email: "gharb@demo.ma",  username: "gharb",  password: "fourn2024", role: "fournisseur", type: "externe", interface: "client" },
]

const USERS_KEY         = "fl_users"
const DELETED_USERS_KEY = "fl_deleted_user_ids"
const SESSIONS_KEY      = "fl_sessions"

// ════════════════════════════════════════════════════════════════════════════
// HELPERS LISTES LOCALSTORAGE (clés alignées sur les noms de table Supabase)
// ════════════════════════════════════════════════════════════════════════════

function readList<T>(key: string): T[] {
  if (typeof localStorage === "undefined") return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function writeList<T>(key: string, arr: T[]) {
  if (typeof localStorage === "undefined") return
  try { localStorage.setItem(key, JSON.stringify(arr)) } catch { /* quota / privé */ }
}

function readDeletedUserIds(): Set<string> {
  if (typeof localStorage === "undefined") return new Set()
  try {
    const raw = localStorage.getItem(DELETED_USERS_KEY)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch {
    return new Set()
  }
}

// ════════════════════════════════════════════════════════════════════════════
// HELPERS COOKIE  (lisibles par le middleware Next.js côté serveur)
// ════════════════════════════════════════════════════════════════════════════

function setCookie(name: string, value: string, maxAge = 86400) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; path=/; max-age=0`
}

// ════════════════════════════════════════════════════════════════════════════
// DOMAIN TYPES — Achat / Réception / Commandes / Facturation
// ════════════════════════════════════════════════════════════════════════════

export interface ItinerairePoint {
  nom: string
  lat?: number
  lng?: number
  jour?: string
  heureDepart?: string
  heureArrivee?: string
}

export interface Fournisseur {
  id: string
  nom: string
  contact?: string
  telephone?: string
  email: string
  adresse?: string
  ville?: string
  region?: string
  specialites: string[]
  modalitePaiement?: ModalitePaiement
  delaiPaiement?: number
  ice?: string
  rc?: string
  notes?: string
  actif?: boolean
  itineraires?: ItinerairePoint[]
}

export interface HistoriquePrixAchat {
  date: string
  fournisseurId?: string
  fournisseurNom: string
  prixAchat: number
  quantite?: number
}

export interface Article {
  id: string
  nom: string
  nomAr: string
  famille: string
  unite: string
  um?: string
  colisageParUM?: number
  colisageCaisses?: number
  colisageDemiCaisses?: number
  stockDisponible: number
  stockDefect: number
  stockTheorique?: number
  prixAchat: number
  pvMethode: "pourcentage" | "montant" | "manuel"
  pvValeur: number
  photo?: string
  actif?: boolean
  catalogueVisible?: boolean
  shelfLifeJours?: number
  alerteShelfLifeJours?: number
  lots?: { lotId: string; dateReception: string; quantite: number; fournisseurNom?: string }[]
  stockReel?: number
  stockReelDate?: string
  stockReelSaisiPar?: string
  historiquePrixAchat?: HistoriquePrixAchat[]
  marketplaceActif?: boolean
  marketplaceStatut?: "disponible" | "hors_saison" | "out_of_stock" | "short_stock" | "nouveau" | "promo"
  marketplaceCommentaire?: string
  marketplacePrixPublic?: number
  marketplaceDescription?: string
  marketplaceDescriptionAr?: string
  marketplaceSeuilShortStock?: number
  marketplaceTags?: string[]
  marketplaceOrdre?: number
  marketplacePromo?: {
    actif?: boolean
    prixPromo?: number
    etiquette?: string
    dateDebut?: string
    dateFin?: string
  }
}

export interface LigneAchat {
  articleId: string
  articleNom: string
  quantite: number
  prixAchat: number
}

export interface BonAchat {
  id: string
  date: string
  acheteurId: string
  acheteurNom: string
  fournisseurId: string
  fournisseurNom: string
  lignes: LigneAchat[]
  statut: "brouillon" | "validé" | "receptionné"
  emailDestinataire: string
  depotId?: string
  depotNom?: string
}

export interface PurchaseOrder {
  id: string
  date: string
  articleId: string
  articleNom: string
  articleUnite: string
  fournisseurId: string
  fournisseurNom: string
  fournisseurEmail?: string
  quantite: number
  prixUnitaire: number
  total: number
  statut: "ouvert" | "envoyé" | "receptionné" | "annulé"
  notes?: string
  createdBy: string
  depotId?: string
  depotNom?: string
  montantPaye?: number
  statutPaiement?: string
  datePaiement?: string
  notePaiement?: string
  genereAuto?: boolean
}

export interface DemandeAchat {
  id: string
  date: string
  articleNom: string
  articleUnite: string
  quantite: number
  fournisseurNom?: string
  statut: "ouverte" | "en_cours" | "traitee" | "annulee"
  poId: string
  assigneNom?: string
  traiteeAt?: string
}

export interface LigneReception {
  articleId: string
  articleNom: string
  quantiteCommandee: number
  quantiteRecue: number
  quantiteBrute?: number
  nbCaisseGros?: number
  nbCaisseDemi?: number
  typePoids?: "brut" | "net"
  prixAchat?: number
  prixFacture?: number
  quantiteFacturee?: number
  ecartQte?: number
  ecartPrix?: number
  motifReliquat?: string
}

export interface Reception {
  id: string
  date: string
  bonAchatId: string
  purchaseOrderId?: string
  source: "bon_achat" | "purchase_order" | "manuel"
  fournisseurNom: string
  lignes: LigneReception[]
  statut: "en_attente" | "stand_by" | "partielle" | "validée"
  operateurId: string
  notes?: string
}

export interface ContenantTare {
  id: string
  nom: string
  poidsKg: number
  actif: boolean
  notes?: string
}

export interface Client {
  id: string
  nom: string
  secteur?: string
  zone?: string
  type: string
  typeAutre?: string
  taille: string
  typeProduits?: string
  rotation?: string
  telephone?: string
  email?: string
  adresse?: string
  gpsLat?: number
  gpsLng?: number
  notes?: string
  createdBy?: string
  createdAt?: string
  prevendeurId?: string
  defaultHeureLivraison?: string
  delaiRecouvrement?: DelaiRecouvrement
  creditAutorise?: boolean
  creditStatut?: string
  creditSolde?: number
  teamLeadId?: string
  ice?: string
  modalitePaiement?: ModalitePaiement
  plafondCredit?: number
  segment?: ClientSegment
  loyaltyPoints?: number
  loyaltyOptIn?: boolean
  ville?: string
  credit?: number
  actif?: boolean
}

export interface LigneCommande {
  articleId: string
  articleNom: string
  unite: string
  um?: string
  colisageParUM?: number
  quantiteUM?: number
  quantite: number
  prixUnitaire: number
  prixVente: number
  prixUM?: number
  total: number
}

export interface Commande {
  id: string
  date: string
  commercialId?: string
  commercialNom?: string
  clientId: string
  clientNom: string
  secteur?: string
  zone?: string
  gpsLat?: number
  gpsLng?: number
  lignes: LigneCommande[]
  heurelivraison: string
  statut: string
  emailDestinataire?: string
  teamLeadId?: string
  teamLeadNom?: string
  notes?: string
  motifRefus?: string
  approbateur?: string
  approbateurId?: string
  dateApprobation?: string
}

export interface Visite {
  id: string
  date: string
  prevendeurId: string
  prevendeurNom: string
  clientId: string
  clientNom: string
  commandeId?: string
  resultat: string
  gpsLat?: number
  gpsLng?: number
  raisonSansCommande?: string
}

export interface CaisseVide {
  id: string
  libelle: string
  type: "gros" | "demi"
  capaciteKg: number
  stock: number
  enCirculation: number
}

export interface CaisseEntry {
  id: string
  date: string
  libelle: string
  type: "entree" | "sortie"
  categorie: string
  montant: number
  reference?: string
  createdBy: string
}

export type PeriodeDistribution = "journalier" | "hebdomadaire" | "mensuel"
export type CategorieCharge = "transport" | "equipement" | "salaire" | "loyer" | "energie" | "maintenance" | "communication" | "assurance" | "impots" | "autre"
export type StatutSalarie = "actif" | "conge" | "periode_essai" | "inactif"
export type TypeContrat = "cdi" | "cdd" | "interim" | "saisonnier"
export type Civilite = "M." | "Mme" | "Mlle"

export interface Actionnaire {
  id: string
  nom: string
  prenom: string
  telephone?: string
  cotisation: number
  dateEntree: string
  periodeDistribution: PeriodeDistribution
  actif: boolean
}

export interface Charge {
  id: string
  date: string
  libelle: string
  categorie: CategorieCharge
  montant: number
  recurrente: boolean
  createdBy: string
}

export interface Salarie {
  id: string
  civilite?: Civilite
  nom: string
  prenom: string
  poste: string
  departement?: string
  telephone?: string
  email?: string
  adresse?: string
  ville?: string
  cin?: string
  cnss?: string
  nationalite?: string
  dateNaissance?: string
  lieuNaissance?: string
  diplome?: string
  experienceAns?: number
  statutFamilial?: string
  nbEnfants?: number
  dateEmbauche: string
  typeContrat: TypeContrat
  datefinCdd?: string
  salaireBrut: number
  salaireNet?: number
  avances: number
  modePaiement?: string
  numCompteBancaire?: string
  banque?: string
  statut: StatutSalarie
  notes?: string
  dossierComplet?: boolean
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}

export type DiscountScope = "client" | "article" | "famille" | "segment" | "global"
export type DiscountType = "pourcentage" | "montant_fixe" | "article_offert"
export type ClientSegment = "standard" | "vip" | "grossiste" | "fidele"

export type BonusCriteria = "zero_retard" | "zero_retour" | "zero_qualite"

export interface DriverBonusConfig {
  actif?: boolean
  cycleBonus?: string
  bonusZeroRetard: number
  bonusExterneZeroRetard: number
  bonusZeroRetour: number
  bonusExterneZeroRetour: number
  bonusZeroQualite: number
  bonusExterneZeroQualite: number
  bonusParfait: number
  bonusExterneParfait: number
  updatedBy?: string
  updatedAt?: string
}

export interface DriverBonusRecord {
  id: string
  livreurId: string
  livreurNom: string
  driverType: "interne" | "externe"
  tripId: string
  date: string
  zeroRetard: boolean
  zeroRetour: boolean
  zeroQualite: boolean
  montantBonus: number
  criteriaRemplis: BonusCriteria[]
  statut: "calcule" | "valide" | "paye"
  validePar?: string
  createdAt: string
}

export interface ShareholderDistribution {
  id: string
  periode: string
  cycleType: "journalier" | "hebdomadaire" | "mensuel"
  beneficeNet: number
  totalDistribue: number
  lignes: {
    actionnaireId: string
    actionnaireNom: string
    cotisation: number
    part: number
    montant: number
    statut: "en_attente" | "paye"
    datePaiement?: string
  }[]
  statut: "brouillon" | "valide" | "distribue"
  validePar?: string
  createdBy: string
  createdAt: string
  notes?: string
}

export interface DiscountRule {
  id: string
  nom: string
  actif: boolean
  scope: DiscountScope
  clientId?: string
  clientNom?: string
  articleId?: string
  articleNom?: string
  famille?: string
  segment?: ClientSegment
  type: DiscountType
  valeur: number
  articleOffertId?: string
  articleOffertNom?: string
  articleOffertQte?: number
  codePromo?: string
  commandeMinDH?: number
  dateDebut?: string
  dateFin?: string
  messageWhatsApp?: string
  appOnly?: boolean
  createdBy: string
  createdAt: string
  updatedAt?: string
}

export interface LoyaltyConfig {
  actif: boolean
  pointsParDH: number
  bonusAppOrder: number
  bonusZeroRetour: number
  expirationJours?: number
  pointsParRemiseDH: number
  minimumPointsRachat: number
  pointsArticleCadeau: number
  articleCadeauNom?: string
  articleCadeauId?: string
  articleCadeauQte?: number
  updatedBy?: string
  updatedAt?: string
}

export interface LoyaltyTransaction {
  id: string
  clientId: string
  clientNom: string
  type: "gain" | "rachat"
  points: number
  motif?: string
  redemptionType?: "remise_monetaire" | "article_offert"
  redemptionValeur?: number
  redemptionArticleId?: string
  statut: string
  createdBy: string
  createdAt: string
}

export type UserAccessType = "mobile" | "backoffice" | "both"
export type GranularPermissions = Record<string, boolean | undefined>

export interface RHNotification {
  id: string
  type: string
  titre: string
  message: string
  salarieNom?: string
  lu: boolean
  traite: boolean
  userId?: string
  createdAt: string
  createdBy: string
}

export interface PaiementSalaire {
  id: string
  salarieId: string
  salarieNom: string
  mois: string
  salaireBrut: number
  avance: number
  salaireNet: number
  datePaiement: string
  createdBy: string
}

export type CaissePricing = { prixGrosseCaisse: number; prixDemiCaisse: number }
export type FraisBlConfig = { fraisImpressionParFeuille: number; nbFeuilles: number; fraisServiceParCaisse: number }
export type TypeCaisse = "gros" | "demi"
export const TYPES_CAISSE_LABELS: Record<TypeCaisse, string> = { gros: "Grosse caisse", demi: "Demi caisse" }

export interface CaisseVideMouvement {
  id: string
  date: string
  typeOperation: "expedition" | "retour" | "reception" | "achat" | "manuel"
  sens: "entree" | "sortie"
  nbCaisseGros: number
  nbCaisseDemi: number
  referenceDoc?: string
  articleNom?: string
  operateurId: string
  operateurNom: string
  notes?: string
  [key: string]: any
}

export interface CutoffNotification {
  id: string
  time: string
  message: string
  active: boolean
  roles: UserRole[]
}

export const DEFAULT_CUTOFFS: CutoffNotification[] = [
  { id: "cutoff-achat", time: "09:00", message: "Cutoff commandes fournisseurs", active: true, roles: ["acheteur"] },
]

export interface ReserveCaisseSnap {
  id: string
  date: string
  periode: string
  beneficeNet: number
  tauxReserve: number
  montantReserve: number
  repartition: { actionnaireId: string; nom: string; prenom: string; part: number; montant: number }[]
  createdBy: string
}

export interface WebIntegrationConfig {
  enabled: boolean
  apiKey: string
  allowedOrigins: string[]
  webhookUrl?: string
  updatedAt?: string
  updatedBy?: string
  [key: string]: any
}

export interface AccountRequest {
  id: string
  email: string
  nom: string
  type: "client" | "fournisseur"
  statut: "en_attente" | "approuve" | "rejete"
  societe?: string
  telephone?: string
  ville?: string
  ice?: string
  _linkedClientId?: string
  _linkedFournisseurId?: string
  approvedAt?: string
  approvedBy?: string
  rejectedAt?: string
  rejectedBy?: string
  rejectReason?: string
  [key: string]: any
}

export type FeedbackSource = "client" | "fournisseur" | "equipe"
export type FeedbackStatut = "nouveau" | "lu" | "traite"

export interface Feedback {
  id: string
  source: FeedbackSource
  auteur: string
  sujet: string
  message: string
  note: number
  date: string
  statut: FeedbackStatut
}

export type SourcingGrade = "A+" | "A" | "B" | "C"
export type SourcingStatut = "disponible" | "epuise" | "commande" | "annule"

export interface SourcingEntry {
  id: string
  createdAt: string
  updatedAt: string
  userId: string
  userName: string
  articleId?: string
  articleNom: string
  categorie: string
  fournisseurNom: string
  fournisseurTel?: string
  fournisseurContact?: string
  region: string
  marche?: string
  adresse?: string
  gpsLat?: number
  gpsLng?: number
  prixUnitaire: number
  prixNegociable: boolean
  prixMin?: number
  unite: string
  quantiteDisponible: number
  quantiteMin?: number
  qualiteGrade: SourcingGrade
  photoUrls: string[]
  disponibleJusquA?: string
  delaiLivraison: string
  notes?: string
  statut: SourcingStatut
}

export interface AnalyseAchat {
  article: string
  qteAchat: number
  valeurAchat: number
  qteReception: number
  valeurReception: number
  valeurRetenue: number
  montantDonne: number
  montantRendu: number
  ecart: number
}

export interface CmdVsFacturation {
  article: string
  client: string
  qteCmdee: number
  prixCmd: number
  qteFact: number
  prixFact: number
  ecartQte: number
  ecartValeur: number
}

export interface BonLivraison {
  id: string
  date: string
  commandeId?: string
  clientId?: string
  clientNom: string
  secteur?: string
  livreurNom?: string
  statut?: string
  valideMagasinier?: boolean
  montantTotal: number
  montantTTC?: number
  lignes: { articleId?: string; articleNom: string; quantite: number; total: number; prixUnitaire?: number; unite?: string }[]
  [key: string]: any
}

export type PriceEntryType = "fournisseur" | "client"
export type PriceSource = "visite" | "telephone" | "whatsapp" | "email" | "marche" | "autre"
export type PriceEvolution = "hausse" | "baisse" | "stable"

export interface PriceEntry {
  id: string
  createdAt: string
  updatedAt: string
  userId: string
  userName: string
  articleId?: string
  articleNom: string
  categorie: string
  type: PriceEntryType
  fournisseurNom?: string
  fournisseurTel?: string
  region?: string
  marche?: string
  clientNom?: string
  clientTel?: string
  clientRegion?: string
  prixUnitaire: number
  unite: string
  prixMin?: number
  prixMax?: number
  qualiteGrade?: string
  source: PriceSource
  date: string
  notes?: string
  prixPrecedent?: number
  evolution?: PriceEvolution
}

interface BesoinNetEntry {
  articleId: string
  articleNom: string
  unite: string
  commandeQty: number
  stockQty: number
  besoinNet: number
}

interface VirtualStock {
  physical: number
  available: number
  pending: number
}

export interface WorkflowStep {
  id: string
  label: string
  labelAr?: string
  description?: string
  enabled: boolean
  mandatory: boolean
  canBypass: boolean
  bypassed?: boolean
  gate?: boolean
}

export interface WorkflowConfig {
  validationCommande: "direct" | "approval" | string
  steps?: WorkflowStep[]
  [key: string]: any
}

export type ProcessMode = "prevendeur_direct" | "commercial_classique" | "full_process"

export interface ProcessConfig {
  mode: ProcessMode
  enableAchat: boolean
  enableReception: boolean
  enablePreparation: boolean
  enableLogistiqueValidation: boolean
  enableBLPrint: boolean
  enableTripDispatch: boolean
  enableCaisse: boolean
  enableQualiteControle: boolean
  enableControlAchat: boolean
  enableControlPreparation: boolean
  enableControlExpedition: boolean
  enableDispatchCommandes: boolean
  notes?: string
}

export const DEFAULT_PROCESS_CONFIG: ProcessConfig = {
  mode: "prevendeur_direct",
  enableAchat: false,
  enableReception: false,
  enablePreparation: false,
  enableLogistiqueValidation: false,
  enableBLPrint: false,
  enableTripDispatch: false,
  enableCaisse: false,
  enableQualiteControle: false,
  enableControlAchat: false,
  enableControlPreparation: false,
  enableControlExpedition: false,
  enableDispatchCommandes: false,
}

export interface EmailConfig {
  achat: string
  commercial: string
  recapAuto?: boolean
  recapHeure?: string
  besoinAuto?: boolean
  besoinHeure?: string
  besoinPushAuto?: boolean
  besoinDelaiMinutes?: number
  [key: string]: any
}

export type HRTemplateType = "contrat" | "attestation_travail" | "attestation_salaire" | "fiche_paie" | "avertissement" | "mise_en_demeure" | "bon_livraison" | "facture" | "purchase_order"

export interface HRCustomTemplate {
  id: string
  nom: string
  type: HRTemplateType
  description?: string
  contenu: string
  variables: string[]
  actif: boolean
  createdBy: string
  createdAt: string
  updatedAt?: string
}

export interface CompanyConfig {
  appName?: string
  appSlogan?: string
  nom?: string
  logo?: string
  couleurEntete?: string
  adresse?: string
  ville?: string
  telephone?: string
  email?: string
  siteWeb?: string
  [key: string]: any
}

export interface Depot {
  id: string
  nom: string
  actif?: boolean
  adresse?: string
  ville?: string
  responsableNom?: string
  notes?: string
}

export interface Secteur {
  id: string
  nom: string
  ville?: string
  zones?: string[]
  responsableId?: string
  responsableNom?: string
  couleur?: string
  actif?: boolean
  notes?: string
}

export interface Famille {
  id: string
  nom: string
  couleur?: string
  ordre?: number
  actif?: boolean
  notes?: string
}

// Types Logistique/RH minimalistes — hors périmètre Achat/Réception/Commandes/Facturation,
// déclarés juste pour satisfaire la compilation partagée de lib/supabase/db.ts
export interface Trip { id: string; itineraire?: TripItineraryPoint[]; commandeIds: string[]; numero?: string; [key: string]: any }
export interface Retour { id: string; date?: string; livreurNom?: string; lignes: any[]; [key: string]: any }

export type TripChargeType = "carburant" | "peage" | "reparation" | "chargement" | "dechargement" | "parking" | "autre"

export interface RetourMarchandiseItem {
  article: string
  quantite: number
  motif: "pas_notre_variete" | "produit_pourri" | "trop_vieux" | "endommage" | "autre"
  alerte: boolean
  iaObservation?: string
}

export interface ControleRetour {
  date: string
  caissesPrevues: number
  caissesRetournees: number
  caissesMarcheRetour: number
  marchandises: RetourMarchandiseItem[]
  validated: boolean
  observations?: string
}

export interface TripChargeItem {
  type: TripChargeType
  montant: number
  description?: string
}

export interface TripCharge {
  id: string
  numero: string
  date: string
  livreur: string
  immatricule: string
  secteur: string
  nbCaissesFact: number
  nbClients: number
  kmDepart: number | null
  kmRetour: number | null
  charges: TripChargeItem[]
  validated: boolean
  controleRetour?: ControleRetour
  [key: string]: any
}
export interface TransfertStock { id: string; [key: string]: any }
export interface Livreur {
  id: string
  nom: string
  prenom: string
  type: "interne" | "externe"
  telephone?: string
  actif: boolean
  matricule?: string
  cin?: string
  capaciteCaisses?: number
  capaciteTonnage?: number
  typeVehicule?: string
  marqueVehicule?: string
}

export interface TransportCompany {
  id: string
  nom: string
  actif: boolean
  [key: string]: any
}
export interface MotifRetour { id: string; [key: string]: any }
export interface Message { id: string; [key: string]: any }
export interface Notice { id: string; [key: string]: any }

export type ModePreparation = "par_trip" | "par_client" | "par_article"
export type TypePreparation = "stockage" | "cross_dock"
export type FormatPreparation = "numerique" | "papier"
export type SequenceModePrep = "horaire" | "itineraire"

export interface ClientSequenceInfo {
  clientId: string
  clientNom: string
  heurelivraison?: string
  ordre: number
  secteur?: string
  zone?: string
  gpsLat?: number
  gpsLng?: number
}

export interface TripItineraryPoint {
  clientNom: string
  ordre: number
  lat?: number
  lng?: number
  [key: string]: any
}

export interface LignePreparation {
  articleId: string
  articleNom: string
  unite: string
  qtesParClient: Record<string, number>
  qteCommandee: number
  qtePrepared: number
  valide: boolean
}

export interface BonPreparation {
  id: string
  nom: string
  date: string
  mode: ModePreparation
  type: TypePreparation
  format: FormatPreparation
  tripId?: string
  clientIds: string[]
  clientsInfo: ClientSequenceInfo[]
  sequenceMode: SequenceModePrep
  lignes: LignePreparation[]
  statut: "brouillon" | "en_cours" | "valide"
  createdBy: string
  validatedAt?: string
  validatedBy?: string
}

// ════════════════════════════════════════════════════════════════════════════
// STORE
// ════════════════════════════════════════════════════════════════════════════

export const store = {

  // ── Auth ────────────────────────────────────────────────────────────────

  /**
   * Connexion par email OU username + mot de passe.
   * Accepte les mots de passe de n'importe quelle longueur (ex: "1234").
   */
  login(identifier: string, password: string): User | null {
    const users = this.getUsers()
    const id  = identifier.trim().toLowerCase()
    const pwd = password.trim()

    const user = users.find(u => {
      const matchId = (u.email || "").toLowerCase() === id
                   || (u.username || "").toLowerCase() === id
      const matchPwd = (u.password || "").trim() === pwd
      return matchId && matchPwd
    })

    if (user) this.setSession(user)
    return user ?? null
  },

  loginClient(name: string): User | null {
    const users = this.getUsers()
    const norm  = name.trim().toLowerCase()
    const user  = users.find(u =>
      u.name.toLowerCase() === norm && u.type === "externe"
    )
    if (user) this.setSession(user)
    return user ?? null
  },

  logout() {
    localStorage.removeItem(SESSIONS_KEY)
    deleteCookie("fl-session")
  },

  getSession(): User | null {
    try {
      const s = localStorage.getItem(SESSIONS_KEY)
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  },

  /**
   * Enregistre la session en localStorage ET pose un cookie
   * "fl-session" lisible par middleware.ts (côté serveur).
   */
  setSession(user: User) {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(user))
    setCookie("fl-session", "1", 86400) // 24 h
  },

  // ── Users ────────────────────────────────────────────────────────────────

  getUsers(): User[] {
    try {
      const raw = localStorage.getItem(USERS_KEY)
      if (!raw) return [...DEFAULT_USERS]
      const saved: User[] = JSON.parse(raw)
      const deletedIds = readDeletedUserIds()
      // Fusion : garantit que les DEFAULT_USERS manquants sont toujours présents,
      // sauf ceux explicitement supprimés par un admin (voir saveUsers).
      const ids = new Set(saved.map(u => u.id))
      const merged = [
        ...saved,
        ...DEFAULT_USERS.filter(u => !ids.has(u.id) && !deletedIds.has(u.id)),
      ]
      return merged
    } catch {
      return [...DEFAULT_USERS]
    }
  },

  saveUsers(users: User[]) {
    // Toute entrée DEFAULT_USERS absente de la liste sauvegardée est une
    // suppression volontaire : on la mémorise pour qu'elle ne revienne pas
    // au prochain getUsers() (qui, sinon, la re-fusionne systématiquement).
    try {
      const presentIds = new Set(users.map(u => u.id))
      const deletedIds = readDeletedUserIds()
      DEFAULT_USERS.forEach(u => { if (!presentIds.has(u.id)) deletedIds.add(u.id) })
      localStorage.setItem(DELETED_USERS_KEY, JSON.stringify([...deletedIds]))
    } catch { /* ignore */ }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  },

  addUser(user: User) {
    const users = this.getUsers()
    const idx   = users.findIndex(u => u.id === user.id)
    if (idx >= 0) users[idx] = user
    else users.push(user)
    this.saveUsers(users)
  },

  /**
   * Réinitialise le mot de passe par email OU username.
   * Retourne le nouveau mot de passe généré, ou null si non trouvé.
   */
  resetPassword(emailOrUsername: string, newPassword?: string): string | null {
    const users = this.getUsers()
    const id    = emailOrUsername.trim().toLowerCase()

    const idx = users.findIndex(u =>
      (u.email || "").toLowerCase() === id ||
      (u.username || "").toLowerCase() === id
    )

    if (idx < 0) return null

    // Générer un mot de passe si non fourni
    const chars  = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
    const newPwd = newPassword?.trim() ||
      Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")

    users[idx] = { ...users[idx], password: newPwd }
    this.saveUsers(users)
    return newPwd
  },

  // ── Biometric ────────────────────────────────────────────────────────────

  markBiometricPrompted(userId: string) {
    const users = this.getUsers()
    const idx   = users.findIndex(u => u.id === userId)
    if (idx >= 0) {
      users[idx] = { ...users[idx], biometricPrompted: true }
      this.saveUsers(users)
    }
  },

  wasBiometricPrompted(userId: string): boolean {
    return this.getUsers().some(u => u.id === userId && u.biometricPrompted)
  },

  saveBiometricId(userId: string, bioId: string) {
    const users = this.getUsers()
    const idx   = users.findIndex(u => u.id === userId)
    if (idx >= 0) {
      users[idx] = { ...users[idx], biometricId: bioId }
      this.saveUsers(users)
    }
  },

  // ── Company config ────────────────────────────────────────────────────────

  getCompanyConfig(): CompanyConfig {
    return {
      appName:   "FreshLink Pro",
      appSlogan: "Powered by Vita Tech",
      logo:      "/empire-fresh-logo.png",
      nom:       "Dima Krib Lik",
    }
  },
  saveCompanyConfig(_: CompanyConfig) {},
  getProcessConfig(): ProcessConfig { return DEFAULT_PROCESS_CONFIG },
  saveProcessConfig(_: any) {},
  getProcessSubSteps(): Record<string, Record<string, boolean>> { return {} },
  saveProcessSubSteps(_: any) {},
  saveWorkflowConfig(_: any) {},
  getHRTemplates(): HRCustomTemplate[] { return [] },
  addHRTemplate(_: HRCustomTemplate) {},
  updateHRTemplate(_id: string, _patch: Partial<HRCustomTemplate>) {},
  deleteHRTemplate(_id: string) {},
  getSourcingEntries(): SourcingEntry[] { return [] },
  addSourcingEntry(_: SourcingEntry) {},
  updateSourcingEntry(_: SourcingEntry) {},
  deleteSourcingEntry(_id: string) {},
  getFeedbacks(): Feedback[] { return [] },
  getAccountRequests(): AccountRequest[] { return [] },
  saveAccountRequests(_: any) {},
  addFeedback(_: Feedback) {},
  updateFeedbackStatus(_id: string, _statut: FeedbackStatut) {},

  // ── Login helpers ─────────────────────────────────────────────────────────

  loginGetForcedView(email: string, password: string): "mobile" | "backoffice" | null {
    const user = this.login(email, password)
    if (!user) return null
    const iface = getUserInterface(user)
    return iface === "both" ? null : (iface as "mobile" | "backoffice" | null)
  },

  // ── Données ─────────────────────────────────────────────────────────────
  getClients(): Client[]            { return readList<Client>("fl_clients") },
  saveClients(v: Client[])          { writeList("fl_clients", v) },
  getArticles(): Article[]          { return readList<Article>("fl_articles") },
  saveArticles(v: Article[])        { writeList("fl_articles", v) },
  getFournisseurs(): Fournisseur[]  { return readList<Fournisseur>("fl_fournisseurs") },
  saveFournisseurs(v: Fournisseur[]) { writeList("fl_fournisseurs", v) },
  getSecteurs(): Secteur[]          { return readList<Secteur>("fl_secteurs") },
  saveSecteurs(v: Secteur[])        { writeList("fl_secteurs", v) },
  addSecteur(s: Secteur) { const all = this.getSecteurs(); all.push(s); this.saveSecteurs(all) },
  updateSecteur(id: string, patch: Partial<Secteur>) {
    const all = this.getSecteurs()
    const idx = all.findIndex(s => s.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveSecteurs(all) }
  },
  deleteSecteur(id: string) {
    this.saveSecteurs(this.getSecteurs().filter(s => s.id !== id))
  },
  getFamilles(): Famille[]          { return readList<Famille>("fl_familles") },
  saveFamilles(v: Famille[])        { writeList("fl_familles", v) },
  addFamille(f: Famille) { const all = this.getFamilles(); all.push(f); this.saveFamilles(all) },
  updateFamille(id: string, patch: Partial<Famille>) {
    const all = this.getFamilles()
    const idx = all.findIndex(f => f.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveFamilles(all) }
  },
  deleteFamille(id: string) {
    this.saveFamilles(this.getFamilles().filter(f => f.id !== id))
  },
  getCommandes(): Commande[]        { return readList<Commande>("fl_commandes") },
  saveCommandes(v: Commande[])      { writeList("fl_commandes", v) },
  updateCommande(id: string, patch: Partial<Commande>) {
    const all = this.getCommandes()
    const idx = all.findIndex(c => c.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveCommandes(all) }
  },
  formatMAD(amount: number): string {
    return `${amount.toLocaleString("fr-MA", { maximumFractionDigits: 2 })} MAD`
  },
  getBonsLivraison(): BonLivraison[] { return readList<BonLivraison>("fl_bons_livraison") },
  saveBonsLivraison(v: BonLivraison[]) { writeList("fl_bons_livraison", v) },
  addBonLivraison(b: BonLivraison) {
    const all = this.getBonsLivraison(); all.push(b); this.saveBonsLivraison(all)
  },
  getTripCharges(): TripCharge[] { return readList<TripCharge>("fl_trip_charges") },
  addTripCharge(c: TripCharge) {
    const all = this.getTripCharges(); all.push(c); writeList("fl_trip_charges", all)
  },
  updateTripCharge(id: string, patch: Partial<TripCharge>) {
    const all = this.getTripCharges()
    const idx = all.findIndex(c => c.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; writeList("fl_trip_charges", all) }
  },
  addTransportCompany(c: TransportCompany) {
    const all = this.getTransportCompanies(); all.push(c); this.saveTransportCompanies(all)
  },
  updateTransportCompany(id: string, patch: Partial<TransportCompany>) {
    const all = this.getTransportCompanies()
    const idx = all.findIndex(c => c.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveTransportCompanies(all) }
  },
  deleteTransportCompany(id: string) {
    this.saveTransportCompanies(this.getTransportCompanies().filter(c => c.id !== id))
  },
  getPurchaseOrders(): PurchaseOrder[] { return readList<PurchaseOrder>("fl_purchase_orders") },
  savePurchaseOrders(v: PurchaseOrder[]) { writeList("fl_purchase_orders", v) },
  getReceptions(): Reception[] { return readList<Reception>("fl_receptions") },
  saveReceptions(v: Reception[]) { writeList("fl_receptions", v) },
  getTrips(): Trip[] { return readList<Trip>("fl_trips") },
  saveTrips(v: Trip[]) { writeList("fl_trips", v) },
  addTrip(t: Trip) { const all = this.getTrips(); all.push(t); this.saveTrips(all) },
  updateTrip(id: string, patch: Partial<Trip>) {
    const all = this.getTrips()
    const idx = all.findIndex(t => t.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveTrips(all) }
  },
  genTripNumber(): string { return `TRIP-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` },
  getTransportCompanies(): TransportCompany[] { return readList<TransportCompany>("fl_transport_companies") },
  saveTransportCompanies(v: TransportCompany[]) { writeList("fl_transport_companies", v) },
  getVisites(): Visite[] { return readList<Visite>("fl_visites") },
  saveVisites(v: Visite[]) { writeList("fl_visites", v) },
  getRetours(): Retour[] { return readList<Retour>("fl_retours") },
  saveRetours(v: Retour[]) { writeList("fl_retours", v) },
  addRetour(r: Retour) { const all = this.getRetours(); all.push(r); this.saveRetours(all) },
  getBonsAchat(): BonAchat[] { return readList<BonAchat>("fl_bons_achat") },
  saveBonsAchat(v: BonAchat[]) { writeList("fl_bons_achat", v) },
  getBonsPreparation(): BonPreparation[] { return readList<BonPreparation>("fl_bons_preparation") },
  saveBonsPreparation(v: BonPreparation[]) { writeList("fl_bons_preparation", v) },
  addBonPreparation(b: BonPreparation) {
    const all = this.getBonsPreparation(); all.push(b); this.saveBonsPreparation(all)
  },
  getTransferts(): TransfertStock[] { return readList<TransfertStock>("fl_transferts_stock") },
  addTransfert(t: TransfertStock) {
    const all = this.getTransferts(); all.push(t); this.saveTransferts(all)
  },
  saveTransferts(v: TransfertStock[]) { writeList("fl_transferts_stock", v) },
  getLivreurs(): Livreur[] { return readList<Livreur>("fl_livreurs") },
  saveLivreurs(v: Livreur[]) { writeList("fl_livreurs", v) },
  addLivreur(l: Livreur) { const all = this.getLivreurs(); all.push(l); this.saveLivreurs(all) },
  getMotifs(): MotifRetour[] { return readList<MotifRetour>("fl_motifs_retour") },
  saveMotifs(v: MotifRetour[]) { writeList("fl_motifs_retour", v) },
  getMessages(): Message[] { return readList<Message>("fl_messages") },
  saveMessages(v: Message[]) { writeList("fl_messages", v) },
  addMessage(m: Message) { const all = this.getMessages(); all.push(m); this.saveMessages(all) },
  getNotices(): Notice[] { return readList<Notice>("fl_notices") },
  saveNotices(v: Notice[]) { writeList("fl_notices", v) },

  // ── Achat / Fournisseurs ───────────────────────────────────────────────────
  addFournisseur(f: Fournisseur) {
    const all = this.getFournisseurs(); all.push(f); this.saveFournisseurs(all)
  },
  updateFournisseur(id: string, patch: Partial<Fournisseur>) {
    const all = this.getFournisseurs()
    const idx = all.findIndex(f => f.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveFournisseurs(all) }
  },
  deleteFournisseur(id: string) {
    this.saveFournisseurs(this.getFournisseurs().filter(f => f.id !== id))
  },
  addBonAchat(b: BonAchat) { const all = this.getBonsAchat(); all.push(b); this.saveBonsAchat(all) },
  updateBonAchat(id: string, patch: Partial<BonAchat>) {
    const all = this.getBonsAchat()
    const idx = all.findIndex(b => b.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveBonsAchat(all) }
  },
  addHistoriquePrixAchat(articleId: string, entry: HistoriquePrixAchat) {
    const all = this.getArticles()
    const idx = all.findIndex(a => a.id === articleId)
    if (idx >= 0) {
      const hist = all[idx].historiquePrixAchat ?? []
      all[idx] = { ...all[idx], historiquePrixAchat: [...hist, entry] }
      this.saveArticles(all)
    }
  },
  getEmailConfig(): EmailConfig { return { achat: "", commercial: "" } },
  saveEmailConfig(_: any) {},
  getDemandesAchat(): DemandeAchat[] { return [] },
  updateDemandeAchat(_id: string, _patch: any) {},
  getPendingPOsForAcheteur(): PurchaseOrder[] { return [] },
  refuserPO(_poId: string, _userId: string, _userName: string, _motif: string): DemandeAchat | null { return null },
  autoGeneratePOsFromBesoin(): PurchaseOrder[] { return [] },
  computeBesoinNet(): BesoinNetEntry[] { return [] },
  getDepots(): Depot[] { return [DEFAULT_DEPOT] },
  addDepot(_: Depot) {},
  updateDepot(_id: string, _patch: Partial<Depot>) {},
  deleteDepot(_id: string) {},
  getContenantsConfig(): ContenantTare[] { return [] },
  saveContenantsConfig(_: any) {},
  updateContenant(_id: string, _patch: Partial<ContenantTare>) {},
  getCaissesVides(): CaisseVide[] { return [] },
  updateCaisseVide(_id: string, _patch: any) {},
  getCaisseEntries(): CaisseEntry[] { return [] },
  addCaisseEntry(_: CaisseEntry) {},
  sortieCaissesVides(_id: string, _nb: number) {},
  retourCaissesVides(_id: string, _nb: number) {},
  addCaisseMouvement(_: any) {},
  getCaissesMovements(): CaisseVideMouvement[] { return [] },
  getCaissePricing(): CaissePricing { return DEFAULT_CAISSE_PRICING },
  getActionnaires(): Actionnaire[] { return [] },
  addActionnaire(_: Actionnaire) {},
  updateActionnaire(_id: string, _patch: Partial<Actionnaire>) {},
  deleteActionnaire(_id: string) {},
  getCharges(): Charge[] { return [] },
  addCharge(_: Charge) {},
  updateCharge(_id: string, _patch: Partial<Charge>) {},
  deleteCharge(_id: string) {},
  getSalaries(): Salarie[] { return [] },
  addSalarie(_: Salarie) {},
  updateSalarie(_id: string, _patch: Partial<Salarie>) {},
  deleteSalarie(_id: string) {},
  getPaiementsSalaires(): PaiementSalaire[] { return [] },
  addPaiementSalaire(_: PaiementSalaire) {},
  getReserveSnaps(): ReserveCaisseSnap[] { return [] },
  addReserveSnap(_: ReserveCaisseSnap) {},
  getCutoffs(): CutoffNotification[] { return DEFAULT_CUTOFFS },
  saveCutoffs(_: any) {},
  getRHNotifications(): RHNotification[] { return [] },
  addRHNotification(_: RHNotification) {},
  // Fail-closed: no permission is granted unless explicitly present and true.
  getGranularPerms(_userId: string): GranularPermissions { return {} },
  // Fail-closed: camera access is off unless explicitly granted (grantCamera is a no-op stub for now).
  getCameraPermissions(): Record<string, boolean> { return {} },
  grantCamera(_userId: string, _granted: boolean) {},
  saveGranularPerms(_userId: string, _perms: GranularPermissions) {},
  markRHNotifLu(_id: string) {},
  markRHNotifTraite(_id: string) {},
  isReadOnly(): boolean { return false },
  getDiscountRules(): DiscountRule[] { return [] },
  addDiscountRule(_: DiscountRule) {},
  updateDiscountRule(_id: string, _patch: Partial<DiscountRule>) {},
  deleteDiscountRule(_id: string) {},
  getLoyaltyConfig(): LoyaltyConfig {
    return {
      actif: true, pointsParDH: 1, bonusAppOrder: 5, bonusZeroRetour: 10,
      pointsParRemiseDH: 100, minimumPointsRachat: 100, pointsArticleCadeau: 500,
    }
  },
  saveLoyaltyConfig(_: any) {},
  getLoyaltyTransactions(): LoyaltyTransaction[] { return [] },
  getClientPoints(_clientId: string): number { return 0 },
  addLoyaltyTransaction(_: LoyaltyTransaction) {},
  getDriverBonusConfig(): DriverBonusConfig {
    return {
      bonusZeroRetard: 0, bonusExterneZeroRetard: 0,
      bonusZeroRetour: 0, bonusExterneZeroRetour: 0,
      bonusZeroQualite: 0, bonusExterneZeroQualite: 0,
      bonusParfait: 0, bonusExterneParfait: 0,
    }
  },
  saveDriverBonusConfig(_: any) {},
  getDriverBonusRecords(): DriverBonusRecord[] { return [] },
  addDriverBonusRecord(_: DriverBonusRecord) {},
  saveDriverBonusRecords(_: any) {},
  getShareholderDistributions(): ShareholderDistribution[] { return [] },
  addShareholderDistribution(_: ShareholderDistribution) {},
  saveShareholderDistributions(_: any) {},

  // ── Purchase Orders ──────────────────────────────────────────────────────
  addPurchaseOrder(p: PurchaseOrder) { const all = this.getPurchaseOrders(); all.push(p); this.savePurchaseOrders(all) },
  updatePurchaseOrder(id: string, patch: Partial<PurchaseOrder>) {
    const all = this.getPurchaseOrders()
    const idx = all.findIndex(p => p.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.savePurchaseOrders(all) }
  },

  // ── Réception ────────────────────────────────────────────────────────────
  addReception(r: Reception) { const all = this.getReceptions(); all.push(r); this.saveReceptions(all) },
  getVirtualStock(_articleId: string): VirtualStock { return { physical: 0, available: 0, pending: 0 } },
  updateStock(articleId: string, qty: number, isDefect?: boolean) {
    const all = this.getArticles()
    const idx = all.findIndex(a => a.id === articleId)
    if (idx < 0) return
    const a = all[idx]
    all[idx] = isDefect
      ? { ...a, stockDefect: (a.stockDefect ?? 0) + qty }
      : { ...a, stockDisponible: (a.stockDisponible ?? 0) + qty }
    this.saveArticles(all)
  },

  // ── Commandes / Clients ──────────────────────────────────────────────────
  addClient(c: Client) { const all = this.getClients(); all.push(c); this.saveClients(all) },
  updateClient(id: string, patch: Partial<Client>) {
    const all = this.getClients()
    const idx = all.findIndex(c => c.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveClients(all) }
  },
  getClientBaskets(): { clientId: string; lignes: { articleNom: string; quantiteHabituelle: number; unite: string }[] }[] { return [] },
  addCommande(c: Commande) { const all = this.getCommandes(); all.push(c); this.saveCommandes(all) },
  deleteCommande(id: string) { this.saveCommandes(this.getCommandes().filter(c => c.id !== id)) },
  addVisite(v: Visite) { const all = this.getVisites(); all.push(v); this.saveVisites(all) },
  computePV(article: Article): number {
    const achat = article.prixAchat ?? 0
    if (article.pvMethode === "pourcentage") return achat * (1 + (article.pvValeur ?? 0) / 100)
    if (article.pvMethode === "montant") return achat + (article.pvValeur ?? 0)
    return article.pvValeur ?? 0
  },
  updateBonLivraison(id: string, patch: Partial<BonLivraison>) {
    const all = this.getBonsLivraison()
    const idx = all.findIndex(b => b.id === id)
    if (idx >= 0) { all[idx] = { ...all[idx], ...patch }; this.saveBonsLivraison(all) }
  },

  // ── Pricing ──────────────────────────────────────────────────────────────
  getPriceEntries(): PriceEntry[] { return [] },
  addPriceEntry(_: any) {},
  updatePriceEntry(_: any) {},
  deletePriceEntry(_id: string) {},

  // ── Workflow config ──────────────────────────────────────────────────────
  getWorkflowConfig(): WorkflowConfig { return { validationCommande: "approval", steps: DEFAULT_WORKFLOW_STEPS } },

  // ── Générateurs d'identifiants ───────────────────────────────────────────
  genId(): string { return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
  genBL(): string { return `BL-${Date.now()}` },
  genCommande(): string { return `CMD-${Date.now()}` },
  today(): string { return new Date().toISOString().slice(0, 10) },
}

export function getUserInterface(user: User): "mobile" | "backoffice" | "client" | "both" {
  return user.interface
}

// ════════════════════════════════════════════════════════════════════════════
// HELPERS — used by BackOfficeLayout and other components
// ════════════════════════════════════════════════════════════════════════════

export const JAWAD_ID = "u-master"

export function isSuperSuperAdmin(user: { role: string }): boolean {
  return user.role === "master_admin" || user.role === "super_super_admin"
}

export function isDemoUser(user: User | null): boolean {
  if (!user) return false
  // No demo accounts in this project — always false
  return false
}

export const ROLE_COLORS: Record<UserRole, string> = {
  master_admin:         "bg-yellow-500",
  super_admin:          "bg-violet-600",
  directeur_general:    "bg-indigo-700",
  directeur_commercial: "bg-blue-700",
  directeur_achat:      "bg-lime-700",
  directeur_logistique: "bg-orange-700",
  directeur_financier:  "bg-purple-700",
  directeur_rh:         "bg-fuchsia-700",
  directeur_it:         "bg-indigo-800",
  resp_commercial:      "bg-blue-600",
  resp_achat:           "bg-lime-600",
  resp_logistique:      "bg-orange-600",
  resp_stock:           "bg-amber-600",
  resp_rh:              "bg-fuchsia-600",
  resp_it:              "bg-indigo-600",
  resp_qualite:         "bg-red-600",
  cash_man:             "bg-emerald-600",
  financier:            "bg-purple-600",
  comptable:            "bg-indigo-600",
  acheteur:             "bg-lime-600",
  prevendeur:           "bg-green-600",
  commercial:           "bg-cyan-600",
  livreur:              "bg-yellow-600",
  chauffeur:            "bg-yellow-700",
  dispatcheur:          "bg-rose-600",
  magasinier:           "bg-amber-600",
  ctrl_achat:           "bg-sky-700",
  ctrl_prep:            "bg-violet-700",
  ctrl_retour:          "bg-rose-700",
  fournisseur:          "bg-slate-600",
  client:               "bg-teal-600",
  admin:                "bg-violet-600",
  team_leader:          "bg-blue-600",
  super_super_admin:    "bg-yellow-700",
  rh_manager:           "bg-pink-600",
}

// ════════════════════════════════════════════════════════════════════════════
// LOOKUP DICTIONARIES — referenced by BackOffice components
// ════════════════════════════════════════════════════════════════════════════

export type ModalitePaiement = "cash" | "cheque" | "virement" | "traite_30" | "traite_60" | "traite_90" | "credit_7" | "credit_15" | "credit_30"

export const MODALITE_LABELS: Record<ModalitePaiement, string> = {
  cash:      "Cash / نقدا",
  cheque:    "Chèque",
  virement:  "Virement bancaire",
  traite_30: "Traite 30j",
  traite_60: "Traite 60j",
  traite_90: "Traite 90j",
  credit_7:  "Crédit 7j",
  credit_15: "Crédit 15j",
  credit_30: "Crédit 30j",
}

export type DelaiRecouvrement = "jour_meme" | "24h" | "48h" | "1_semaine" | "1_mois" | "a_definir"

export const DELAI_RECOUVREMENT_LABELS: Record<DelaiRecouvrement, string> = {
  jour_meme:  "La journée même",
  "24h":      "24 heures",
  "48h":      "48 heures",
  "1_semaine":"1 semaine",
  "1_mois":   "1 mois",
  a_definir:  "À définir",
}

export const FAMILLES_ARTICLES: string[] = [
  "Légumes feuilles", "Légumes racines", "Légumes fruits",
  "Agrumes", "Fruits tropicaux", "Fruits rouges",
  "Herbes aromatiques", "Champignons", "Fruits secs", "Autre",
]

export const SPECIALITES_FRUITS_LEGUMES: string[] = [
  "Légumes feuilles", "Légumes racines", "Légumes fruits", "Agrumes",
  "Fruits tropicaux", "Fruits rouges", "Herbes aromatiques", "Champignons",
  "Primeurs", "Fruits secs", "Dattes", "Olives & huile d'olive",
  "Céréales & légumineuses", "Épices & condiments", "Fleurs comestibles",
  "Pommes", "Poires", "Raisins", "Melons & pastèques", "Pêches & abricots",
  "Figues", "Grenades", "Clémentines", "Citrons", "Pamplemousses",
  "Tomates cerises", "Concombres", "Aubergines", "Artichauds", "Brocolis",
  "Choux-fleurs", "Épinards", "Poireaux", "Céleri", "Persil & coriandre",
  "Avocat", "Mangue", "Ananas", "Kiwi", "Fraises", "Framboises", "Myrtilles",
]

export const CATEGORIE_CHARGE_LABELS: Record<string, string> = {
  transport:     "Transport (Honda, chario, véhicule)",
  equipement:    "Equipement (balance, caisses, frigo)",
  salaire:       "Salaires & charges sociales",
  loyer:         "Loyer & charges locatives",
  energie:       "Eau, Electricité, Gaz",
  maintenance:   "Maintenance & réparations",
  communication: "Communication & internet",
  assurance:     "Assurance",
  impots:        "Impôts & taxes",
  autre:         "Autres charges",
}

export const STATUT_SALARIE_LABELS: Record<string, string> = {
  actif:         "Actif",
  conge:         "En congé",
  periode_essai: "Période d'essai",
  inactif:       "Inactif",
}

export const TYPE_CONTRAT_LABELS: Record<string, string> = {
  cdi:        "CDI — Contrat à Durée Indéterminée",
  cdd:        "CDD — Contrat à Durée Déterminée",
  interim:    "Intérim",
  saisonnier: "Contrat Saisonnier",
}

export const TRIP_CHARGE_TYPE_LABELS: Record<string, string> = {
  carburant:    "Carburant",
  peage:        "Péage",
  reparation:   "Réparation",
  chargement:   "Chargement",
  dechargement: "Déchargement",
  parking:      "Parking",
  autre:        "Autre",
}

export const MOTIF_RETOUR_LABELS: Record<string, string> = {
  pas_notre_variete: "Pas notre variété",
  produit_pourri:    "Produit pourri / avarié",
  trop_vieux:        "Trop vieux / dépassé",
  endommage:         "Endommagé (transport)",
  autre:             "Autre motif",
}

export const DEFAULT_CAISSE_PRICING = {
  prixGrosseCaisse: 70,
  prixDemiCaisse:   50,
}

export const DEFAULT_FRAIS_BL = {
  fraisImpressionParFeuille: 0,
  nbFeuilles:                1,
  fraisServiceParCaisse:     0,
}

export const DEFAULT_DEPOT = {
  id:   "DEPOT_PRINCIPAL",
  nom:  "Dépôt Principal",
  actif: true,
}

export const DEFAULT_CONTENANTS_TARE: ContenantTare[] = [
  { id: "caisse-grosse", nom: "Grosse caisse", poidsKg: 2.5, actif: true },
  { id: "caisse-demi",   nom: "Demi caisse",   poidsKg: 1.5, actif: true },
]

export const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  { id: "order_placement", label: "Prise de Commande",          labelAr: "استلام الطلب",          enabled: true,  mandatory: true,  canBypass: false },
  { id: "procurement",     label: "Achat Marché de Gros",       labelAr: "الشراء من سوق الجملة",  enabled: true,  mandatory: true,  canBypass: false },
  { id: "market_qc",       label: "Contrôle Qualité Marché",    labelAr: "مراقبة الجودة",         enabled: true,  mandatory: false, canBypass: true,  bypassed: false, gate: true },
  { id: "transfer",        label: "Transfert vers Entrepôt",    labelAr: "النقل إلى المستودع",    enabled: true,  mandatory: false, canBypass: false },
  { id: "receiving",       label: "Réception & Tri Entrepôt",   labelAr: "الاستلام والفرز",       enabled: true,  mandatory: true,  canBypass: false },
  { id: "preparation",     label: "Préparation Commandes",      labelAr: "تحضير الطلبات",         enabled: true,  mandatory: true,  canBypass: false },
  { id: "dispatch",        label: "Dispatch & Chargement",      labelAr: "التوزيع والتحميل",      enabled: true,  mandatory: true,  canBypass: false },
  { id: "delivery",        label: "Livraison Client",           labelAr: "التوصيل للعميل",        enabled: true,  mandatory: true,  canBypass: false },
  { id: "invoicing",       label: "Facturation & Recouvrement", labelAr: "الفوترة والتحصيل",      enabled: true,  mandatory: true,  canBypass: false },
]