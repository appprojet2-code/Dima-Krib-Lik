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
}

// ════════════════════════════════════════════════════════════════════════════
// UTILISATEURS PAR DÉFAUT
// RÈGLE : Seul Jawad (master_admin) est dans Supabase.
//         Tous les autres comptes restent en localStorage local.
// ════════════════════════════════════════════════════════════════════════════

const DEFAULT_USERS: User[] = [
  // ─── 👑 MASTER ADMIN ─────────────────────────────────────────────────────
  {
    id:        "u-master",
    name:      "Jawad",
    email:     "jawad@dimakriblik.ma",
    username:  "jawad",
    password:  "Medghaly@22",
    role:      "master_admin",
    type:      "interne",
    interface: "backoffice",
    telephone: "0660671709",
  },

  // ─── DIRECTION ───────────────────────────────────────────────────────────
  { id: "u-001", name: "Admin FreshLink",      email: "admin@freshlink.ma",       username: "admin",      password: "admin2024",  role: "super_admin",          type: "interne", interface: "backoffice" },
  { id: "u-002", name: "Directeur Général",    email: "dg@freshlink.ma",           username: "dg",         password: "dg2024",     role: "directeur_general",    type: "interne", interface: "backoffice" },
  { id: "u-003", name: "Directeur Commercial", email: "dc@freshlink.ma",           username: "dc",         password: "dc2024",     role: "directeur_commercial", type: "interne", interface: "backoffice" },
  { id: "u-004", name: "Directeur Achat",      email: "da@freshlink.ma",           username: "da",         password: "da2024",     role: "directeur_achat",      type: "interne", interface: "backoffice" },
  { id: "u-005", name: "Directeur Logistique", email: "dl@freshlink.ma",           username: "dl",         password: "dl2024",     role: "directeur_logistique", type: "interne", interface: "backoffice" },
  { id: "u-006", name: "Directeur Financier",  email: "df@freshlink.ma",           username: "df",         password: "df2024",     role: "directeur_financier",  type: "interne", interface: "backoffice" },
  { id: "u-007", name: "Directeur RH",         email: "drh@freshlink.ma",          username: "drh",        password: "drh2024",    role: "directeur_rh",         type: "interne", interface: "backoffice" },
  { id: "u-008", name: "Directeur IT",         email: "dit@freshlink.ma",          username: "dit",        password: "it2024",     role: "directeur_it",         type: "interne", interface: "backoffice" },

  // ─── RESPONSABLES ────────────────────────────────────────────────────────
  { id: "u-009", name: "Resp. Commercial",  email: "responsable@freshlink.ma",  username: "resp-com",   password: "1234",       role: "resp_commercial",  type: "interne", interface: "both"       },
  { id: "u-010", name: "Resp. Achat",       email: "resp.achat@freshlink.ma",   username: "resp-achat", password: "rach2024",   role: "resp_achat",       type: "interne", interface: "backoffice" },
  { id: "u-011", name: "Resp. Logistique",  email: "logistique@freshlink.ma",   username: "resp-log",   password: "1234",       role: "resp_logistique",  type: "interne", interface: "backoffice" },
  { id: "u-012", name: "Resp. Stock",       email: "resp.stock@freshlink.ma",   username: "resp-stock", password: "stock2024",  role: "resp_stock",       type: "interne", interface: "backoffice" },
  { id: "u-013", name: "Resp. RH",          email: "resp.rh@freshlink.ma",      username: "resp-rh",    password: "rh2024",     role: "resp_rh",          type: "interne", interface: "backoffice" },
  { id: "u-014", name: "Resp. IT",          email: "resp.it@freshlink.ma",      username: "resp-it",    password: "it1234",     role: "resp_it",          type: "interne", interface: "backoffice" },
  { id: "u-015", name: "Resp. Qualité",     email: "resp.qualite@freshlink.ma", username: "resp-qual",  password: "qual2024",   role: "resp_qualite",     type: "interne", interface: "backoffice" },

  // ─── FINANCE ─────────────────────────────────────────────────────────────
  { id: "u-016", name: "Cash Manager", email: "cashman@freshlink.ma",    username: "cash", password: "cash2024", role: "cash_man",  type: "interne", interface: "backoffice" },
  { id: "u-017", name: "Financier",    email: "financier@freshlink.ma",  username: "fin",  password: "fin2024",  role: "financier", type: "interne", interface: "backoffice" },
  { id: "u-018", name: "Comptable",    email: "comptable@freshlink.ma",  username: "cpt",  password: "cpt2024",  role: "comptable", type: "interne", interface: "backoffice" },

  // ─── OPÉRATIONS ──────────────────────────────────────────────────────────
  { id: "u-019", name: "Acheteur",               email: "acheteur@freshlink.ma",   username: "achat",      password: "1234",       role: "acheteur",   type: "interne", interface: "both"       },
  { id: "u-020", name: "Pré-vendeur",            email: "prevendeur@freshlink.ma", username: "prevelend",  password: "1234",       role: "prevendeur", type: "interne", interface: "mobile"     },
  { id: "u-021", name: "Commercial Terrain",     email: "commercial@freshlink.ma", username: "com",        password: "com2024",    role: "commercial", type: "interne", interface: "mobile"     },
  { id: "u-022", name: "Livreur",                email: "livreur@freshlink.ma",    username: "livr",       password: "1234",       role: "livreur",    type: "interne", interface: "mobile"     },
  { id: "u-023", name: "Chauffeur",              email: "chauffeur@freshlink.ma",  username: "chauf",      password: "chauf2024",  role: "chauffeur",  type: "interne", interface: "mobile"     },
  { id: "u-024", name: "Dispatcheur",            email: "dispatch@freshlink.ma",   username: "disp",       password: "1234",       role: "dispatcheur",type: "interne", interface: "backoffice" },
  { id: "u-025", name: "Magasinier",             email: "magasin@freshlink.ma",    username: "mag",        password: "1234",       role: "magasinier", type: "interne", interface: "backoffice" },
  { id: "u-026", name: "Contrôleur Achat",       email: "ctrl.achat@freshlink.ma", username: "ctrl-achat", password: "ctrl1234",   role: "ctrl_achat", type: "interne", interface: "backoffice" },
  { id: "u-027", name: "Contrôleur Préparation", email: "ctrl.prep@freshlink.ma",  username: "ctrl-prep",  password: "ctrl1234",   role: "ctrl_prep",  type: "interne", interface: "backoffice" },
  { id: "u-028", name: "Contrôleur Retour",      email: "ctrl.retour@freshlink.ma",username: "ctrl-retour",password: "cret2024",   role: "ctrl_retour",type: "interne", interface: "backoffice" },

  // ─── EXTERNES — CLIENTS ───────────────────────────────────────────────────
  { id: "c-001", name: "Restaurant Al Baraka", email: "albaraka@demo.ma", username: "albaraka", password: "client123", role: "client",      type: "externe", interface: "client" },
  { id: "c-002", name: "Superette Nour",       email: "nour@demo.ma",     username: "nour",     password: "nour2024",  role: "client",      type: "externe", interface: "client" },
  { id: "c-003", name: "Épicerie Al Amal",     email: "amal@demo.ma",     username: "amal",     password: "amal2024",  role: "client",      type: "externe", interface: "client" },

  // ─── EXTERNES — FOURNISSEURS ──────────────────────────────────────────────
  { id: "f-001", name: "Ferme Souss Agri",     email: "souss@demo.ma",  username: "souss",  password: "fourn2024", role: "fournisseur", type: "externe", interface: "client" },
  { id: "f-002", name: "Coopérative Meknès",   email: "meknes@demo.ma", username: "meknes", password: "fourn2024", role: "fournisseur", type: "externe", interface: "client" },
  { id: "f-003", name: "Coopérative Gharb",    email: "gharb@demo.ma",  username: "gharb",  password: "fourn2024", role: "fournisseur", type: "externe", interface: "client" },
]

