"use client"

import { useState, useEffect } from "react"
import { store, type Famille, type User } from "@/lib/store"
import { upsertFamille, deleteFamille as deleteFamilleSupabase } from "@/lib/supabase/db"

const EMPTY_FORM: Omit<Famille, "id"> = {
  nom: "", couleur: "#0F3460", ordre: 0, actif: true, notes: "",
}

const COLORS = ["#0F3460", "#F2811F", "#0EA5E9", "#10B981", "#8B5CF6", "#EF4444", "#F59E0B", "#EC4899", "#6B7280", "#14B8A6"]

function genFamilleId() {
  return "FAM_" + Math.random().toString(36).substring(2, 9).toUpperCase()
}

export default function BOFamilles({ user }: { user: User }) {
  const [familles, setFamilles] = useState<Famille[]>([])
  const [articles, setArticles] = useState(store.getArticles())
  const [editing, setEditing] = useState<Famille | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<Famille, "id">>(EMPTY_FORM)
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

  const isSuperAdmin = user.role === "master_admin" || user.role === "super_super_admin" || user.role === "super_admin" || user.role === "admin"

  const notify = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const refresh = () => {
    setFamilles([...store.getFamilles()].sort((a, b) => (a.ordre ?? 0) - (b.ordre ?? 0)))
    setArticles(store.getArticles())
  }

  useEffect(() => {
    refresh()
    window.addEventListener("fl:synced", refresh)
    return () => window.removeEventListener("fl:synced", refresh)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const articlesInFamille = (nom: string) => articles.filter(a => a.famille === nom)

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY_FORM, ordre: familles.length + 1 })
    setShowForm(true)
  }

  const openEdit = (f: Famille) => {
    setEditing(f)
    setForm({ nom: f.nom, couleur: f.couleur ?? "#0F3460", ordre: f.ordre ?? 0, actif: f.actif ?? true, notes: f.notes ?? "" })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.nom.trim()) { notify("Le nom de la famille est obligatoire", "err"); return }
    setSaving(true)
    const payload: Famille = { id: editing ? editing.id : genFamilleId(), ...form }
    await upsertFamille(payload)
    notify(editing ? "Famille mise a jour" : "Famille creee")
    setSaving(false)
    setShowForm(false)
    refresh()
  }

  const handleToggleActif = async (f: Famille) => {
    await upsertFamille({ ...f, actif: !f.actif })
    refresh()
  }

  const handleDelete = async (f: Famille) => {
    const nbArticles = articlesInFamille(f.nom).length
    if (nbArticles > 0) {
      notify(`${nbArticles} article(s) utilisent encore cette famille. Reassignez-les d'abord (Catalogue Produits).`, "err")
      return
    }
    if (!confirm(`Supprimer la famille "${f.nom}" ?`)) return
    await deleteFamilleSupabase(f.id)
    notify("Famille supprimee")
    refresh()
  }

  const filtered = familles.filter(f => f.nom.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto">

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Gestion des Familles
            <span className="text-xs font-normal text-muted-foreground" dir="rtl">إدارة الفئات</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Definissez les familles/categories du catalogue. Elles seront proposees lors de la creation/edition d&apos;un article.
          </p>
        </div>
        {isSuperAdmin && (
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle Famille
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total familles", value: familles.length, color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Actives",        value: familles.filter(f => f.actif).length, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
          { label: "Inactives",      value: familles.filter(f => !f.actif).length, color: "bg-amber-50 border-amber-200 text-amber-700" },
          { label: "Articles classes", value: articles.filter(a => a.famille).length, color: "bg-violet-50 border-violet-200 text-violet-700" },
        ].map(s => (
          <div key={s.label} className={`flex flex-col gap-1 px-4 py-3 rounded-xl border ${s.color}`}>
            <span className="text-2xl font-bold">{s.value}</span>
            <span className="text-xs font-medium opacity-80">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher une famille..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        {filtered.map(f => {
          const count = articlesInFamille(f.nom).length
          return (
            <div key={f.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 bg-card transition-all ${f.actif ? "border-border" : "border-dashed border-border/50 opacity-60"}`}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: f.couleur || "#0F3460" }}>
                <span className="text-white text-xs font-black">{f.ordre ?? "—"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-foreground truncate">{f.nom}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${f.actif ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {f.actif ? "Active" : "Inactive"}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-muted text-muted-foreground shrink-0">
                    {count} article{count !== 1 ? "s" : ""}
                  </span>
                </div>
                {f.notes && <p className="text-xs text-muted-foreground truncate mt-0.5">{f.notes}</p>}
              </div>
              {isSuperAdmin && (
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(f)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button onClick={() => handleToggleActif(f)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${f.actif ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {f.actif
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      }
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(f)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
            </svg>
            <p className="font-medium">Aucune famille trouvee</p>
            {isSuperAdmin && <button onClick={openCreate} className="text-sm text-primary underline">Creer la premiere famille</button>}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-foreground">{editing ? "Modifier la famille" : "Nouvelle famille"}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Nom de la famille *</label>
                <input
                  type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                  placeholder="ex: Épicerie & Alimentation"
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Ordre d&apos;affichage</label>
                <input
                  type="number" value={form.ordre} onChange={e => setForm({ ...form, ordre: Number(e.target.value) })}
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Couleur</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, couleur: c })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${form.couleur === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ background: c }} />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Notes</label>
                <textarea
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  placeholder="Notes supplementaires..."
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button type="button"
                  onClick={() => setForm({ ...form, actif: !form.actif })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.actif ? "bg-emerald-500" : "bg-slate-200"}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.actif ? "left-5" : "left-0.5"}`} />
                </button>
                <span className="text-sm font-medium text-foreground">{form.actif ? "Famille active" : "Famille inactive"}</span>
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving ? "Enregistrement..." : editing ? "Mettre a jour" : "Creer la famille"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
