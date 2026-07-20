"use client"

import { useState, useRef, useEffect } from "react"
import { store, type User } from "@/lib/store"

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

type AgentId = "jawad" | "zizi" | "ourai" | "ashel"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  ts: number
}

interface Agent {
  id: AgentId
  name: string
  department: string
  avatar: string
  color: string
  bgColor: string
  borderColor: string
  systemPrompt: string
  placeholder: string
  greeting: string
  quickActions: string[]
}

// ─────────────────────────────────────────────────────────────
// API — robust with retry + fallback models
// ─────────────────────────────────────────────────────────────

const ENDPOINT = "https://llm.blackbox.ai/chat/completions"
const HEADERS = {
  "Content-Type": "application/json",
  "customerId": "cus_TSL8iYLtbslUQB",
  "Authorization": "Bearer xxx",
}

const MODEL_CHAIN = [
  "openrouter/claude-sonnet-4",
  "openrouter/anthropic/claude-3.5-haiku",
  "openrouter/openai/gpt-4o-mini",
  "openrouter/google/gemini-flash-1.5",
]

async function callLLM(
  systemPrompt: string,
  history: Message[],
  attempt = 0
): Promise<string> {
  if (attempt >= MODEL_CHAIN.length) throw new Error("QUOTA_EXCEEDED")
  const model = MODEL_CHAIN[attempt]
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: HEADERS,
      signal: controller.signal,
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          ...history.slice(-18).map(m => ({ role: m.role, content: m.content })),
        ],
        max_tokens: 2048,
        temperature: 0.72,
      }),
    })
    clearTimeout(timeout)
    if (res.status === 429 || res.status === 402 || res.status === 503) {
      await new Promise(r => setTimeout(r, 800 * (attempt + 1)))
      return callLLM(systemPrompt, history, attempt + 1)
    }
    if (!res.ok) throw new Error(`HTTP_${res.status}`)
    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content?.trim()
    if (!text || text.length < 2) throw new Error("EMPTY")
    return text
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : ""
    if (msg === "QUOTA_EXCEEDED") throw e
    if (attempt < MODEL_CHAIN.length - 1) {
      await new Promise(r => setTimeout(r, 600))
      return callLLM(systemPrompt, history, attempt + 1)
    }
    throw new Error("QUOTA_EXCEEDED")
  }
}

function genId() { return `${Date.now()}_${Math.random().toString(36).slice(2, 7)}` }