const USERS_KEY    = "fl_users"
const SESSIONS_KEY = "fl_sessions"
const COMPANY_CONFIG_KEY = "fl_company_config"

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
  contact: string
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
  prixAchat: number
  pvMethode: "pourcentage" | "montant" | "manuel"
  pvValeur: number
  photo?: string
  actif?: boolean
  catalogueVisible?: boolean
  shelfLifeJours?: number
  historiquePrixAchat?: HistoriquePrixAchat[]
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
}

export interface CaisseVide {
  id: string
  libelle: string
  type: "gros" | "demi"
  capaciteKg: number
  stock: number
  enCirculation: number
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
  lignes: { articleId?: string; articleNom: string; quantite: number; total: number }[]
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

export interface WorkflowConfig {
  validationCommande: "direct" | "approval" | string
  [key: string]: any
}

export interface EmailConfig {
  achat: string
  commercial: string
  [key: string]: string
}

export interface Depot {
  id: string
  nom: string
  actif?: boolean
  [key: string]: any
}

export interface CompanyConfig {
  appName?: string
  appSlogan?: string
  logo?: string
  nom?: string
  couleurEntete?: string
  adresse?: string
  ville?: string
  telephone?: string
  email?: string
  siteWeb?: string
  ice?: string
  rc?: string
  if_fiscal?: string
  tp?: string
  cnss?: string
  mentionsBL?: string
  mentionsFacture?: string
}

const DEFAULT_COMPANY_CONFIG: CompanyConfig = {
  appName:   "Dima Krib Lik",
  appSlogan: "Powered by Vita Tech",
  logo:      "/empire-fresh-logo.png",
  nom:       "Dima Krib Lik",
}

// Types Logistique/RH minimalistes — hors périmètre Achat/Réception/Commandes/Facturation,
// déclarés juste pour satisfaire la compilation partagée de lib/supabase/db.ts
export interface Trip { id: string; [key: string]: any }
export interface Retour { id: string; [key: string]: any }
export interface BonPreparation { id: string; [key: string]: any }
export interface TransfertStock { id: string; [key: string]: any }
export interface Livreur { id: string; [key: string]: any }
export interface MotifRetour { id: string; [key: string]: any }
export interface Message { id: string; [key: string]: any }
export interface Notice { id: string; [key: string]: any }

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
      // Fusion : garantit que les DEFAULT_USERS manquants sont toujours présents
      const ids = new Set(saved.map(u => u.id))
      const merged = [
        ...saved,
        ...DEFAULT_USERS.filter(u => !ids.has(u.id)),
      ]
      return merged
    } catch {
      return [...DEFAULT_USERS]
    }
  },

  saveUsers(users: User[]) {
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
    try {
      const raw = localStorage.getItem(COMPANY_CONFIG_KEY)
      if (!raw) return { ...DEFAULT_COMPANY_CONFIG }
      return { ...DEFAULT_COMPANY_CONFIG, ...JSON.parse(raw) }
    } catch {
      return { ...DEFAULT_COMPANY_CONFIG }
    }
  },

  saveCompanyConfig(cfg: CompanyConfig) {
    localStorage.setItem(COMPANY_CONFIG_KEY, JSON.stringify(cfg))
  },

  // ── Login helpers ─────────────────────────────────────────────────────────

  loginGetForcedView(email: string, password: string): "mobile" | "backoffice" | null {
    const user = this.login(email, password)
    if (!user) return null
    const iface = getUserInterface(user)
    return iface === "both" ? null : (iface as "mobile" | "backoffice" | null)
  },

  // ── Données (placeholders) ────────────────────────────────────────────────
  getClients(): Client[]            { return [] },
  saveClients(_: any)     {},
  getArticles(): Article[]           { return [] },
  saveArticles(_: any)    {},
  getFournisseurs(): Fournisseur[]       { return [] },
  saveFournisseurs(_: any){},
  getCommandes(): Commande[]          { return [] },
  saveCommandes(_: any)   {},
  getBonsLivraison(): BonLivraison[]      { return [] },
  saveBonsLivraison(_: any){},
  getPurchaseOrders(): PurchaseOrder[]     { return [] },
  savePurchaseOrders(_: any){},
  getReceptions(): Reception[]         { return [] },
  saveReceptions(_: any)  {},
  getTrips(): Trip[]              { return [] },
  saveTrips(_: any)       {},
  getVisites(): Visite[]            { return [] },
  saveVisites(_: any)     {},
  getRetours(): Retour[]            { return [] },
  saveRetours(_: any)     {},
  getBonsAchat(): BonAchat[]          { return [] },
  saveBonsAchat(_: any)   {},
  getBonsPreparation(): BonPreparation[]    { return [] },
  saveBonsPreparation(_: any){},
  getTransferts(): TransfertStock[]         { return [] },
  saveTransferts(_: any)  {},
  getLivreurs(): Livreur[]           { return [] },
  saveLivreurs(_: any)    {},
  getMotifs(): MotifRetour[]             { return [] },
  saveMotifs(_: any)      {},
  getMessages(): Message[]           { return [] },
  saveMessages(_: any)    {},
  getNotices(): Notice[]            { return [] },
  saveNotices(_: any)     {},

  // ── Achat / Fournisseurs ───────────────────────────────────────────────────
  addFournisseur(_: any) {},
  updateFournisseur(_id: string, _patch: any) {},
  deleteFournisseur(_id: string) {},
  addBonAchat(_: any) {},
  updateBonAchat(_id: string, _patch: any) {},
  addHistoriquePrixAchat(_articleId: string, _entry: any) {},
  getEmailConfig(): EmailConfig { return { achat: "", commercial: "" } },
  saveEmailConfig(_: any) {},
  getDemandesAchat(): DemandeAchat[] { return [] },
  updateDemandeAchat(_id: string, _patch: any) {},
  getPendingPOsForAcheteur(): PurchaseOrder[] { return [] },
  refuserPO(_poId: string, _userId: string, _userName: string, _motif: string): DemandeAchat | null { return null },
  autoGeneratePOsFromBesoin(): PurchaseOrder[] { return [] },
  computeBesoinNet(): BesoinNetEntry[] { return [] },
  getDepots() { return [DEFAULT_DEPOT] },
  getContenantsConfig(): ContenantTare[] { return [] },
  getCaissesVides(): CaisseVide[] { return [] },
  updateCaisseVide(_id: string, _patch: any) {},
  sortieCaissesVides(_id: string, _nb: number) {},
  retourCaissesVides(_id: string, _nb: number) {},
  addCaisseMouvement(_: any) {},

  // ── Purchase Orders ──────────────────────────────────────────────────────
  addPurchaseOrder(_: any) {},
  updatePurchaseOrder(_id: string, _patch: any) {},

  // ── Réception ────────────────────────────────────────────────────────────
  addReception(_: any) {},
  getVirtualStock(_articleId: string): VirtualStock { return { physical: 0, available: 0, pending: 0 } },
  updateStock(_articleId: string, _qty: number, _isDefect?: boolean) {},

  // ── Commandes / Clients ──────────────────────────────────────────────────
  addClient(_: any) {},
  addCommande(_: any) {},
  deleteCommande(_id: string) {},
  addVisite(_: any) {},
  computePV(_article: Article): number { return 0 },
  updateBonLivraison(_id: string, _patch: any) {},

  // ── Pricing ──────────────────────────────────────────────────────────────
  getPriceEntries(): PriceEntry[] { return [] },
  addPriceEntry(_: any) {},
  updatePriceEntry(_: any) {},
  deletePriceEntry(_id: string) {},

  // ── Workflow config ──────────────────────────────────────────────────────
  getWorkflowConfig(): WorkflowConfig { return { validationCommande: "approval" } },

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

export const DEFAULT_WORKFLOW_STEPS: {
  id: string; label: string; labelAr?: string; description?: string;
  enabled: boolean; mandatory: boolean; canBypass: boolean; bypassed?: boolean; gate?: boolean
}[] = [
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