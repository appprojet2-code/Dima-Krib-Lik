"use client"

import { useState, useEffect } from "react"
import { store, type User, getUserInterface } from "@/lib/store"
import dynamic from "next/dynamic"

// All heavy components loaded dynamically — never crash the initial bundle
const LoginPage = dynamic(() => import("@/components/auth/LoginPage"), { ssr: false })
const MobileLayout = dynamic(() => import("@/components/mobile/MobileLayout"), { ssr: false })
const BackOfficeLayout = dynamic(() => import("@/components/backoffice/BackOfficeLayout"), { ssr: false })
const PortailExterne = dynamic(() => import("@/components/portail/PortailExterne"), { ssr: false })
const SecurityGuard = dynamic(() => import("@/components/SecurityGuard"), { ssr: false })

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm font-sans">Chargement...</p>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"mobile" | "backoffice">("backoffice")
  const [error, setError] = useState<string | null>(null)
  const [entry, setEntry] = useState<"interne" | "externe" | null>(null)

  useEffect(() => {
    try {
      const session = store.getSession()
      setUser(session)
      if (session) {
        const iface = getUserInterface(session)
        setView(iface === "mobile" ? "mobile" : "backoffice")
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogin = (loggedUser: User, forceView?: "mobile" | "backoffice") => {
    try {
      store.setSession(loggedUser)
      setUser(loggedUser)
      if (forceView) {
        setView(forceView)
      } else {
        const iface = getUserInterface(loggedUser)
        setView(iface === "mobile" ? "mobile" : "backoffice")
      }
    } catch (e: unknown) {
      console.error("Login error:", e)
    }
  }

  const handleLogout = () => {
    try {
      store.logout()
    } catch (_) {}
    setUser(null)
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 space-y-4 shadow-lg">
          <p className="text-lg font-bold text-foreground">Erreur de demarrage</p>
          <p className="text-sm font-mono text-red-600 bg-red-50 rounded-xl p-3 break-all">{error}</p>
          <button
            onClick={() => { try { localStorage.clear() } catch(_){} window.location.reload() }}
            className="w-full py-3 rounded-xl font-bold text-white text-sm"
            style={{ background: "var(--primary)" }}>
            Reinitialiser et recharger
          </button>
        </div>
      </div>
    )
  }

  // Loading
  if (loading) return <Spinner />

  // Not logged in — choose Interne (equipe) or Externe (client/fournisseur) first
  if (!user) {
    if (entry === "interne") {
      return (
        <>
          <LoginPage onLogin={handleLogin} />
          <button
            onClick={() => setEntry(null)}
            className="fixed top-3 left-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 bg-white/90 border border-slate-200 shadow-sm hover:text-slate-700 hover:bg-white transition-colors">
            ← Changer d&apos;espace
          </button>
        </>
      )
    }
    if (entry === "externe") {
      return (
        <>
          <PortailExterne onInternalLogin={handleLogin} />
          <button
            onClick={() => setEntry(null)}
            className="fixed top-3 left-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 bg-white/90 border border-slate-200 shadow-sm hover:text-slate-700 hover:bg-white transition-colors">
            ← Changer d&apos;espace
          </button>
        </>
      )
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm flex flex-col gap-4">
          <div className="text-center mb-2">
            <p className="text-lg font-bold text-foreground">Bienvenue</p>
            <p className="text-sm text-muted-foreground mt-1">Choisissez votre espace de connexion</p>
          </div>
          <button
            onClick={() => setEntry("interne")}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: "oklch(0.38 0.2 260)" }}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="flex-1 text-left">
              Espace Interne
              <span className="block text-[11px] font-normal opacity-80">Equipe — connexion mot de passe</span>
            </span>
          </button>
          <button
            onClick={() => setEntry("externe")}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-white font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity"
            style={{ background: "oklch(0.52 0.16 145)" }}>
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-2.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-4-4" />
            </svg>
            <span className="flex-1 text-left">
              Espace Externe
              <span className="block text-[11px] font-normal opacity-80">Clients &amp; fournisseurs</span>
            </span>
          </button>
        </div>
      </div>
    )
  }

  // External portal roles stay in their dedicated UI
  if (user.role === "fournisseur" || user.role === "client") {
    return <PortailExterne />
  }

  const iface = getUserInterface(user)

  // Switcher button for users with both interfaces
  const bothSwitcher = iface === "both" ? (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setView(v => v === "backoffice" ? "mobile" : "backoffice")}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg text-white text-xs font-bold"
        style={{ background: "oklch(0.38 0.2 260)" }}>
        {view === "backoffice" ? "Vue Mobile" : "Vue Back-office"}
      </button>
    </div>
  ) : null

  // Mobile
  if (iface === "mobile" || (iface === "both" && view === "mobile")) {
    const isSuperAdmin = user.role === "super_admin"
    const isDemoAccount = user.name.toLowerCase().startsWith("demo")
    const needsGuard = !isSuperAdmin && !isDemoAccount && user.requireCameraAuth === true
    const content = <MobileLayout user={user} onLogout={handleLogout} />
    return (
      <>
        {needsGuard ? <SecurityGuard skipGps={false}>{content}</SecurityGuard> : content}
        {bothSwitcher}
      </>
    )
  }

  // Back-office
  return (
    <>
      <BackOfficeLayout user={user} onLogout={handleLogout} />
      {bothSwitcher}
    </>
  )
}
