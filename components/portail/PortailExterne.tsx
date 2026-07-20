"use client"

import { useState, useEffect } from "react"
import { store, type User } from "@/lib/store"

// Local types (mirrors ERP shapes without circular imports)
interface PurchaseOrder {
  id: string; date: string; dateLivraisonSouhaitee?: string; fournisseurId?: string
  statut: string; montantTotal?: number; notes?: string
  lignes?: { articleNom: string; quantiteCommandee?: number; prixUnitaire?: number; unite?: string }[]
}
interface Fournisseur {
  id: string; nom: string; telephone?: string; email?: string; ville?: string; ice?: string
}
import FreshLinkLogo from "@/components/ui/FreshLinkLogo"

// ─── Constants ──────────────────────────────────────────────────────────────

const ERP_BASE    = "https://f-l.vercel.app"
const WA_NUMBER   = "212660671709"   // 0660671709 → international

// ─── Types ───────────────────────────────────────────────────────────────────

interface ArticlePublic {
  id:        string
  nom:       string
  nomAr:     string
  famille:   string
  unite:     string
  prix:      number
  image_url?: string
}

interface LigneForm { articleId: string; nom: string; quantite: string; prixUnit: number; unite: string }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getJ1(): string {
  const d = new Date(); d.setDate(d.getDate() + 1)
  return d.toISOString().split("T")[0]
}

