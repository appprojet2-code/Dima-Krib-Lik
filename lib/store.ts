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

  getCompanyConfig() {
    return {
      appName:   "FreshLink Pro",
      appSlogan: "Distribution & IA",
      logo:      "/empire-fresh-logo.png",
      nom:       "Empire Fresh",
    }
  },

  // ── Login helpers ─────────────────────────────────────────────────────────

  loginGetForcedView(email: string, password: string): "mobile" | "backoffice" | null {
    const user = this.login(email, password)
    if (!user) return null
    const iface = getUserInterface(user)
    return iface === "both" ? null : (iface as "mobile" | "backoffice" | null)
  },

  // ── Données (placeholders) ────────────────────────────────────────────────
  getClients()            { return [] },
  saveClients(_: any)     {},
  getArticles()           { return [] },
  saveArticles(_: any)    {},
  getFournisseurs()       { return [] },
  saveFournisseurs(_: any){},
  getCommandes()          { return [] },
  saveCommandes(_: any)   {},
  getBonsLivraison()      { return [] },
  saveBonsLivraison(_: any){},
  getPurchaseOrders()     { return [] },
  savePurchaseOrders(_: any){},
  getReceptions()         { return [] },
  saveReceptions(_: any)  {},
  getTrips()              { return [] },
  saveTrips(_: any)       {},
}

export function getUserInterface(user: User): "mobile" | "backoffice" | "client" | "both" {
  return user.interface
}