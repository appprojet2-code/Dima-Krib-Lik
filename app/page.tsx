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

function EntryChoice({ onChoose }: { onChoose: (choice: "interne" | "externe") => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">FreshLink Pro</p>
          <p className="text-sm text-muted-foreground mt-1">Choisissez votre espace / اختر مساحتك</p>
        </div>
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => onChoose("interne")}
            className="w-full py-4 px-5 rounded-2xl border-2 border-border bg-card hover:border-primary transition-colors text-left flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">Espace Interne</p>
              <p className="text-xs text-muted-foreground">Équipe FreshLink — الفريق الداخلي</p>
            </div>
          </button>
          <button
            onClick={() => onChoose("externe")}
            className="w-full py-4 px-5 rounded-2xl border-2 border-border bg-card hover:border-primary transition-colors text-left flex items-center gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-8.13a4 4 0 110 8 4 4 0 010-8zm6 8a4 4 0 10-8 0" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">Espace Externe</p>
              <p className="text-xs text-muted-foreground">Clients & Fournisseurs — الشركاء الخارجيون</p>
            </div>
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground/70">Powered by Vita Tech</p>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<"mobile" | "backoffice">("backoffice")
  const [error, setError] = useState<string | null>(null)
  const [entryChoice, setEntryChoice] = useState<"interne" | "externe" | null>(null)

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

  // Not logged in — ask which space first (interne staff vs externe partners)
  if (!user) {
    if (entryChoice === null) {
      return <EntryChoice onChoose={setEntryChoice} />
    }
    const backButton = (
      <button
        onClick={() => setEntryChoice(null)}
        className="fixed top-3 left-3 z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border shadow text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Changer d&apos;espace
      </button>
    )
    if (entryChoice === "interne") {
      return <>{backButton}<LoginPage onLogin={handleLogin} /></>
    }
    // externe — handles login + account request internally
    return <>{backButton}<PortailExterne /></>
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