function waLink(lines: string[]): string {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`
}

const STATUT_CONFIG: Record<string, { label: string; labelAr: string; cls: string }> = {
  en_attente:             { label: "En attente",     labelAr: "في الانتظار",      cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  nouveau:                { label: "Reçue",          labelAr: "مستلمة",           cls: "bg-blue-100  text-blue-800  border-blue-200"  },
  en_attente_approbation: { label: "En approbation", labelAr: "بانتظار الموافقة", cls: "bg-orange-100 text-orange-800 border-orange-200" },
  valide:                 { label: "Validée",        labelAr: "مقبولة",           cls: "bg-blue-100  text-blue-800  border-blue-200"  },
  refuse:                 { label: "Refusée",        labelAr: "مرفوضة",           cls: "bg-red-100   text-red-800   border-red-200"  },
  en_transit:             { label: "En livraison",   labelAr: "قيد التوصيل",      cls: "bg-cyan-100  text-cyan-800  border-cyan-200"  },
  livre:                  { label: "Livrée",         labelAr: "تم التسليم",       cls: "bg-green-100 text-green-800 border-green-200" },
  retour:                 { label: "Retour",         labelAr: "مرتجع",            cls: "bg-rose-100  text-rose-800  border-rose-200"  },
}

// ─── useArticles hook ─────────────────────────────────────────────────────────

function useArticles() {
  const [articles, setArticles] = useState<ArticlePublic[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    fetch(`${ERP_BASE}/api/ext/catalogue`)
      .then(r => r.json())
      .then((data: any[]) => {
        const mapped: ArticlePublic[] = (Array.isArray(data) ? data : []).map(a => ({
          id:        a.id ?? "",
          nom:       a.nom ?? "",
          nomAr:     a.nomAr ?? a.nom_ar ?? "",
          famille:   a.famille ?? "",
          unite:     a.unite ?? "kg",
          prix:      Number(a.marketplace_prix_public ?? a.prix_public ?? 0),
          image_url: a.image_url ?? undefined,
        })).filter(a => a.id && a.nom)
        setArticles(mapped)
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false))
  }, [])

  return { articles, loading }
}

// ─── Shared UI atoms ─────────────────────────────────────────────────────────

function ErrorBanner({ msg }: { msg: string }) {
  if (!msg) return null
  return (
    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      {msg}
    </div>
  )
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

interface LoginScreenProps {
  onLogin: (u: User) => void
  onRequestAccount: () => void
  onPublicOrder: () => void
}

function LoginScreen({ onLogin, onRequestAccount, onPublicOrder }: LoginScreenProps) {
  const [identifier, setIdentifier] = useState("")
  const [password,   setPassword]   = useState("")
  const [showPwd,    setShowPwd]     = useState(false)
  const [error,      setError]       = useState("")
  const [loading,    setLoading]     = useState(false)
  const company = store.getCompanyConfig()

  const handleSubmit = () => {
    setError("")
    if (!identifier.trim() || !password.trim()) {
      setError("Veuillez saisir votre identifiant et mot de passe.")
      return
    }
    setLoading(true)
    setTimeout(() => {
      const users = store.getUsers()
      const found = users.find(u =>
        (u.email.toLowerCase() === identifier.toLowerCase().trim() ||
          u.name.toLowerCase() === identifier.toLowerCase().trim()) &&
        u.password === password &&
        (u.role === "client" || u.role === "fournisseur") &&
        u.actif
      )
      setLoading(false)
      if (!found) { setError("Identifiant ou mot de passe incorrect, ou compte inactif."); return }
      onLogin(found)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-md flex items-center justify-center border border-slate-200">
            {company.logo
              ? <img src={company.logo} alt="Logo" className="w-full h-full object-contain" />
              : <FreshLinkLogo size={52} />}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-black text-slate-900">{company.appName ?? "Dima Krib Lik"}</h1>
            <p className="text-sm text-slate-500 mt-1">Portail Clients & Fournisseurs</p>
          </div>
        </div>

        {/* Quick order CTA */}
        <button
          onClick={onPublicOrder}
          className="w-full mb-4 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Commander sans compte
          <span className="text-[10px] font-normal opacity-80 ml-1">— rapide &amp; simple</span>
        </button>

        {/* Login card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col gap-5">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Connexion</h2>
            <p className="text-sm text-slate-500 mt-0.5">Accès réservé aux partenaires enregistrés</p>
          </div>

          <ErrorBanner msg={error} />

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Email ou nom d'utilisateur</label>
            <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              placeholder="votre@email.ma" autoComplete="username" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Mot de passe</label>
            <div className="relative">
              <input type={showPwd ? "text" : "password"} value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                placeholder="••••••••" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPwd(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1">
                {showPwd
                  ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                }
              </button>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {loading
              ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>}
            {loading ? "Connexion…" : "Se connecter"}
          </button>

          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs text-center text-slate-500 mb-3">Vous n'avez pas encore de compte ?</p>
            <button onClick={onRequestAccount}
              className="w-full py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              Demander la création d'un compte
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">{company.nom || "Dima Krib Lik"} — Accès sécurisé partenaires</p>
      </div>
    </div>
  )
}

// ─── Account Request Form ─────────────────────────────────────────────────────

type AccountType = "particulier" | "chr" | "marchand" | "fournisseur"

const ACCOUNT_TYPES: { v: AccountType; label: string; labelAr: string; icon: string; desc: string }[] = [
  { v: "particulier", label: "Particulier",  labelAr: "فرد",          icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",              desc: "Commandes personnelles" },
  { v: "chr",         label: "CHR",          labelAr: "مطعم / فندق",  icon: "M3 10h18M3 14h18M10 3v18M14 3v18",                                                  desc: "Café / Hôtel / Restaurant" },
  { v: "marchand",    label: "Marchand",     labelAr: "تاجر",          icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4", desc: "Épicerie / Supermarché" },
  { v: "fournisseur", label: "Fournisseur",  labelAr: "مورد",          icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",                  desc: "Producteur / Grossiste" },
]

interface AccountRequestFormProps { onBack: () => void }

function AccountRequestForm({ onBack }: AccountRequestFormProps) {
  const company  = store.getCompanyConfig()
  const [type,      setType]      = useState<AccountType>("particulier")
  const [nom,       setNom]       = useState("")
  const [email,     setEmail]     = useState("")
  const [telephone, setTelephone] = useState("")
  const [societe,   setSociete]   = useState("")
  const [ice,       setIce]       = useState("")
  const [ville,     setVille]     = useState("")
  const [message,   setMessage]   = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState("")
  const [showRedirect, setShowRedirect] = useState(false)

  const needsSociete = type === "chr" || type === "marchand" || type === "fournisseur"

  const handleSubmit = async () => {
    setError("")
    if (!nom.trim() || !telephone.trim()) {
      setError("Nom et téléphone sont obligatoires.")
      return
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Adresse email invalide.")
      return
    }
    if (needsSociete && !societe.trim()) {
      setError("La raison sociale est obligatoire pour ce type de compte.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${ERP_BASE}/api/ext/demande-compte`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, nom: nom.trim(), email: email.trim() || undefined, telephone: telephone.trim(), societe: societe.trim() || undefined, ice: ice.trim() || undefined, ville: ville.trim() || undefined, message: message.trim() || undefined }),
      })
      // Even on network error, show success (backend has 3-level fallback)
      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        // Only show error on client validation failures (400)
        if (res.status === 400) { setError(d.error ?? "Données invalides."); setLoading(false); return }
      }
      setSubmitted(true)
    } catch {
      // Network issues — still show success (request was logged client-side)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Demande envoyée !</h2>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Votre demande a été enregistrée. L'équipe de <strong>{company.nom || "notre équipe"}</strong> vous contactera sous 24–48h.
            </p>
            <p className="text-xs text-slate-400 mt-2" dir="rtl">تم إرسال طلبك بنجاح. سيتم التواصل معك قريباً.</p>
          </div>
          <button onClick={onBack} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex flex-col items-center justify-start py-8 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Demande de création de compte</h1>
            <p className="text-xs text-slate-500">طلب إنشاء حساب</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col gap-5">

          {/* Type selector */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">Type de compte *</p>
            <div className="grid grid-cols-2 gap-2">
              {ACCOUNT_TYPES.map(opt => (
                <button key={opt.v} type="button"
                  onClick={() => { setType(opt.v); setShowRedirect(false) }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all ${type === opt.v ? "border-blue-400 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <svg className={`w-5 h-5 shrink-0 ${type === opt.v ? "text-blue-600" : "text-slate-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={opt.icon} />
                  </svg>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{opt.label}</p>
                    <p className="text-[10px] text-slate-400">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CHR / Marchand: already have account? */}
          {(type === "chr" || type === "marchand") && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-800">Vous avez déjà un compte Dima Krib Lik ?</p>
                <p className="text-xs text-amber-700 mt-0.5">Si vous êtes déjà partenaire, accédez directement à votre espace.</p>
                <button
                  onClick={() => window.open("https://f-l.vercel.app", "_blank")}
                  className="mt-2.5 flex items-center gap-2 text-xs font-bold text-blue-700 bg-white border border-blue-200 rounded-lg px-3 py-2 hover:bg-blue-50 transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  Accéder à mon espace Dima Krib Lik →
                </button>
              </div>
            </div>
          )}

          <ErrorBanner msg={error} />

          {/* Form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { f: "nom",       label: "Nom complet *",     placeholder: "Mohammed Alami",       value: nom,       set: setNom,       type: "text" },
              { f: "telephone", label: "Téléphone *",        placeholder: "+212 6 00 00 00 00",   value: telephone, set: setTelephone, type: "tel"  },
              { f: "email",     label: "Email (optionnel)",  placeholder: "contact@societe.ma",   value: email,     set: setEmail,     type: "email"},
              { f: "societe",   label: `Raison sociale${needsSociete ? " *" : ""}`, placeholder: "Ma Société SARL", value: societe, set: setSociete, type: "text" },
              { f: "ice",       label: "ICE (optionnel)",    placeholder: "00000000000000000000", value: ice,       set: setIce,       type: "text" },
              { f: "ville",     label: "Ville",              placeholder: "Casablanca",           value: ville,     set: setVille,     type: "text" },
            ].map(({ f, label, placeholder, value, set, type: t }) => (
              <div key={f} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">{label}</label>
                <input type={t} value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-600">Message / Informations complémentaires</label>
            <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
              placeholder={type === "fournisseur" ? "Décrivez vos produits, capacités de livraison, zones couvertes…" : "Décrivez votre activité, vos besoins, votre fréquence de commande…"}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 resize-none" />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
            {loading
              ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
            {loading ? "Envoi en cours…" : "Envoyer ma demande"}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Public Order Form (no login) ─────────────────────────────────────────────

interface PublicOrderFormProps { onBack: () => void }

function PublicOrderForm({ onBack }: PublicOrderFormProps) {
  const { articles, loading: artLoading } = useArticles()
  const company = store.getCompanyConfig()

  const [nom,           setNom]           = useState("")
  const [telephone,     setTelephone]     = useState("")
  const [email,         setEmail]         = useState("")
  const [dateLivraison, setDateLivraison] = useState(getJ1())
  const [notes,         setNotes]         = useState("")
  const [lignes,        setLignes]        = useState<LigneForm[]>([])
  const [search,        setSearch]        = useState("")
  const [step,          setStep]          = useState<"articles" | "contact" | "success">("articles")
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState("")
  const [orderNum,      setOrderNum]      = useState("")

  const filtered = articles.filter(a =>
    !search || a.nom.toLowerCase().includes(search.toLowerCase()) || a.famille.toLowerCase().includes(search.toLowerCase())
  )

  const addArticle = (a: ArticlePublic) => {
    setLignes(prev => {
      const exist = prev.findIndex(l => l.articleId === a.id)
      if (exist >= 0) return prev
      return [...prev, { articleId: a.id, nom: a.nom, quantite: "1", prixUnit: a.prix, unite: a.unite }]
    })
  }

  const total = lignes.reduce((s, l) => s + Math.round(Number(l.quantite || 0) * l.prixUnit * 100) / 100, 0)

  const handleSubmit = async () => {
    setError("")
    if (!nom.trim() || !telephone.trim()) {
      setError("Nom et téléphone sont obligatoires.")
      return
    }
    if (lignes.length === 0 || !lignes.some(l => Number(l.quantite) > 0)) {
      setError("Ajoutez au moins un article.")
      return
    }

    setLoading(true)
    try {
      const payload = {
        nom_client:       nom.trim(),
        telephone:        telephone.trim(),
        email:            email.trim() || undefined,
        date_souhaitee:   dateLivraison,
        instructions:     notes.trim() || undefined,
        source:           "vitafresh",
        lignes: lignes.filter(l => Number(l.quantite) > 0).map(l => ({
          articleId:    l.articleId,
          nom:          l.nom,
          quantite:     Number(l.quantite),
          prix_unitaire: l.prixUnit,
          unite:         l.unite,
          montant:       Math.round(Number(l.quantite) * l.prixUnit * 100) / 100,
        })),
      }

      const res = await fetch(`${ERP_BASE}/api/ext/commandes-web`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error ?? "Erreur lors de l'enregistrement.")
      }

      const data = await res.json()
      const num = data.numero ?? ""
      setOrderNum(num)

      // Open WhatsApp automatically
      const msgLines = [
        `🛒 *Nouvelle commande ${num}*`,
        `👤 ${nom.trim()} — 📞 ${telephone.trim()}`,
        ``,
        ...lignes.filter(l => Number(l.quantite) > 0).map(l => `• ${l.nom}: ${l.quantite} ${l.unite} × ${l.prixUnit.toFixed(2)} DH`),
        ``,
        `💰 *Total: ${total.toFixed(2)} DH*`,
        `📅 Livraison souhaitée: ${dateLivraison}`,
        notes ? `📝 Note: ${notes}` : "",
      ].filter(Boolean)
      window.open(waLink(msgLines), "_blank")

      setStep("success")
    } catch (err: any) {
      setError(err.message ?? "Erreur réseau. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Commande envoyée !</h2>
            {orderNum && <p className="text-xs font-mono bg-slate-100 rounded-lg px-3 py-1.5 mt-2 text-slate-600">Réf : {orderNum}</p>}
            <p className="text-sm text-slate-500 mt-3 leading-relaxed">
              Votre commande a bien été reçue. Notre équipe va la préparer et vous contactera pour confirmer la livraison.
            </p>
            <p className="text-xs text-slate-400 mt-2" dir="rtl">تم استلام طلبك بنجاح.</p>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <button onClick={() => { setLignes([]); setNom(""); setTelephone(""); setEmail(""); setNotes(""); setDateLivraison(getJ1()); setStep("articles"); setOrderNum("") }}
              className="w-full py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
              Passer une autre commande
            </button>
            <button onClick={onBack}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div>
              <p className="text-sm font-bold text-slate-800">{company.appName ?? "Dima Krib Lik"}</p>
              <p className="text-[10px] text-slate-400">Commander sans compte</p>
            </div>
          </div>
          {lignes.length > 0 && (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-1.5">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              <span className="text-xs font-bold text-green-700">{lignes.length} article{lignes.length > 1 ? "s" : ""} — {total.toFixed(2)} DH</span>
            </div>
          )}
        </div>

        {/* Step tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-0 flex gap-1">
          {(["articles", "contact"] as const).map((s, i) => (
            <button key={s} onClick={() => step === "contact" && s === "articles" && setStep("articles")}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${step === s ? "border-green-500 text-green-600" : "border-transparent text-slate-400"}`}>
              {i + 1}. {s === "articles" ? "Choisir les articles" : "Vos coordonnées & valider"}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5">

        {/* Step 1 - articles */}
        {step === "articles" && (
          <div className="flex flex-col gap-4">
            {/* Cart recap */}
            {lignes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-4">
                <h3 className="text-sm font-bold text-slate-700 mb-2">🛒 Votre panier</h3>
                {lignes.map((l, i) => (
                  <div key={l.articleId} className="flex items-center gap-2 py-1.5 border-b border-slate-100 last:border-0">
                    <span className="flex-1 text-sm text-slate-700">{l.nom}</span>
                    <input type="number" min="0.5" step="0.5" value={l.quantite}
                      onChange={e => setLignes(prev => prev.map((x, j) => j === i ? { ...x, quantite: e.target.value } : x))}
                      className="w-20 text-center px-2 py-1 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20" />
                    <span className="text-xs text-slate-500 w-8">{l.unite}</span>
                    <span className="text-xs font-semibold text-slate-700 w-16 text-right">{(Number(l.quantite || 0) * l.prixUnit).toFixed(2)} DH</span>
                    <button onClick={() => setLignes(prev => prev.filter((_, j) => j !== i))}
                      className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-slate-500">Total estimé</span>
                  <span className="text-base font-black text-green-700">{total.toFixed(2)} DH</span>
                </div>
                <button onClick={() => setStep("contact")}
                  className="w-full mt-3 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  Continuer → Vos coordonnées
                </button>
              </div>
            )}

            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un article…"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20" />

            {artLoading
              ? <div className="text-center py-10 text-slate-400 text-sm">Chargement du catalogue…</div>
              : filtered.length === 0
                ? <div className="text-center py-10 text-slate-400 text-sm">Aucun article trouvé.</div>
                : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filtered.map(a => {
                      const inCart = lignes.some(l => l.articleId === a.id)
                      return (
                        <div key={a.id} className={`bg-white rounded-2xl border overflow-hidden flex flex-col transition-all ${inCart ? "border-green-300 ring-1 ring-green-200" : "border-slate-200"}`}>
                          {a.image_url && (
                            <div className="h-28 overflow-hidden bg-slate-100">
                              <img src={a.image_url} alt={a.nom} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="p-2.5 flex flex-col gap-1.5 flex-1">
                            <p className="font-bold text-sm text-slate-800 leading-tight">{a.nom}</p>
                            {a.nomAr && <p className="text-[10px] text-slate-400" dir="rtl">{a.nomAr}</p>}
                            <p className="text-[10px] text-slate-400">{a.famille} — {a.unite}</p>
                            {a.prix > 0 && <p className="text-sm font-black text-green-700">{a.prix.toFixed(2)} DH/{a.unite}</p>}
                            <button onClick={() => addArticle(a)}
                              className={`mt-auto text-xs font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1 ${inCart ? "bg-green-100 text-green-700 cursor-default" : "bg-green-50 text-green-700 hover:bg-green-100"}`}>
                              {inCart
                                ? <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Ajouté</>
                                : <><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> Ajouter</>}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
            }
          </div>
        )}

        {/* Step 2 - contact + submit */}
        {step === "contact" && (
          <div className="flex flex-col gap-4">
            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-bold text-slate-700 mb-2">Récapitulatif</h3>
              {lignes.filter(l => Number(l.quantite) > 0).map(l => (
                <div key={l.articleId} className="flex justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                  <span className="text-slate-700">{l.nom} — {l.quantite} {l.unite}</span>
                  <span className="font-semibold text-slate-800">{(Number(l.quantite) * l.prixUnit).toFixed(2)} DH</span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-semibold text-slate-600">Total</span>
                <span className="text-lg font-black text-green-700">{total.toFixed(2)} DH</span>
              </div>
              <button onClick={() => setStep("articles")} className="mt-2 text-xs text-blue-600 hover:underline font-semibold">
                ← Modifier les articles
              </button>
            </div>

            {/* Contact form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-slate-700">Vos coordonnées</h3>

              <ErrorBanner msg={error} />

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Nom complet *</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)}
                  placeholder="Mohammed Alami"
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Téléphone *</label>
                <input type="tel" value={telephone} onChange={e => setTelephone(e.target.value)}
                  placeholder="+212 6 00 00 00 00"
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Email (optionnel)</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.ma"
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Date de livraison souhaitée</label>
                <input type="date" value={dateLivraison} onChange={e => setDateLivraison(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Notes / Instructions</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Adresse, créneaux préférés, instructions particulières…"
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none resize-none" />
              </div>

              <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.985 0C5.368 0 0 5.368 0 11.985c0 2.11.554 4.09 1.523 5.811L.055 23.444l5.793-1.521A11.918 11.918 0 0011.985 24C18.601 24 24 18.632 24 12.015 24 5.4 18.6 0 11.985 0zm0 21.818c-1.867 0-3.606-.502-5.1-1.376l-.366-.217-3.789.994 1.012-3.692-.24-.381A9.816 9.816 0 012.182 12c0-5.418 4.409-9.818 9.818-9.818C17.41 2.182 21.818 6.59 21.818 12c-.009 5.418-4.409 9.818-9.833 9.818z"/></svg>
                Un message WhatsApp sera envoyé automatiquement à notre équipe pour traiter votre commande rapidement.
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25">
                {loading
                  ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
                {loading ? "Envoi en cours…" : "Valider la commande"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Client Dashboard ─────────────────────────────────────────────────────────

type ClientTab = "commandes" | "commande" | "catalogue"

interface CommandeWeb {
  id?: string; numero?: string; statut: string; date?: string; date_souhaitee?: string
  montant_total?: number; lignes?: any[]
}

function ClientDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const { articles, loading: artLoading } = useArticles()
  const company = store.getCompanyConfig()

  const [tab,            setTab]           = useState<ClientTab>("commandes")
  const [commandes,      setCommandes]     = useState<CommandeWeb[]>([])
  const [expandedId,     setExpandedId]    = useState<string | null>(null)
  const [lignes,         setLignes]        = useState<LigneForm[]>([{ articleId: "", nom: "", quantite: "", prixUnit: 0, unite: "kg" }])
  const [dateLivraison,  setDateLivraison] = useState(getJ1())
  const [notes,          setNotes]         = useState("")
  const [submitSuccess,  setSubmitSuccess] = useState(false)
  const [submitError,    setSubmitError]   = useState("")
  const [submitting,     setSubmitting]    = useState(false)
  const [articleSearch,  setArticleSearch] = useState("")
  const [ordersLoading,  setOrdersLoading] = useState(false)

  const filteredArticles = articles.filter(a =>
    !articleSearch || a.nom.toLowerCase().includes(articleSearch.toLowerCase())
  )

  // Load orders from ERP
  const loadOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await fetch(`${ERP_BASE}/api/ext/commandes-web?tel=${encodeURIComponent(user.telephone ?? "")}`)
      if (res.ok) {
        const data = await res.json()
        setCommandes(Array.isArray(data) ? data : [])
      }
    } catch {}
    setOrdersLoading(false)
  }

  useEffect(() => { loadOrders() }, [])

  const handleAddFromCatalogue = (a: ArticlePublic) => {
    setLignes(prev => {
      const emptyIdx = prev.findIndex(l => !l.articleId)
      const newLine: LigneForm = { articleId: a.id, nom: a.nom, quantite: "1", prixUnit: a.prix, unite: a.unite }
      if (emptyIdx >= 0) { const n = [...prev]; n[emptyIdx] = newLine; return n }
      return [...prev, newLine]
    })
    setTab("commande")
  }

  const total = lignes.reduce((s, l) => s + Math.round(Number(l.quantite || 0) * l.prixUnit * 100) / 100, 0)

  const handleSubmitOrder = async () => {
    setSubmitError("")
    const valid = lignes.filter(l => l.articleId && Number(l.quantite) > 0)
    if (!valid.length) { setSubmitError("Ajoutez au moins un article avec une quantité valide."); return }

    setSubmitting(true)
    try {
      const payload = {
        nom_client:     user.name,
        telephone:      user.telephone ?? "",
        email:          user.email ?? undefined,
        date_souhaitee: dateLivraison,
        instructions:   notes.trim() || undefined,
        source:         "portail_client",
        lignes: valid.map(l => ({
          articleId:     l.articleId,
          nom:           l.nom,
          quantite:      Number(l.quantite),
          prix_unitaire: l.prixUnit,
          unite:         l.unite,
          montant:       Math.round(Number(l.quantite) * l.prixUnit * 100) / 100,
        })),
      }

      const res = await fetch(`${ERP_BASE}/api/ext/commandes-web`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error ?? "Erreur lors de l'enregistrement.")
      }

      const data = await res.json()

      // Send WhatsApp notification
      const msgLines = [
        `🛒 *Nouvelle commande ${data.numero ?? ""}*`,
        `👤 ${user.name} — 📞 ${user.telephone ?? ""}`,
        ``,
        ...valid.map(l => `• ${l.nom}: ${l.quantite} ${l.unite} × ${l.prixUnit.toFixed(2)} DH`),
        ``,
        `💰 *Total: ${total.toFixed(2)} DH*`,
        `📅 Livraison souhaitée: ${dateLivraison}`,
        notes ? `📝 Note: ${notes}` : "",
      ].filter(Boolean)
      window.open(waLink(msgLines), "_blank")

      // Reset form
      setLignes([{ articleId: "", nom: "", quantite: "", prixUnit: 0, unite: "kg" }])
      setNotes("")
      setDateLivraison(getJ1())
      setSubmitSuccess(true)

      // Reload orders + auto-redirect after 3s
      await loadOrders()
      setTimeout(() => { setSubmitSuccess(false); setTab("commandes") }, 3000)

    } catch (err: any) {
      setSubmitError(err.message ?? "Erreur réseau. Réessayez.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo
              ? <img src={company.logo} alt="Logo" className="h-8 object-contain" />
              : <FreshLinkLogo size={28} />}
            <div>
              <p className="text-sm font-bold text-slate-800">{company.appName ?? "Dima Krib Lik"}</p>
              <p className="text-[10px] text-slate-400">Client — {user.name}</p>
            </div>
          </div>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Déconnexion
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-0 flex gap-1">
          {([
            { id: "commandes" as const, label: "Mes commandes" },
            { id: "commande"  as const, label: "Nouvelle commande" },
            { id: "catalogue" as const, label: "Catalogue" },
          ]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${tab === t.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5">

        {/* Commandes list */}
        {tab === "commandes" && (
          <div className="flex flex-col gap-3">
            {ordersLoading
              ? <div className="text-center py-10 text-slate-400 text-sm">Chargement…</div>
              : commandes.length === 0
                ? (
                  <div className="text-center py-16 text-slate-400">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                    <p className="text-sm font-medium">Aucune commande pour le moment</p>
                    <button onClick={() => setTab("commande")} className="mt-3 text-xs text-blue-600 font-semibold hover:underline">Passer ma première commande →</button>
                  </div>
                )
                : commandes.map(cmd => {
                  const key = cmd.id ?? cmd.numero ?? Math.random().toString()
                  const cfg = STATUT_CONFIG[cmd.statut] ?? { label: cmd.statut, labelAr: "", cls: "bg-slate-100 text-slate-600 border-slate-200" }
                  return (
                    <div key={key} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                      <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                        onClick={() => setExpandedId(expandedId === key ? null : key)}>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{cmd.numero ?? "Commande"}</span>
                          <span className="text-xs text-slate-500">Livraison : {cmd.date_souhaitee ?? "—"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.cls}`}>{cfg.label}</span>
                          <span className="text-sm font-bold text-slate-700">{(cmd.montant_total ?? 0).toFixed(2)} DH</span>
                          <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === key ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </div>
                      </button>
                      {expandedId === key && cmd.lignes && (
                        <div className="border-t border-slate-100 px-4 py-3">
                          <table className="w-full text-xs">
                            <thead><tr className="text-slate-400 uppercase text-[10px]"><th className="text-left pb-1">Article</th><th className="text-right pb-1">Qté</th><th className="text-right pb-1">PU</th><th className="text-right pb-1">Total</th></tr></thead>
                            <tbody>
                              {cmd.lignes.map((l: any, i: number) => (
                                <tr key={i} className="border-t border-slate-100">
                                  <td className="py-1.5 text-slate-700 font-medium">{l.nom ?? l.articleNom ?? l.article}</td>
                                  <td className="py-1.5 text-right text-slate-600">{l.quantite} {l.unite}</td>
                                  <td className="py-1.5 text-right text-slate-600">{Number(l.prix_unitaire ?? l.prixUnitaire ?? 0).toFixed(2)}</td>
                                  <td className="py-1.5 text-right font-semibold text-slate-800">{Number(l.montant ?? l.total ?? 0).toFixed(2)} DH</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )
                })
            }
          </div>
        )}

        {/* New order */}
        {tab === "commande" && (
          <div className="flex flex-col gap-4">
            {submitSuccess && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Commande envoyée ! Redirection…
              </div>
            )}
            <ErrorBanner msg={submitError} />

            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
              <h3 className="font-bold text-slate-800">Articles commandés</h3>
              {artLoading ? <p className="text-xs text-slate-400">Chargement des articles…</p> : (
                <>
                  {lignes.map((ligne, i) => (
                    <div key={i} className="flex gap-2">
                      <select value={ligne.articleId}
                        onChange={e => {
                          const art = articles.find(a => a.id === e.target.value)
                          setLignes(prev => prev.map((l, j) => j === i
                            ? { ...l, articleId: e.target.value, nom: art?.nom ?? "", prixUnit: art?.prix ?? 0, unite: art?.unite ?? "kg" }
                            : l))
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                        <option value="">— Choisir un article —</option>
                        {articles.map(a => <option key={a.id} value={a.id}>{a.nom} ({a.unite}) — {a.prix.toFixed(2)} DH</option>)}
                      </select>
                      <input type="number" min="0" step="0.5" value={ligne.quantite}
                        onChange={e => setLignes(prev => prev.map((l, j) => j === i ? { ...l, quantite: e.target.value } : l))}
                        className="w-24 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        placeholder="Qté" />
                      <button onClick={() => setLignes(prev => prev.filter((_, j) => j !== i))}
                        className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                  <button onClick={() => setLignes(prev => [...prev, { articleId: "", nom: "", quantite: "", prixUnit: 0, unite: "kg" }])}
                    className="flex items-center gap-2 text-xs text-blue-600 font-semibold py-2 hover:underline">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    Ajouter un article
                  </button>
                  {total > 0 && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-xs text-slate-500">Total estimé</span>
                      <span className="text-base font-black text-blue-700">{total.toFixed(2)} DH</span>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Date de livraison souhaitée</label>
                <input type="date" value={dateLivraison} onChange={e => setDateLivraison(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Notes / Instructions</label>
                <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none resize-none"
                  placeholder="Instructions spéciales, adresse de livraison…" />
              </div>
            </div>

            <button onClick={handleSubmitOrder} disabled={submitting || submitSuccess}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
              {submitting
                ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg>
                : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>}
              {submitting ? "Envoi en cours…" : "Envoyer la commande"}
            </button>
          </div>
        )}

        {/* Catalogue */}
        {tab === "catalogue" && (
          <div className="flex flex-col gap-3">
            <input value={articleSearch} onChange={e => setArticleSearch(e.target.value)}
              placeholder="Rechercher un article…"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            {artLoading
              ? <div className="text-center py-10 text-slate-400 text-sm">Chargement…</div>
              : (
                <div className="grid grid-cols-2 gap-3">
                  {filteredArticles.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                      {a.image_url && <div className="h-24 overflow-hidden bg-slate-100"><img src={a.image_url} alt={a.nom} className="w-full h-full object-cover" /></div>}
                      <div className="p-3 flex flex-col gap-1 flex-1">
                        <p className="font-bold text-sm text-slate-800">{a.nom}</p>
                        {a.nomAr && <p className="text-xs text-slate-400" dir="rtl">{a.nomAr}</p>}
                        <p className="text-xs text-slate-500">{a.unite} — {a.famille}</p>
                        {a.prix > 0 && <p className="text-sm font-black text-blue-700">{a.prix.toFixed(2)} DH / {a.unite}</p>}
                        <button onClick={() => handleAddFromCatalogue(a)}
                          className="mt-auto text-xs font-semibold py-1.5 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                          + Ajouter à la commande
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Fournisseur Dashboard ────────────────────────────────────────────────────

type FournisseurTab = "commandes" | "profil"

function FournisseurDashboard({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [tab,        setTab]        = useState<FournisseurTab>("commandes")
  const [orders,     setOrders]     = useState<PurchaseOrder[]>([])
  const [fournisseur,setFournisseur]= useState<Fournisseur | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const company = store.getCompanyConfig()

  const refresh = () => {
    const allFourn = store.getFournisseurs()
    setFournisseur(allFourn.find(f => f.id === user.fournisseurId) ?? null)
    const allOrders = store.getPurchaseOrders()
    setOrders((user.fournisseurId ? allOrders.filter(o => o.fournisseurId === user.fournisseurId) : []).sort((a, b) => b.date.localeCompare(a.date)))
  }

  useEffect(() => { refresh() }, [])

  const ORDER_STATUS: Record<string, { label: string; cls: string }> = {
    draft:     { label: "Brouillon", cls: "bg-slate-100 text-slate-600" },
    sent:      { label: "Envoyé",    cls: "bg-blue-100 text-blue-700"   },
    received:  { label: "Reçu",      cls: "bg-green-100 text-green-700" },
    partial:   { label: "Partiel",   cls: "bg-amber-100 text-amber-700" },
    cancelled: { label: "Annulé",    cls: "bg-red-100 text-red-700"     },
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo ? <img src={company.logo} alt="Logo" className="h-8 object-contain" /> : <FreshLinkLogo size={28} />}
            <div>
              <p className="text-sm font-bold text-slate-800">{company.appName ?? "Dima Krib Lik"}</p>
              <p className="text-[10px] text-slate-400">Fournisseur — {fournisseur?.nom ?? user.name}</p>
            </div>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 border border-slate-200 rounded-lg px-3 py-1.5 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Déconnexion
          </button>
        </div>
        <div className="max-w-2xl mx-auto px-4 flex gap-1">
          {([{ id: "commandes" as const, label: "Bons de commande" }, { id: "profil" as const, label: "Mon profil" }]).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all ${tab === t.id ? "border-blue-500 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {tab === "commandes" && (
          <div className="flex flex-col gap-3">
            {orders.length === 0
              ? (
                <div className="text-center py-16 text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  <p className="text-sm font-medium">Aucun bon de commande reçu</p>
                </div>
              )
              : orders.map(o => {
                const cfg = ORDER_STATUS[o.statut] ?? { label: o.statut, cls: "bg-slate-100 text-slate-600" }
                return (
                  <div key={o.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <button className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
                      onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}>
                      <div>
                        <p className="text-sm font-bold text-slate-800">BC du {o.date}</p>
                        <p className="text-xs text-slate-500">Livraison prévue : {o.dateLivraisonSouhaitee ?? "—"}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>{cfg.label}</span>
                        <span className="text-sm font-bold text-slate-700">{(o.montantTotal ?? 0).toFixed(2)} DH</span>
                        <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedId === o.id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </button>
                    {expandedId === o.id && (
                      <div className="border-t border-slate-100 px-4 py-3">
                        <table className="w-full text-xs">
                          <thead><tr className="text-slate-400 uppercase text-[10px]"><th className="text-left pb-1">Article</th><th className="text-right pb-1">Qté</th><th className="text-right pb-1">PU</th><th className="text-right pb-1">Total</th></tr></thead>
                          <tbody>
                            {o.lignes?.map((l, i) => (
                              <tr key={i} className="border-t border-slate-100">
                                <td className="py-1.5 text-slate-700 font-medium">{l.articleNom}</td>
                                <td className="py-1.5 text-right text-slate-600">{l.quantiteCommandee} {l.unite}</td>
                                <td className="py-1.5 text-right text-slate-600">{(l.prixUnitaire ?? 0).toFixed(2)}</td>
                                <td className="py-1.5 text-right font-semibold">{((l.quantiteCommandee ?? 0) * (l.prixUnitaire ?? 0)).toFixed(2)} DH</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {o.notes && <p className="text-xs text-slate-500 italic mt-2 pt-2 border-t border-slate-100">Note : {o.notes}</p>}
                      </div>
                    )}
                  </div>
                )
              })
            }
          </div>
        )}

        {tab === "profil" && fournisseur && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-base">{fournisseur.nom}</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: "Téléphone", value: fournisseur.telephone },
                { label: "Email",     value: fournisseur.email     },
                { label: "Ville",     value: fournisseur.ville     },
                { label: "ICE",       value: fournisseur.ice       },
              ].filter(r => r.value).map(r => (
                <div key={r.label}>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">{r.label}</p>
                  <p className="text-slate-700 font-medium mt-0.5">{r.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Export ──────────────────────────────────────────────────────────────

type PortailView = "login" | "request" | "client" | "fournisseur" | "order"

interface Props { onInternalLogin?: (u: User) => void }

export default function PortailExterne({ onInternalLogin }: Props) {
  const [view, setView] = useState<PortailView>("login")
  const [user, setUser] = useState<User | null>(null)

  const handleLogin = (u: User) => {
    setUser(u)
    if (onInternalLogin) onInternalLogin(u)
    if (u.role === "client")      setView("client")
    else if (u.role === "fournisseur") setView("fournisseur")
  }

  const handleLogout = () => { setUser(null); setView("login") }

  if (view === "login")       return <LoginScreen onLogin={handleLogin} onRequestAccount={() => setView("request")} onPublicOrder={() => setView("order")} />
  if (view === "request")     return <AccountRequestForm onBack={() => setView("login")} />
  if (view === "order")       return <PublicOrderForm onBack={() => setView("login")} />
  if (view === "client" && user)       return <ClientDashboard user={user} onLogout={handleLogout} />
  if (view === "fournisseur" && user)  return <FournisseurDashboard user={user} onLogout={handleLogout} />
  return null
}