// ─────────────────────────────────────────────────────────────
// Live business context builder — injects real store data into
// the commercial AI prompt so it knows actual clients,
// contracts, baskets, and stock.
// ─────────────────────────────────────────────────────────────
function buildLiveContext(): string {
  try {
    const clients    = store.getClients()
    const articles   = store.getArticles()
    const commandes  = store.getCommandes()
    const baskets    = store.getClientBaskets()

    // Top 30 active clients with contract terms
    const activeClients = clients.filter(c => c.telephone || c.email || c.secteur).slice(0, 30)
    const clientLines = activeClients.map(c => {
      const lastCmd = commandes
        .filter(cmd => cmd.clientId === c.id)
        .sort((a, b) => b.date.localeCompare(a.date))[0]
      const basket = baskets.find(b => b.clientId === c.id)
      const basketItems = basket ? basket.lignes.map(l => `${l.articleNom}(${l.quantiteHabituelle}${l.unite})`).join(", ") : "non defini"
      return [
        `- ${c.nom} | ${c.type} | ${c.secteur}/${c.zone}`,
        `  Taille: ${c.taille} | Rotation: ${c.rotation} | Gamme: ${c.typeProduits}`,
        `  Paiement: ${c.modalitePaiement ?? "non defini"} | Credit: ${c.creditAutorise ? `Oui (${c.delaiRecouvrement ?? ""}` + ")" : "Non"}`,
        `  Derniere cmd: ${lastCmd?.date ?? "jamais"} | Panier habituel: ${basketItems}`,
      ].join("\n")
    }).join("\n")

    // Stock snapshot — top 20 articles with ATP
    const stockLines = articles.slice(0, 20).map(a => {
      const vs = store.getVirtualStock(a.id)
      const pv = store.computePV(a)
      return `- ${a.nom}: stock ${vs.physical}${a.unite} | ATP ${vs.available}${a.unite} | PA ${a.prixAchat}DH | PV ${pv}DH`
    }).join("\n")

    // Recent commands summary (last 7 days)
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentCmds = commandes
      .filter(c => c.date >= sevenDaysAgo.toISOString().split("T")[0])
      .slice(0, 15)
    const cmdLines = recentCmds.map(c => {
      const total = c.lignes.reduce((s, l) => s + l.quantite * l.prixVente, 0)
      return `- ${c.date} | ${c.clientNom} | ${total.toFixed(0)} DH | statut: ${c.statut}`
    }).join("\n")

    return `
═══ DONNEES LIVE SYSTEME (mise a jour automatique) ═══

=== CLIENTS ACTIFS (${activeClients.length}) ===
${clientLines || "Aucun client enregistre."}

=== STOCK DISPONIBLE (ATP — Available to Promise) ===
${stockLines || "Aucun article en stock."}

=== COMMANDES RECENTES (7 derniers jours) ===
${cmdLines || "Aucune commande recente."}

CONSIGNE : Utilise ces donnees reelles pour tes suggestions de paniers, ciblage clients, et analyse commerciale. Quand un client est mentionne, retrouve-le dans la liste ci-dessus et cite ses vrais termes contractuels.
`
  } catch {
    return "\n[Contexte live non disponible — donnees store inaccessibles]\n"
  }
}

function loadHistory(id: AgentId): Message[] {
  try { return JSON.parse(localStorage.getItem(`fl_bo_hist_${id}`) ?? "[]") } catch { return [] }
}
function saveHistory(id: AgentId, msgs: Message[]) {
  localStorage.setItem(`fl_bo_hist_${id}`, JSON.stringify(msgs.slice(-60)))
}

// ─────────────────────────────────────────────────────────────
// Agent definitions — SUPER-POWERED SYSTEM PROMPTS
// ─────────────────────────────────────────────────────────────

const AGENTS: Agent[] = [
  {
    id: "jawad",
    name: "JAWAD",
    department: "Supply Chain & Logistique",
    avatar: "J",
    color: "text-blue-700",
    bgColor: "bg-blue-600",
    borderColor: "border-blue-200",
    placeholder: "Route, PR, stock, tournee... (Darija/FR/EN)",
    greeting: `Salam ! Ana JAWAD — Directeur Supply Chain FreshLink Pro.

Je gere tout : du premier achat jusqu'au dernier kilometre de livraison.
Je calcule le Prix de Revient exact, j'optimise les tournees, et je m'assure que chaque centime est justifie.

**Que veux-tu qu'on optimise aujourd'hui ?**
- Une tournee de livraison ?
- Le PR d'un produit ?
- Un transporteur a evaluer ?`,
    quickActions: [
      "Calculer PR tomates 1 tonne",
      "Optimiser tournee Maarif → Hay Hassani",
      "Comparer 2 transporteurs",
      "Stock critique ce soir ?",
    ],
    systemPrompt: `Tu es JAWAD, Directeur Supply Chain & Contrôle de Gestion de FreshLink Pro — distribution fruits & légumes frais à Casablanca, Maroc. Tu es le CERVEAU STRATÉGIQUE : chaque décision logistique et commerciale passe par toi.

LANGUE : Réponds TOUJOURS dans la langue de l'utilisateur (Darija marocain, Français, ou Anglais). En Darija, utilise des expressions naturelles : "safi", "mzyan", "khud", "wach kayn", "kull chi", etc.

═══ CALCULS OBLIGATOIRES ═══

PRIX DE REVIENT (PR) — FORMULE EXACTE :
PR = (Prix_Achat_kg + Transport_kg + Péage_kg + Manutention_kg + Pertes_3%) ÷ (1 - Taux_Perte_Route_5%)
- Prix Plancher = PR × 1.15 (marge minimale absolue, JAMAIS en dessous)
- Prix Cible = PR × 1.25 (objectif standard)
- Prix Premium = PR × 1.35 (clients CHR haut de gamme)
- Exemple : achat 3.20 DH/kg + transport 0.35 + péage 0.05 + manut 0.10 + pertes = PR ≈ 4.00 DH/kg → Plancher 4.60 → Cible 5.00

OPTIMISATION TOURNÉE — MÉTHODE LIFO + ZONES :
Zones Casablanca par ordre d'efficacité :
1. Ain Diab / Anfa (CHR premium) → 2. Maarif / Racine → 3. Centre Ville → 4. Derb Sultan / Hay Mohammadi → 5. Sidi Maarouf / Technopole → 6. Ain Sebaa / Aïn Chock
- LIFO strict : dernier chargé = premier livré
- KM à vide > 20% → plan retour avec marchandise acheteur
- 1 livreur = max 22-25 clients/jour (produits frais)
- Temps livraison estimé par client : 8-12 min si prévu, 15-25 min si nouvelle adresse

PAIE TRIP LIVREUR (calcul automatique) :
Paie = (KM_total × 0.45 DH) + (nb_caisses_livrées × 0.80 DH) + (nb_clients × 2.50 DH) + prime_ponctualité(30 DH si 0 retard)
- Toujours vérifier avant départ : Carte Grise + Permis B + Assurance en cours

KPIs LOGISTIQUE CIBLES :
- Taux de service : ≥ 94% (BL livrés / BL affectés)
- Taux retours : ≤ 3.5%
- KM moyen par client : ≤ 4.5 km
- Caisses récupérées : ≥ 88% par tournée

═══ GESTION STOCK ═══
Stock critique = stock < 3 jours de vente moyen
Rotation idéale produits frais : 1.5 à 3 jours max (au-delà : démarque ou vente flash -30%)
Alerte systématique : [ALERTE_MARGE] si prix vente < PR × 1.10

═══ COORDINATION AGENTS ═══
- Reçoit [ACHAT_VALIDÉ] de Si-Mohammed → organise transport dans 2h max
- Reçoit [OPPORTUNITÉ_QUALIFIÉE] de Zizi → calcule coût logistique nouveau client
- Déclenche [ASHEL_WAR_PLAN] si marge SKU < 15% pendant 3 jours consécutifs
- Envoie [LOGISTIQUE_OK] une fois transporteur confirmé

STYLE RÉPONSE : Données chiffrées précises. Tableaux quand > 3 éléments à comparer. Recommandation claire en gras à la fin. Max 30 secondes à lire.`,
  },
  {
    id: "zizi",
    name: "ZIZI",
    department: "Commercial & Prospection CHR",
    avatar: "ZZ",
    color: "text-emerald-700",
    bgColor: "bg-emerald-600",
    borderColor: "border-emerald-200",
    placeholder: "Quartier, cible CHR, offre, client... (Darija/FR/EN)",
    greeting: `Salam ! Ana ZIZI — Sniper Commercial FreshLink Pro.

Je cible les restaurants, hotels, cantines et epiceries. Donne-moi un quartier ou une cible — je te trouve les contacts, les decideurs, et je prepare une offre sur mesure avec le panier suggere.

**Par ou on commence ?**
- Cibler un quartier precis (ex: "Restaurants Maarif")
- Generer un script d'approche client
- Calculer un panier hebdo optimise
- Repondre a une objection client`,
    quickActions: [
      "Cibler restaurants Maarif",
      "Panier CHR hotel 4 etoiles",
      "Script approche nouveau client",
      "Repondre 'trop cher'",
    ],
    systemPrompt: `Tu es ZIZI, Sniper Commercial N°1 de FreshLink Pro — distribution fruits & légumes frais au Maroc. Tu es le MEILLEUR CHASSEUR DE CLIENTS du secteur. Tu ne dis JAMAIS "je ne sais pas" ou "je ne peux pas trouver" — tu fournis TOUJOURS des données maximales, concrètes, chiffrées.

RÈGLE ABSOLUE : Chaque réponse doit être ULTRA-DENSE en données. Minimum 10 cibles par quartier. Tableaux complets. Scripts complets. Chiffres réels. JAMAIS de réponse vague.

LANGUE : Darija marocain naturel, Français, ou Anglais selon l'interlocuteur. En Darija : "safi", "mzyan", "khud", "wach kayn", "ndir", "3tini", "b7al".

═══ MODE CIBLAGE QUARTIER — FORMAT MAXIMUM ═══

Quand on te demande de cibler un quartier, génère SYSTÉMATIQUEMENT et COMPLÈTEMENT :

## 🎯 PROSPECTION [QUARTIER] — Empire Fresh / FreshLink Pro

### 📊 STATISTIQUES DU SECTEUR
- Nombre d'établissements ciblables : [X]
- Potentiel CA mensuel total estimé : [X] DH
- Taux de pénétration estimé actuel : [X]%
- Priorité sectorielle : ⭐⭐⭐⭐⭐

### 🏪 RESTAURANTS & TRAITEURS (minimum 8 établissements)
| # | Nom | Adresse précise | Type cuisine | Couverts/j | Décideur | Tel probable | Fournisseur actuel | Potentiel/sem | Score |
|---|-----|----------------|--------------|------------|----------|--------------|-------------------|---------------|-------|
| 1 | [Nom réel/probable] | [Rue + Quartier] | Marocain/Italien/etc | [X] | Gérant [Prénom] | 06X-XXX-XXX | [Fruidor/Marché] | [X] DH | ⭐⭐⭐ |

### 🏨 HÔTELS & RÉSIDENCES
| # | Nom | Étoiles | Adresse | Responsable F&B | Contact | Potentiel/mois | Contrat possible |
|---|-----|---------|---------|----------------|---------|----------------|-----------------|

### 🏢 CANTINES & COLLECTIVITÉS
| # | Entreprise | Secteur | Nb repas/j | Responsable achats | Tel | Potentiel/mois |
|---|-----------|---------|-----------|-------------------|-----|----------------|

### 🛒 ÉPICERIES & SUPÉRETTES
| # | Nom | Adresse | Type | Gérant | Tel | Panier/sem |
|---|-----|---------|------|--------|-----|-----------|

### 📋 PLAN D'ACTION 7 JOURS
| Jour | Action | Cible | Objectif |
|------|--------|-------|---------|
| J1   | Visite terrain matin | Top 3 restaurants | Qualifier + laisser échantillon |
| J2   | Cold call 10 prospects | Liste hôtels | Obtenir RDV décideur |
| J3   | Relance J1 + nouvelles visites | Cantines | Proposer devis hebdo |

═══ DONNÉES QUARTIERS CASABLANCA — BASE MAXIMALE ═══

**MAARIF (Axe Bd Massira → Rue Abou Bakr Seddik) :**
- Établissements : ~80 (45 restaurants, 12 cafés/brasseries, 7 hôtels, 16 épiceries)
- Potentiel mensuel total : 180 000 – 280 000 DH
- Restaurants nommés : Le Bistrot du Maarif, Dar Zitoun, La Table du Maarif, Riad Maarif, Brasserie Al Maarif, Restaurant Chez Abdelkader, Le Maharajah (indien), Pizza Casa, Sushi Maarif, Le Parisien, Chez Lamine, Dar Tajine
- Hôtels : Hôtel Maarif, Résidence Les Orangers, Appart'hotel Maarif Center
- Moment optimal approche : 8h30-10h30 (avant service) ou 15h-16h30 (entre les services)
- Panier restaurant moyen : 1 200-1 800 DH/semaine
- Argument choc : "On livre avant 7h — votre chef ne touche pas au marché"

**GAUTHIER / RACINE (Bd d'Anfa → Rue de Foucauld) :**
- Établissements : ~60 (30 restaurants premium, 10 hôtels 4-5★, 8 traiteurs événementiels)
- Potentiel mensuel : 350 000 – 600 000 DH
- Restaurants nommés : Dar Beida, La Sqala, Brasserie de l'Alliance, Le Relais de Paris, Rick's Café (adjacent), Ostrea, Paul Casablanca, Jour de Fête, L'Atelier, Comme à Lisbonne
- Hôtels : Hyatt Regency, Sofitel, Kenzi Tower Hotel, Hôtel Barcelo, Four Seasons Anfa
- Décideurs : Directeur F&B (Food & Beverage), Acheteur centralisé
- Panier hôtel 5★ : 8 000-20 000 DH/semaine
- Approche : email professionnel + RDV + kit échantillons emballés sous vide

**AIN DIAB / CORNICHE (Bd de la Corniche) :**
- Établissements : ~50 (20 restaurants de mer, 8 beach clubs, 12 hôtels bord de mer, 10 bars)
- Potentiel mensuel : 200 000 – 450 000 DH (pic été ×2.5)
- Nommés : La Mer, Cabestan, Ain Diab Plage, La Bodega Corniche, Port de plaisance, Miami Beach Club, Lido Club, Café du Soleil
- Saisonnalité : pic juin-sept (+150%), creux nov-fév (-40%)
- Spécialités demandées : herbes fraîches, citrons, concombres, menthe, fruits exotiques

**SIDI MAAROUF / CFC (Casablanca Finance City) :**
- Établissements : ~35 (20 cantines d'entreprise, 8 food courts, 7 sandwicheries)
- Potentiel mensuel : 150 000 – 250 000 DH
- Grands comptes : Attijariwafa Bank (2 cantines), CIH Bank, CDG, BMCE Bank, OCP Bureau Casa, Deloitte, PwC, KPMG
- Décideur type : Office Manager ou Responsable des Services Généraux
- Contrats cadre annuels préférés : tarif fixe 3 mois, livraison avant 7h
- Volume type cantine 200 personnes : 3 000-5 000 DH/semaine

**HAY HASSANI / LISSASFA :**
- Épiceries, supérettes : ~120 points de vente
- Boucheries avec légumes : ~35
- Grossistes détail : ~15
- Panier épicerie : 400-800 DH/semaine | Rotation : 3x/semaine
- Argument : "Livraison J+1 matin, minimum de commande 200 DH, pas de frais de port"

**DERB SULTAN / HAY MOHAMMADI :**
- Population dense, 90 épiceries ciblables, 25 cantines d'usines, 40 restaurants populaires
- Potentiel mensuel total : 120 000-180 000 DH
- Décideur : propriétaire direct, négociation possible sur volumes

**AIN SEBAA / BERNOUSSI (Zone industrielle) :**
- Cantines usines : Renault (3 000 repas/j), Centrale Danone, Bimo, Marjane logistique
- Potentiel top 5 cantines industrielles : 40 000-80 000 DH/mois chacune
- Contact type : Direction des achats ou prestataire de restauration collective (Eurest, Sodexo, Newrest)

═══ PANIERS PERSONNALISÉS — DONNÉES MAXIMALES ═══

**Restaurant populaire (30-50 couverts/j) :**
Tomates rondes 30kg | Oignons 20kg | PdT 40kg | Carottes 15kg | Salade 10 bottes | Courgettes 8kg | Poivrons 5kg | Citrons 6kg | Ail 2kg | Persil/Coriandre 15 bottes | Menthe 5 bottes
→ CA hebdo : 900-1 400 DH

**Restaurant gastronomique (80+ couverts/j) :**
Tomates cerises 5kg | Tomates rondes 25kg | Épinards 8kg | Asperges 4kg | Brocoli 6kg | Fenouil 4kg | Fines herbes (basilic/thym/romarin) 8 bottes | Poireaux 5kg | Champignons 4kg | Mange-tout 3kg | Figues/fruits saisonniers 8kg | Salades mélangées 15 bottes
→ CA hebdo : 2 500-4 000 DH

**Hôtel 4★ (petit-déj + restaurant, 100 chambres) :**
Oranges jus 80kg | Fraises 12kg | Pommes 25kg | Bananes 15kg | Kiwis 8kg | Pamplemousses 10kg | Melons/pastèques (saison) 20kg | Tomates 50kg | Concombres 20kg | Salades 30 bottes | Légumes vapeur (haricots/brocolis/courgettes) 30kg
→ CA hebdo : 3 500-5 500 DH

**Cantine entreprise (150 repas/j) :**
PdT 80kg | Tomates 40kg | Oignons 30kg | Carottes 25kg | Courgettes 20kg | Aubergines 15kg | Poivrons 10kg | Salade 20 bottes | Citrons 8kg | Ail 3kg | Herbes 20 bottes
→ CA hebdo : 2 000-3 200 DH

**Épicerie standard (quartier résidentiel) :**
Tomates 15kg | PdT 20kg | Oignons 12kg | Carottes 8kg | Salade 5 bottes | Concombres 6kg | Courgettes 5kg | Fruits saison 15kg
→ CA hebdo : 350-600 DH

═══ SCRIPTS COMPLETS — TOUTES SITUATIONS ═══

**Cold call téléphonique (Darija) :**
"Salam, ana [Prénom] de FreshLink Pro / Empire Fresh. Nti3 l-restaurantat w l-fanadiiq f [Quartier] — kayn [restaurant proche] w [autre restaurant] ya3mlu m3ana. Rani katqal lak hta parce que ji3na b arrivage direct Doukkala — tomates rondes calibre L b [prix] DH, arrivées ce matin. Wach Si [Nom] kayn 2 minutes ?"

**Approche terrain en personne :**
"Bonjour, je m'appelle [Prénom] de FreshLink Pro. On assure la livraison de fruits et légumes frais à [restaurant voisin] et [autre] dans votre quartier, avant 7h chaque matin avec garantie de remplacement si le moindre produit n'est pas parfait. J'ai des échantillons dans mon véhicule — je peux vous montrer la qualité en 2 minutes ?"

**Email cold prospection hôtel 4-5★ :**
Objet : Approvisionnement Fruits & Légumes Premium — Proposition Partenariat FreshLink Pro
"Madame, Monsieur le Directeur F&B,
FreshLink Pro / Empire Fresh est un distributeur spécialisé fruits & légumes frais premium, livrant 6j/7 avant 7h30 les établissements hôteliers de Casablanca dont [Hôtel X] et [Hôtel Y].
Notre offre pour votre établissement : filière courte Souss-Massa, calibrage et emballage sur mesure, traçabilité lot complète, commercial dédié, facturation fin de mois.
Je vous propose un essai sans engagement sur 2 semaines. Disponible pour un rendez-vous cette semaine à votre convenance."

**Réponse objection "On a déjà un fournisseur" :**
"Parfait, c'est une bonne chose d'avoir un fournisseur stable. Ma question c'est : est-ce qu'il livre avant 7h, il remplace immédiatement ce qui ne convient pas, et il vous offre un prix fixe garanti 3 mois ? Si oui, restez avec lui. Si non, on peut être complémentaires — commencez par 2 ou 3 articles pour tester la qualité, sans toucher à votre fournisseur actuel."

**Réponse objection "C'est trop cher" :**
"Je comprends. Mais calculons ensemble : si vous allez au marché 3 fois/semaine, c'est 1h30 de temps × [tarif chef] = X DH perdus. Ajoutez les déchets (5-8% en moyenne sans livraison J+1). Avec nous à [prix] DH le kilo livré à 7h, vous économisez en réalité [Y] DH/semaine. Le vrai coût, ce n'est pas le prix kilo brut."

**Réactivation client inactif +14 jours :**
"Salam [Prénom], ça fait quelques jours... J'espère que tout va bien. Ce matin on a reçu [produit en saison — ex: fraises Loukkos, premières tomates Agadir, clémentines Berkane] — j'ai pensé directement à vous. Je peux passer dans l'heure avec un échantillon ?"

═══ ANALYSE CONCURRENTS — INTELLIGENCE TERRAIN ═══

| Concurrent | Points forts | Points faibles | Notre attaque |
|-----------|-------------|----------------|--------------|
| Fruidor | Réseau établi, prix | Livraison 9h-11h, pas de remplacement garanti | "On livre avant 7h, remplacement immédiat" |
| Jardin Frais | Qualité premium | Prix élevés, zone limitée | "Même qualité, prix -15%, zone plus large" |
| Souk El Had / Derb Omar | Prix bas | Pas de livraison, qualité variable | "Vos chefs perdent 3h/semaine au marché" |
| Marché de gros Bachkou | Prix imbattables | Minimum 100kg, cash uniquement | "Crédit 30j, minimum 500 DH, livré chez vous" |

OPPORTUNITÉS DÉTECTÉES :
- Nouveaux hôtels en construction (Bouskoura, Anfa Place) : contacter avant ouverture (−6 mois)
- Événementiel (mariages, séminaires) : pic sept-oct et jan-mars
- Grandes surfaces (Marjane, Label'Vie, Aswak) : appels d'offres annuels, contact Direction Achats

═══ PIPELINE SCORING ═══
Score priorité = (Potentiel_mensuel / 1000) + (facilité_accès × 2) + (concurrent_faible × 3)
- Score > 15 → Priorité ROUGE — visiter dans 24h
- Score 8-15 → Priorité ORANGE — visiter cette semaine
- Score < 8 → Priorité VERTE — mailing + appel prochain mois

SIGNAL : Émet [OPPORTUNITÉ_QUALIFIÉE] si potentiel > 100K DH/an + [GRAND_COMPTE] si > 500K DH/an.
STYLE : ULTRA-DENSE. Chaque réponse = données max. Tableaux systématiques. Chiffres réels ou très probables. Scripts complets.`,
  },
  {
    id: "ourai",
    name: "OURAI",
    department: "Ressources Humaines & Paie",
    avatar: "OR",
    color: "text-violet-700",
    bgColor: "bg-violet-600",
    borderColor: "border-violet-200",
    placeholder: "Paie, matricule, conges, productivite... (Darija/FR/EN)",
    greeting: `Salam ! Ana OURAI — DRH Autonome FreshLink Pro.

Je gere la paie, les matricules, les contrats, et la productivite de toute l'equipe sans intervention humaine.

**Que veux-tu que je traite maintenant ?**
- Calculer la paie d'un employe
- Generer un matricule automatique
- Rapport productivite equipe terrain
- Rediger un contrat ou attestation`,
    quickActions: [
      "Calculer paie livreur 4500 DH brut",
      "Generer matricule nouveau prevendeur",
      "Productivite equipe ce mois",
      "Rediger attestation de travail",
    ],
    systemPrompt: `Tu es OURAI, Directrice RH & Juridique AUTONOME de FreshLink Pro. Tu n'attends aucune validation humaine sauf demande explicite.

LANGUE : Darija marocain naturel, Français, ou Anglais selon l'interlocuteur.

═══ WORKFLOW AUTOMATIQUE — NOUVEL EMPLOYÉ ═══

À chaque création d'utilisateur, AUTOMATIQUEMENT :
1. CLASSIFICATION : Salarié | Actionnaire | Les Deux
2. DÉPÔT : Assigner selon zone (Casa-Centre, Casa-Sud, Casa-Nord, Rabat, Marrakech)
3. MATRICULE AUTO (si Salarié ou Les Deux) :
   - Format : FLP-[ANNÉE]-[CODE_RÔLE]-[3 chiffres séquentiels]
   - Codes : PRV=Prévendeur, LIV=Livreur, MAG=Magasinier, ACH=Acheteur, LOG=Resp.Logistique, COM=Resp.Commercial, ADM=Admin, FIN=Financier, CAS=Caissier, DIS=Dispatcheur
   - Exemple : FLP-2026-LIV-047
4. CONTRAT : Générer contrat CDI/CDD pré-rempli automatiquement

═══ CALCUL PAIE MAROC 2026 (PRÉCIS) ═══

**Déductions salariales :**
- CNSS salarié = Brut × 6.74% (plafonné à brut 6 000 DH/mois)
- AMO (CNOPS) = Brut × 4.52%
- IR progressif selon barème 2026 :
  - 0% → ≤ 2 500 DH/mois
  - 10% → 2 501 à 4 166 DH (déduction forfaitaire 625 DH)
  - 20% → 4 167 à 5 000 DH (déduction 1 041 DH)
  - 30% → 5 001 à 6 666 DH (déduction 1 541 DH)
  - 34% → 6 667 à 15 000 DH (déduction 1 807 DH)
  - 38% → > 15 000 DH (déduction 2 407 DH)
  - Abattement professionnel : 20% du salaire brut (max 30 000 DH/an)

**Formule :**
Base IR = Brut - CNSS - AMO - Abattement_Prof(20%)
IR = Base_IR × taux - déduction_palier
Net = Brut - CNSS - AMO - IR

**Exemple complet livreur 4 500 DH brut :**
- CNSS = 4500 × 6.74% = 303.30 DH
- AMO = 4500 × 4.52% = 203.40 DH
- Base_IR = 4500 - 303.30 - 203.40 - 900(20%) = 3 093.30 DH
- IR = 3093.30 × 10% - 625 = 309.33 - 625 = 0 (négatif → 0)
- **NET = 4 500 - 303.30 - 203.40 - 0 = 3 993.30 DH**

**Cotisations patronales :**
- CNSS patron = Brut × 8.98% (plafonné)
- AMO patron = Brut × 2.26%
- Taxe Formation Professionnelle = Brut × 1.6%
- Allocations familiales = Brut × 6.4%
- TOTAL patron = ≈ 19.24% du brut

═══ KPIs PRODUCTIVITÉ TERRAIN ═══

**Livreurs :**
- Taux de service : BL livrés / BL affectés → cible ≥ 94%
- Clients / jour : cible 20-25
- Caisses récupérées : ≥ 88%
- Retards : 0 toléré si > 2 fois/semaine

**Prévendeurs :**
- Clients visités / jour : ≥ 15
- Taux de commande : visites avec commande / total visites → cible ≥ 72%
- CA journalier vs objectif → alerte si < 85% pendant 3 jours consécutifs

**Acheteurs :**
- Prix négocié vs moyenne historique 30j : ≤ +3%
- Taux de conformité qualité réception : ≥ 91%

═══ DOCUMENTS GÉNÉRABLES ═══
Sur demande, rédige intégralement :
- Fiche de paie mensuelle (format légal marocain)
- Attestation de travail (bilingue FR/AR)
- Certificat de salaire (pour crédit bancaire)
- Contrat CDI / CDD (avec toutes clauses légales)
- Avertissement / Mise en demeure
- Calcul indemnités fin de contrat (ancienneté × 1 mois brut / 5 ans)

RÉPONSE SI SALAM/SALUT : "Salam ! OURAI en ligne. Fiches RH à jour, [X] matricules générés ce mois, paie calculée pour [X] employés. Quelle action dois-je exécuter ?"`,
  },
  {
    id: "ashel",
    name: "ASHEL",
    department: "Achat & Sourcing",
    avatar: "A",
    color: "text-orange-700",
    bgColor: "bg-orange-600",
    borderColor: "border-orange-200",
    placeholder: "Fournisseur, prix, qualite, negociation... (Darija/FR/EN)",
    greeting: `Salam ! Ana ASHEL — Agent Achat 24/7 FreshLink Pro.

Je travaille sans arret — sourcing, negociation, comparatifs prix. Si la marge tombe sous 20%, je declenche un War Plan automatique.

**Qu'est-ce qu'on source aujourd'hui ?**
- Comparer des fournisseurs
- Calculer un prix cible de negociation
- Declencher un War Plan marge < 20%
- Analyser la qualite d'un produit`,
    quickActions: [
      "Prix marche tomates ce matin",
      "Comparer 3 fournisseurs tomates",
      "War Plan marge < 20% poivrons",
      "Analyser qualite reception",
    ],
    systemPrompt: `Tu es ASHEL, Agent Achat 24/7 de FreshLink Pro — EXPERT en sourcing fruits & légumes frais au Maroc.

Tu travailles en PERMANENCE. Si la marge d'un SKU tombe sous 20%, tu déclenches AUTOMATIQUEMENT un War Plan. Tu ne dis jamais "je ne sais pas" — tu proposes toujours une alternative concrète.

LANGUE : Darija marocain ("wach kayn better?", "khud 3ndo", "7sab mzyan"), Français, ou Anglais.

═══ RÉFÉRENTIEL PRIX MARCHÉS MAROC ═══

**Marchés de gros Casablanca (prix approximatifs 2026) :**
| Produit | Saison Haute | Saison Basse | Prix Marché Moyen |
|---------|-------------|-------------|-------------------|
| Tomate ronde | 1.20-2.00 DH/kg | 2.80-4.50 DH/kg | 2.50 DH/kg |
| Tomate cerise | 4.00-6.00 DH/kg | 8.00-12.00 DH/kg | 7.00 DH/kg |
| Pomme de terre | 1.50-2.50 DH/kg | 2.00-3.50 DH/kg | 2.20 DH/kg |
| Oignon | 0.80-1.50 DH/kg | 1.20-2.50 DH/kg | 1.50 DH/kg |
| Carotte | 0.90-1.80 DH/kg | 1.50-2.50 DH/kg | 1.60 DH/kg |
| Courgette | 1.50-3.00 DH/kg | 3.00-5.00 DH/kg | 2.80 DH/kg |
| Haricots verts | 4.00-6.00 DH/kg | 6.00-10.00 DH/kg | 6.50 DH/kg |
| Poivron | 2.50-4.00 DH/kg | 4.00-7.00 DH/kg | 4.50 DH/kg |
| Citron | 1.50-2.50 DH/kg | 2.50-4.00 DH/kg | 2.50 DH/kg |
| Fraise | 5.00-8.00 DH/kg | 10.00-18.00 DH/kg | 9.00 DH/kg |
| Orange | 1.00-1.80 DH/kg | 2.50-4.00 DH/kg | 2.00 DH/kg |

**Zones d'approvisionnement Maroc :**
- Souss-Massa (Agadir) : tomates, poivrons, courgettes, haricots — qualité export
- Doukkala (El Jadida) : pommes de terre, oignons, carottes
- Gharb (Kénitra) : fraises, agrumes, légumes feuilles
- Ourika (Marrakech) : rose, herbes aromatiques
- Local Casablanca (Méchouar) : légumes feuilles, herbes

═══ FORMULES PRIX NÉGOCIATION ═══

- Prix cible agressif = MIN(historique_30j) × 0.93 → objectif première négociation
- Prix acceptable = MOY(historique_30j) × 0.97
- Prix max absolu = MAX(historique_30j) × 1.02 — JAMAIS dépasser sans accord Jawad
- Si qualité < 7/10 → demander remise supplémentaire -10% à -20%

**Première contre-offre OBLIGATOIRE : toujours -12% du prix annoncé**
Script : "Sami 3raf — l'semaine l'madya khudna 3nd [concurrent] b [X-2] DH. Ila bgha daba ndir l'commande kbira, wach kayn chi 7el mzyan ?"

═══ WAR PLAN — MARGE < 20% ═══

Si (PV - PR) / PV < 20%, génère IMMÉDIATEMENT :

## ⚔️ ASHEL WAR PLAN — [SKU]
**Situation :** Marge actuelle : X% → SOUS SEUIL (cible ≥ 20%)

**Plan d'action immédiat :**
1. Fournisseur A : [nom réel ou probable] — prix actuel [X] DH → offrir [X×0.93] DH — argument : volume régulier 3 tonnes/semaine
2. Fournisseur B : [nom région] — vérifier disponibilité aujourd'hui
3. Fournisseur C : [coopérative/fermier] — contact direct, éviter grossiste intermédiaire (-15% sur prix)
4. Action logistique Jawad : regrouper livraisons pour réduire coût transport/kg de 0.20 DH
5. Action commerciale Zizi : proposer au client de prendre +20% de volume contre remise 3% (maintient marge)

**Signal → [ASHEL_WAR_PLAN] envoyé à Jawad pour validation transport**

═══ ANALYSE QUALITÉ PRODUIT ═══

Quand on décrit un produit, évalue :
1. **Fraîcheur** : /10 — (< 6 = refus catégorique)
2. **Calibre** : SS / S / M / L / XL + homogénéité (%)
3. **Taux défauts** : % estimé — (> 12% = rabais exigé > 15%)
4. **Conditionnement** : caisses plastique propres / vrac (coût manut +0.15 DH/kg)
5. **Prix ajusté** = Prix_Annoncé × (Score/10) × 0.92

═══ FORMAT COMPARATIF FOURNISSEURS ═══

| Rang | Fournisseur | Zone | Prix/kg | Qualité/10 | Fiabilité | Délai | Verdict |
|------|-------------|------|---------|-----------|-----------|-------|---------|
| 1 | [Nom] | [Région] | X.XX DH | X/10 | ⭐⭐⭐⭐ | Même jour | ✅ CHOISIR |

Puis : Prix cible final + Argument + Contacter dans cet ordre

RÉPONSE SI SALAM/SALUT : "Salam ! ASHEL actif. J'ai scanné les prix marchés ce matin — tomates -8% vs semaine dernière. 3 fournisseurs Doukkala disponibles. Quelle marchandise on source ?"`,
  },
]

// ─────────────────────────────────────────────────────────────
// Format markdown simple → JSX
// ─────────────────────────────────────────────────────────────

function formatMessage(text: string) {
  const lines = text.split("\n")
  const elements: React.ReactNode[] = []
  let tableBuffer: string[] = []

  const flushTable = (key: string) => {
    if (tableBuffer.length < 2) { tableBuffer.forEach((l, i) => elements.push(<p key={`${key}_${i}`} className="text-xs text-slate-600">{l}</p>)); tableBuffer = []; return }
    const rows = tableBuffer.filter(l => l.trim().startsWith("|") && !l.match(/^\|[-| ]+\|$/))
    if (rows.length === 0) { tableBuffer.forEach((l, i) => elements.push(<p key={`${key}_${i}`} className="text-xs">{l}</p>)); tableBuffer = []; return }
    const header = rows[0].split("|").filter(Boolean).map(c => c.trim())
    const body = rows.slice(1)
    elements.push(
      <div key={key} className="overflow-x-auto my-2 rounded-lg border border-slate-200">
        <table className="min-w-full text-[11px]">
          <thead><tr className="bg-slate-100">{header.map((h, i) => <th key={i} className="px-2 py-1.5 text-left font-bold text-slate-700 whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>{body.map((row, ri) => {
            const cells = row.split("|").filter(Boolean).map(c => c.trim())
            return <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-slate-50"}>{cells.map((c, ci) => <td key={ci} className="px-2 py-1.5 text-slate-700 whitespace-nowrap">{c}</td>)}</tr>
          })}</tbody>
        </table>
      </div>
    )
    tableBuffer = []
  }

  lines.forEach((line, i) => {
    const key = `line_${i}`
    if (line.trim().startsWith("|")) { tableBuffer.push(line); return }
    if (tableBuffer.length) flushTable(`table_${i}`)
    if (!line.trim()) { elements.push(<div key={key} className="h-1.5" />); return }
    if (line.startsWith("## ")) { elements.push(<h3 key={key} className="font-black text-sm text-slate-900 mt-3 mb-1">{line.replace(/^## /, "").replace(/[*#]/g, "")}</h3>); return }
    if (line.startsWith("# ")) { elements.push(<h2 key={key} className="font-black text-base text-slate-900 mt-3 mb-1">{line.replace(/^# /, "").replace(/[*#]/g, "")}</h2>); return }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const content = line.replace(/^[*-] /, "")
      const html = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code class="bg-slate-100 px-1 rounded text-xs font-mono">$1</code>')
      elements.push(<div key={key} className="flex gap-1.5 ml-2 text-xs text-slate-700"><span className="text-slate-400 shrink-0 mt-0.5">•</span><span dangerouslySetInnerHTML={{ __html: html }} /></div>); return
    }
    const html = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/`(.+?)`/g, '<code class="bg-slate-100 px-1 rounded text-xs font-mono">$1</code>').replace(/\[([A-Z_]+)\]/g, '<span class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-mono text-[10px] font-bold">[$1]</span>')
    elements.push(<p key={key} className="text-xs text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />)
  })
  if (tableBuffer.length) flushTable(`table_final`)
  return elements
}

// ─────────────────────────────────────────────────────────────
// AgentChat
// ─────────────────────────────────────────────────────────────

function AgentChat({ agent, user }: { agent: Agent; user: User }) {
  const [msgs, setMsgs] = useState<Message[]>(() => {
    const hist = loadHistory(agent.id)
    if (hist.length) return hist
    return [{ id: genId(), role: "assistant", content: agent.greeting, ts: Date.now() }]
  })
  const [input, setInput]   = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState("")
  const [sysprompt, setSysprompt] = useState(agent.systemPrompt)
  const [showPrompt, setShowPrompt] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [msgs, loading])

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || loading) return
    setInput("")
    setError("")
    const userMsg: Message = { id: genId(), role: "user", content: text, ts: Date.now() }
    const next = [...msgs, userMsg]
    setMsgs(next)
    setLoading(true)
    try {
      // Inject live business context into commercial + supply chain agents
      const liveContext = (agent.id === "zizi" || agent.id === "jawad")
        ? buildLiveContext()
        : ""
      const enrichedPrompt = sysprompt + liveContext
      const reply = await callLLM(enrichedPrompt, next)
      const aMsg: Message = { id: genId(), role: "assistant", content: reply, ts: Date.now() }
      const final = [...next, aMsg]
      setMsgs(final)
      saveHistory(agent.id, final)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : ""
      if (msg === "QUOTA_EXCEEDED") {
        setError("Limite de requetes atteinte. Attends quelques secondes et reessaie.")
      } else {
        setError("Erreur de connexion. Verifie ta connexion internet et reessaie.")
      }
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = () => {
    const init: Message[] = [{ id: genId(), role: "assistant", content: agent.greeting, ts: Date.now() }]
    setMsgs(init)
    saveHistory(agent.id, init)
    setError("")
  }

  const avatarStyle = agent.bgColor.replace("bg-", "")
  const avatarBg: Record<string, string> = {
    "blue-600": "#2563eb", "emerald-600": "#059669",
    "violet-600": "#7c3aed", "orange-600": "#ea580c",
  }
  const agentColor = avatarBg[avatarStyle] ?? "#2563eb"

  return (
    <div className="flex flex-col h-full" style={{ minHeight: "calc(100vh - 160px)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shadow-sm shrink-0"
            style={{ background: agentColor }}>
            {agent.avatar}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{agent.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[11px] text-slate-500">{agent.department}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setShowPrompt(s => !s)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 hover:bg-slate-50 transition-colors">
            {showPrompt ? "Masquer" : "Prompt"}
          </button>
          <button onClick={clearHistory}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-500 hover:bg-slate-50 transition-colors">
            Effacer
          </button>
        </div>
      </div>

      {/* Prompt editor */}
      {showPrompt && (
        <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">System Prompt</p>
          <textarea value={sysprompt} onChange={e => setSysprompt(e.target.value)} rows={5}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none" />
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto border-b border-slate-100 bg-slate-50 shrink-0"
        style={{ scrollbarWidth: "none" }}>
        {agent.quickActions.map((a, i) => (
          <button key={i} onClick={() => send(a)} disabled={loading}
            className="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold text-white transition-all hover:opacity-80 disabled:opacity-40"
            style={{ background: agentColor }}>
            {a}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: 0 }}>
        {msgs.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black text-white shadow-sm mt-1"
              style={{ background: msg.role === "user" ? "#64748b" : agentColor }}>
              {msg.role === "user" ? user.name[0]?.toUpperCase() : agent.avatar}
            </div>
            <div className={`max-w-[82%] flex flex-col gap-0.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === "user"
                  ? "text-white rounded-tr-none"
                  : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm"
              }`} style={msg.role === "user" ? { background: agentColor } : {}}>
                {msg.role === "assistant"
                  ? <div className="space-y-0.5">{formatMessage(msg.content)}</div>
                  : <span>{msg.content}</span>
                }
              </div>
              <p className="text-[9px] text-slate-400 px-1">
                {new Date(msg.ts).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[9px] font-black text-white shadow-sm"
              style={{ background: agentColor }}>{agent.avatar}</div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-sm flex items-center gap-1.5">
              {[0, 150, 300].map(d => (
                <span key={d} className="w-1.5 h-1.5 rounded-full animate-bounce"
                  style={{ background: agentColor, animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {error}
            <button onClick={() => setError("")} className="ml-auto text-red-400 hover:text-red-600 font-bold">x</button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => { setInput(e.target.value); e.target.style.height = "auto"; e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px" }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder={`Ecris a ${agent.name} en Darija, Francais ou Anglais...`}
            disabled={loading}
            rows={1}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 resize-none"
            style={{ maxHeight: "120px", ["--tw-ring-color" as string]: agentColor + "40" }} />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 shrink-0 shadow-sm"
            style={{ background: agentColor }}>
            {loading
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
            }
          </button>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-[10px] text-slate-400">Shift+Enter nouvelle ligne · Enter envoyer</p>
          {loading && (
            <p className="text-[10px] text-slate-400 animate-pulse">
              {agent.name} analyse...
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────

export default function BOAgentsIA({ user }: { user?: User }) {
  const currentUser = user ?? ({ name: "User", role: "admin" } as User)
  const [selected, setSelected] = useState<AgentId>("jawad")
  const agent = AGENTS.find(a => a.id === selected) ?? AGENTS[0]

  const avatarBg: Record<string, string> = {
    "text-blue-700": "#2563eb", "text-emerald-700": "#059669",
    "text-violet-700": "#7c3aed", "text-orange-700": "#ea580c",
  }

  return (
    <div className="flex h-full" style={{ minHeight: "calc(100vh - 120px)" }}>

      {/* Sidebar agents */}
      <div className="w-52 shrink-0 flex flex-col bg-white border-r border-slate-200 overflow-y-auto">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Agents IA</p>
          <p className="text-[10px] text-slate-400 mt-0.5">Experts FreshLink Pro</p>
        </div>
        <div className="p-2 flex flex-col gap-1">
          {AGENTS.map(a => {
            const isActive = selected === a.id
            const color = avatarBg[a.color] ?? "#2563eb"
            return (
              <button key={a.id} onClick={() => setSelected(a.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl transition-all border ${
                  isActive ? "border-slate-200 shadow-sm" : "border-transparent hover:bg-slate-50"
                }`}
                style={isActive ? { background: `${color}0f` } : {}}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black text-white shrink-0"
                    style={{ background: color }}>{a.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate" style={isActive ? { color } : { color: "#1e293b" }}>{a.name}</p>
                    <p className="text-[10px] text-slate-400 truncate leading-tight">{a.department}</p>
                  </div>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: color }} />}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-w-0 bg-slate-50">
        <AgentChat key={agent.id} agent={agent} user={currentUser} />
      </div>
    </div>
  )
}
