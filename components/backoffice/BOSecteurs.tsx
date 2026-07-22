"use client"

import { useState, useEffect } from "react"
import { store, type Secteur, type User } from "@/lib/store"
import { upsertSecteur, deleteSecteur as deleteSecteurSupabase } from "@/lib/supabase/db"

const EMPTY_FORM: Omit<Secteur, "id"> = {
  nom: "",
  ville: "",
  zones: [],
  responsableId: "",
  responsableNom: "",
  couleur: "#0F3460",
  actif: true,
  notes: "",
}

const COLORS = ["#0F3460", "#F2811F", "#0EA5E9", "#10B981", "#8B5CF6", "#EF4444", "#F59E0B", "#EC4899"]

function genSecteurId() {
  return "SECT_" + Math.random().toString(36).substring(2, 9).toUpperCase()
}

export default function BOSecteurs({ user }: { user: User }) {
  const [secteurs, setSecteurs] = useState<Secteur[]>([])
  const [clients, setClients] = useState(store.getClients())
  const [users, setUsers] = useState<User[]>([])
  const [editing, setEditing] = useState<Secteur | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<Secteur, "id">>(EMPTY_FORM)
  const [zonesInput, setZonesInput] = useState("")
  const [search, setSearch] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null)

  const isSuperAdmin = user.role === "master_admin" || user.role === "super_super_admin" || user.role === "super_admin" || user.role === "admin"
  const responsables = users.filter(u => u.role === "resp_commercial" || u.role === "team_leader")

  const notify = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const refresh = () => {
    setSecteurs(store.getSecteurs())
    setClients(store.getClients())
    setUsers(store.getUsers())
  }

  useEffect(() => { refresh() }, [])

  const clientsInSecteur = (nom: string) => clients.filter(c => c.secteur === nom)
  const prevendeursInSecteur = (nom: string) => users.filter(u => u.secteur === nom && (u.role === "prevendeur" || u.role === "commercial"))

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setZonesInput("")
    setShowForm(true)
  }

  const openEdit = (s: Secteur) => {
    setEditing(s)
    setForm({
      nom: s.nom, ville: s.ville ?? "", zones: s.zones ?? [],
      responsableId: s.responsableId ?? "", responsableNom: s.responsableNom ?? "",
      couleur: s.couleur ?? "#0F3460", actif: s.actif ?? true, notes: s.notes ?? "",
    })
    setZonesInput((s.zones ?? []).join(", "))
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.nom.trim()) { notify("Le nom du secteur est obligatoire", "err"); return }
    setSaving(true)
    const zones = zonesInput.split(",").map(z => z.trim()).filter(Boolean)
    const resp = responsables.find(r => r.id === form.responsableId)
    const payload: Secteur = {
      id: editing ? editing.id : genSecteurId(),
      ...form,
      zones,
      responsableNom: resp?.name ?? "",
    }
    await upsertSecteur(payload)
    notify(editing ? "Secteur mis a jour" : "Secteur cree")
    setSaving(false)
    setShowForm(false)
    refresh()
  }

  const handleToggleActif = async (s: Secteur) => {
    await upsertSecteur({ ...s, actif: !s.actif })
    refresh()
  }

  const handleDelete = async (s: Secteur) => {
    const nbClients = clientsInSecteur(s.nom).length
    const nbPrev = prevendeursInSecteur(s.nom).length
    if (nbClients > 0 || nbPrev > 0) {
      notify(`${nbClients} client(s) et ${nbPrev} prevendeur(s) sont encore affectes a ce secteur. Reassignez-les d'abord (Affectation Commerciale).`, "err")
      return
    }
    if (!confirm(`Supprimer le secteur "${s.nom}" ?`)) return
    await deleteSecteurSupabase(s.id)
    notify("Secteur supprime")
    refresh()
  }

  const filtered = secteurs.filter(s =>
    s.nom.toLowerCase().includes(search.toLowerCase()) ||
    (s.ville ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto">

      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold transition-all ${toast.type === "ok" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Gestion des Secteurs
            <span className="text-xs font-normal text-muted-foreground" dir="rtl">إدارة القطاعات</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Definissez la liste officielle des secteurs commerciaux. Ils seront proposes lors de l&apos;affectation des clients et prevendeurs.
          </p>
        </div>
        {isSuperAdmin && (
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau Secteur
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total secteurs", value: secteurs.length, color: "bg-blue-50 border-blue-200 text-blue-700" },
          { label: "Actifs",         value: secteurs.filter(s => s.actif).length, color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
          { label: "Inactifs",       value: secteurs.filter(s => !s.actif).length, color: "bg-amber-50 border-amber-200 text-amber-700" },
          { label: "Clients affectes", value: clients.filter(c => c.secteur).length, color: "bg-violet-50 border-violet-200 text-violet-700" },
        ].map(s => (
          <div key={s.label} className={`flex flex-col gap-1 px-4 py-3 rounded-xl border ${s.color}`}>
            <span className="text-2xl font-bold">{s.value}</span>
            <span className="text-xs font-medium opacity-80">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un secteur..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Secteur cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map(s => {
          const secClients = clientsInSecteur(s.nom)
          const secPrev = prevendeursInSecteur(s.nom)
          return (
            <div key={s.id} className={`rounded-xl border-2 bg-card transition-all ${s.actif ? "border-border" : "border-dashed border-border/50 opacity-60"}`}>
              <div className="flex items-start justify-between gap-3 p-4 border-b border-border">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm"
                    style={{ background: s.couleur || "#0F3460" }}>
                    {s.nom.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-foreground truncate">{s.nom}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${s.actif ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {s.actif ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    {s.ville && <p className="text-xs text-muted-foreground">{s.ville}</p>}
                  </div>
                </div>
                {isSuperAdmin && (
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(s)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button onClick={() => handleToggleActif(s)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${s.actif ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {s.actif
                          ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        }
                      </svg>
                    </button>
                    <button onClick={() => handleDelete(s)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col gap-3">
                {s.zones && s.zones.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {s.zones.map(z => (
                      <span key={z} className="text-[10px] px-2 py-1 rounded-lg bg-muted text-muted-foreground font-medium">{z}</span>
                    ))}
                  </div>
                )}
                {s.responsableNom && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Responsable : {s.responsableNom}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg bg-muted">
                    <span className="text-sm font-bold text-foreground">{secClients.length}</span>
                    <span className="text-[10px] text-muted-foreground">Client(s)</span>
                  </div>
                  <div className="flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg bg-muted">
                    <span className="text-sm font-bold text-foreground">{secPrev.length}</span>
                    <span className="text-[10px] text-muted-foreground">Prevendeur(s)</span>
                  </div>
                </div>
                {s.notes && <p className="text-xs text-muted-foreground italic border-t border-border pt-2">{s.notes}</p>}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <div className="sm:col-span-2 flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
            <svg className="w-12 h-12 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p className="font-medium">Aucun secteur trouve</p>
            {isSuperAdmin && <button onClick={openCreate} className="text-sm text-primary underline">Creer le premier secteur</button>}
          </div>
        )}
      </div>

      <div className="flex items-start gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
        <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-semibold mb-0.5">Comment affecter un client ou un prevendeur a un secteur ?</p>
          <p className="text-xs leading-relaxed">
            Allez dans <strong>Commercial &gt; Affectation</strong> et choisissez le secteur dans la liste — les noms definis ici y apparaitront automatiquement.
          </p>
        </div>
      </div>

      {/* Create/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-bold text-foreground">{editing ? "Modifier le secteur" : "Nouveau secteur"}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Nom du secteur *</label>
                <input
                  type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })}
                  placeholder="ex: Nord Casablanca"
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Ville</label>
                <input
                  type="text" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })}
                  placeholder="ex: Casablanca"
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Zones (separees par des virgules)</label>
                <input
                  type="text" value={zonesInput} onChange={e => setZonesInput(e.target.value)}
                  placeholder="ex: Sidi Bernoussi, Ain Sebaa, Roches Noires"
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-foreground">Responsable du secteur</label>
                <select value={form.responsableId} onChange={e => setForm({ ...form, responsableId: e.target.value })}
                  className="px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Aucun</option>
                  {responsables.map(r => <option key={r.id} value={r.id}>{r.name} ({r.role})</option>)}
                </select>
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
                <span className="text-sm font-medium text-foreground">{form.actif ? "Secteur actif" : "Secteur inactif"}</span>
              </div>
            </div>
            <div className="flex gap-3 px-5 pb-5">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors">
                Annuler
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                {saving ? "Enregistrement..." : editing ? "Mettre a jour" : "Creer le secteur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
