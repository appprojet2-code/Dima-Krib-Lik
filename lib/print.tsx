// ============================================================
// EMPIRE FRESH — ULTRA-PRO DOCUMENT PRINT ENGINE
// Professional: BL, Invoice, PO, HR Docs, Payslip Excel
// ============================================================

import type { BonLivraison, PurchaseOrder, Salarie } from "@/lib/store"

// ── Brand Config ──────────────────────────────────────────────────────────────
export interface CompanyConfig {
  nom: string
  adresse?: string
  ville?: string
  telephone?: string
  email?: string
  ice?: string
  rc?: string
  if_fiscal?: string
  logo?: string
  couleurEntete?: string      // hex color for header
  mentionsBL?: string
  mentionsFacture?: string
}

// ── HR Doc Data ───────────────────────────────────────────────────────────────
export interface HRDocData {
  docType: string
  titre?: string
  contenu?: string
  employe?: string
  poste?: string
  dateDoc?: string
  societe?: string
  salaire?: number
  salaireNet?: number
  periode?: string
  heuresSup?: number
  primes?: number
  modePaie?: string
  cin?: string
  cnss?: string
  // Extended fields used by BOHRDocuments
  employeNom?: string
  employeRole?: string
  employeEmail?: string
  employePhone?: string
  societeNom?: string
  societeAdresse?: string
  societeTel?: string
  societeIce?: string
  societeRC?: string
  societeIF?: string
  societeLogo?: string
  societeVille?: string
  societePiedPage?: string
  salaireBrut?: number
  netAPayer?: number
  cnssRetenue?: number
  amoRetenue?: number
  irRetenue?: number
  amo?: number
  ir?: number
  modePaie2?: string
  datePaie?: string
  ville?: string
  motif?: string
  civilite?: string
  employeMatricule?: string
  dateEmbauche?: string
}

// ── Payroll calculations (Moroccan law 2024) ──────────────────────────────────
export function calcPayroll(brut: number) {
  const cnss     = Math.min(brut * 0.0448, 268.80)  // 4.48% capped
  const amo      = brut * 0.0226                     // 2.26% AMO
  const brutIR   = brut - cnss - amo
  let ir         = 0
  if      (brutIR <= 2500)  ir = 0
  else if (brutIR <= 4167)  ir = brutIR * 0.10 - 250
  else if (brutIR <= 5000)  ir = brutIR * 0.20 - 667
  else if (brutIR <= 6667)  ir = brutIR * 0.30 - 1167
  else if (brutIR <= 15000) ir = brutIR * 0.34 - 1433
  else                      ir = brutIR * 0.38 - 2033
  ir = Math.max(0, ir)
  const totalRetenues = cnss + amo + ir
  const net = brut - totalRetenues
  return { cnss, amo, ir, totalRetenues, net }
}

// ── Common CSS ────────────────────────────────────────────────────────────────
const BASE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; color: #0f172a; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  @page { margin: 12mm; size: A4; }
  @media print { body { -webkit-print-color-adjust: exact; } }
`

// ── BL Template ───────────────────────────────────────────────────────────────
function blCSS(accent: string) {
  return `
    ${BASE_CSS}
    .doc { max-width: 794px; margin: 0 auto; padding: 28px; }
    .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 3px solid ${accent}; }
    .brand-block { display: flex; flex-direction: column; gap: 3px; }
    .brand-name { font-size: 22px; font-weight: 900; color: ${accent}; letter-spacing: -0.5px; }
    .brand-meta { font-size: 11px; color: #64748b; line-height: 1.6; }
    .doc-block { text-align: right; }
    .doc-title { font-size: 26px; font-weight: 900; color: #0f172a; letter-spacing: -0.5px; }
    .doc-num { font-size: 13px; font-weight: 700; color: ${accent}; margin-top: 2px; }
    .doc-date { font-size: 12px; color: #64748b; margin-top: 3px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .info-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }
    .info-card-title { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 6px; }
    .info-card-value { font-size: 13px; font-weight: 700; color: #0f172a; }
    .info-card-sub { font-size: 11px; color: #64748b; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead tr { background: ${accent}; color: #fff; }
    thead th { padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
    thead th:last-child, thead th.right { text-align: right; }
    tbody tr { border-bottom: 1px solid #f1f5f9; }
    tbody tr:nth-child(even) { background: #fafafa; }
    tbody td { padding: 9px 12px; font-size: 12px; color: #1e293b; }
    tbody td.right { text-align: right; font-weight: 600; }
    .totals-block { display: flex; justify-content: flex-end; margin-bottom: 24px; }
    .totals-table { width: 280px; }
    .totals-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
    .totals-row.final { padding: 10px 0; border-top: 2px solid ${accent}; border-bottom: none; }
    .totals-row.final .label { font-size: 13px; font-weight: 800; color: #0f172a; }
    .totals-row.final .value { font-size: 16px; font-weight: 900; color: ${accent}; }
    .totals-row .label { color: #64748b; font-weight: 500; }
    .totals-row .value { font-weight: 700; color: #0f172a; }
    .signature-block { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
    .sig-box { text-align: center; }
    .sig-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 50px; }
    .sig-line { border-top: 1px dashed #cbd5e1; padding-top: 6px; font-size: 10px; color: #94a3b8; }
    .mentions { margin-top: 20px; font-size: 9px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 12px; text-align: center; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; }
    .badge-green { background: #dcfce7; color: #15803d; }
    .badge-orange { background: #fff7ed; color: #c2410c; }
  `
}

// ── Print BL ──────────────────────────────────────────────────────────────────
// ── Default Empire Fresh company config ───────────────────────────────────────
export const EMPIRE_FRESH_CONFIG: CompanyConfig = {
  nom: "Empire Fresh",
  adresse: "Zone Industrielle, Casablanca",
  ville: "Casablanca, Maroc",
  telephone: "+212 5XX-XXXXXX",
  email: "contact@empirefresh.ma",
  ice: "000000000000000",
  rc: "XXXXXX",
  if_fiscal: "XXXXXXXX",
  logo: "/empire-fresh-logo.png",
  couleurEntete: "#1a4f2a",
  mentionsBL: "Empire Fresh — Fruit & Vegetable Distribution Network, Morocco. Marchandises voyageant aux risques et perils du destinataire.",
  mentionsFacture: "Merci de regler sous 30 jours. Tout retard entraine des penalites de 1,5% par mois. ICE inclus sur la presente facture.",
}

export function printBL(bl: BonLivraison, company?: CompanyConfig) {
  const cfg = { ...EMPIRE_FRESH_CONFIG, ...company }
  const accent = cfg.couleurEntete ?? "#1a4f2a"
  const goldAccent = "#b8962e"
  const companyNom = cfg.nom ?? "Empire Fresh"
  const now = new Date()
  const dateStr = bl.date ?? now.toLocaleDateString("fr-FR")
  const blId = (bl as unknown as { numero?: string }).numero ?? bl.id

  const subtotal = bl.lignes.reduce((s, l) => s + l.total, 0)
  const caisses = bl.montantCaisses ?? 0
  const totalTTC = bl.montantTTC + caisses

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>BL ${blId}</title>
  <style>
    ${blCSS(accent)}
    .ef-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:18px; border-bottom:4px solid ${accent}; }
    .ef-brand { display:flex; align-items:center; gap:14px; }
    .ef-logo { width:72px; height:72px; object-fit:contain; }
    .ef-brand-text { display:flex; flex-direction:column; gap:2px; }
    .ef-company { font-size:20px; font-weight:900; color:${accent}; letter-spacing:-0.3px; line-height:1; }
    .ef-company span { color:${goldAccent}; }
    .ef-tagline { font-size:9px; font-weight:700; color:${goldAccent}; letter-spacing:1.5px; text-transform:uppercase; }
    .ef-contact { font-size:10px; color:#475569; line-height:1.6; margin-top:4px; }
    .ef-doc-block { text-align:right; }
    .ef-doc-title { font-size:28px; font-weight:900; color:#0f172a; letter-spacing:-0.5px; text-transform:uppercase; }
    .ef-doc-accent { width:40px; height:4px; background:${goldAccent}; margin:6px 0 6px auto; border-radius:2px; }
    .ef-doc-num { font-size:14px; font-weight:800; color:${accent}; }
    .ef-doc-date { font-size:11px; color:#64748b; margin-top:2px; }
  </style>
</head>
<body>
<div class="doc">
  <div class="ef-header">
    <div class="ef-brand">
      <img src="/empire-fresh-logo.png" alt="Empire Fresh" class="ef-logo" onerror="this.style.display='none'" />
      <div class="ef-brand-text">
        <div class="ef-company">Empire <span>Fresh</span></div>
        <div class="ef-tagline">Fruit &amp; Vegetable Distribution Network</div>
        <div class="ef-contact">
          ${cfg.adresse ?? ""}<br>
          ${cfg.ville ?? ""}${cfg.telephone ? " &mdash; " + cfg.telephone : ""}<br>
          ${cfg.ice ? "ICE: " + cfg.ice : ""}${cfg.rc ? " &mdash; RC: " + cfg.rc : ""}
        </div>
      </div>
    </div>
    <div class="ef-doc-block">
      <div class="ef-doc-title">Bon de Livraison</div>
      <div class="ef-doc-accent"></div>
      <div class="ef-doc-num">${blId}</div>
      <div class="ef-doc-date">${dateStr}</div>
      <div style="margin-top:8px"><span class="badge badge-green">${bl.statut?.toUpperCase() ?? "EMIS"}</span></div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-card">
      <div class="info-card-title">Client / Destinataire</div>
      <div class="info-card-value">${bl.clientNom}</div>
      <div class="info-card-sub">${bl.secteur ?? ""} — ${bl.zone ?? ""}</div>
    </div>
    <div class="info-card">
      <div class="info-card-title">Informations livraison</div>
      <div class="info-card-value">Livreur: ${bl.livreurNom}</div>
      <div class="info-card-sub">Commercial: ${bl.prevendeurNom ?? ""}</div>
      ${bl.heureLivraisonReelle ? `<div class="info-card-sub">Heure livraison: ${bl.heureLivraisonReelle}</div>` : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:40%">Designation</th>
        <th>Unite</th>
        <th class="right">Quantite</th>
        <th class="right">Prix U. HT</th>
        <th class="right">Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${bl.lignes.map(l => `
        <tr>
          <td><strong>${l.articleNom}</strong></td>
          <td>${l.unite ?? "kg"}</td>
          <td class="right">${l.quantite.toLocaleString("fr-MA")}</td>
          <td class="right">${(l.prixUnitaire ?? 0).toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td>
          <td class="right">${l.total.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td>
        </tr>`).join("")}
    </tbody>
  </table>

  <div class="totals-block">
    <div class="totals-table">
      <div class="totals-row">
        <span class="label">Sous-total HT</span>
        <span class="value">${subtotal.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span>
      </div>
      ${caisses > 0 ? `<div class="totals-row"><span class="label">Caisses (${bl.nbCaisseGros ?? 0} gros / ${bl.nbCaisseDemi ?? 0} demi)</span><span class="value">${caisses.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span></div>` : ""}
      <div class="totals-row">
        <span class="label">TVA (0%)</span>
        <span class="value">0,00 DH</span>
      </div>
      <div class="totals-row final">
        <span class="label">TOTAL TTC</span>
        <span class="value">${totalTTC.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span>
      </div>
    </div>
  </div>

  <div class="signature-block">
    <div class="sig-box">
      <div class="sig-label">Signature Livreur</div>
      <div class="sig-line">${bl.livreurNom}</div>
    </div>
    <div class="sig-box">
      <div class="sig-label">Signature Client / Cachet</div>
      <div class="sig-line">${bl.clientNom}</div>
    </div>
  </div>

  ${company?.mentionsBL ? `<div class="mentions">${company.mentionsBL}</div>` : `<div class="mentions">Document non contractuel — Litige a signaler sous 48h — Merci de votre confiance.</div>`}
</div>
<script>window.onload=()=>{window.print();}</script>
</body>
</html>`

  const w = window.open("", "_blank", "width=850,height=1100")
  if (w) { w.document.write(html); w.document.close() }
}

// ── Print Ultra-Pro Invoice ───────────────────────────────────────────────────
export function printFacture(bl: BonLivraison, factureNum: string, company?: CompanyConfig) {
  const cfg = { ...EMPIRE_FRESH_CONFIG, ...company }
  const accent = cfg.couleurEntete ?? "#1a4f2a"
  const goldAccent = "#b8962e"
  const companyNom = cfg.nom ?? "Empire Fresh"
  const dateStr = bl.date ?? new Date().toLocaleDateString("fr-FR")
  const subtotal = bl.lignes.reduce((s, l) => s + l.total, 0)
  const tva = subtotal * 0.0  // adjust TVA here
  const total = subtotal + tva + (bl.montantCaisses ?? 0)

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Facture ${factureNum}</title>
  <style>${blCSS(accent)}
    .invoice-watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-30deg); font-size: 96px; font-weight: 900; color: rgba(0,0,0,0.03); white-space: nowrap; z-index: 0; pointer-events: none; }
    .payment-info { background: linear-gradient(135deg, ${accent}18, ${accent}08); border: 1px solid ${accent}30; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; }
    .payment-info-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: ${accent}; margin-bottom: 6px; }
  </style>
</head>
<body>
<div class="invoice-watermark">FACTURE</div>
<div class="doc">
  <div class="header">
    <div class="brand-block">
      ${company?.logo ? `<img src="${company.logo}" style="height:48px;object-fit:contain;margin-bottom:6px;" alt="Logo" />` : `<div class="brand-name">${companyNom}</div>`}
      <div class="brand-meta">
        ${company?.adresse ? company.adresse + "<br>" : ""}
        ${company?.ville ?? ""}${company?.telephone ? " — Tel: " + company.telephone : ""}
        ${company?.ice ? "<br>ICE: " + company.ice : ""}${company?.if_fiscal ? " — IF: " + company.if_fiscal : ""}
        ${company?.rc ? " — RC: " + company.rc : ""}
      </div>
    </div>
    <div class="doc-block">
      <div class="doc-title">FACTURE</div>
      <div class="doc-num">${factureNum}</div>
      <div class="doc-date">Date: ${dateStr}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-card">
      <div class="info-card-title">Facture a</div>
      <div class="info-card-value">${bl.clientNom}</div>
      <div class="info-card-sub">${bl.secteur ?? ""} — ${bl.zone ?? ""}</div>
    </div>
    <div class="info-card">
      <div class="info-card-title">Reference BL</div>
      <div class="info-card-value">${(bl as unknown as { numero?: string }).numero ?? bl.id}</div>
      <div class="info-card-sub">Commercial: ${bl.prevendeurNom ?? ""}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:40%">Designation</th>
        <th>Unite</th>
        <th class="right">Qte</th>
        <th class="right">P.U. HT</th>
        <th class="right">Montant HT</th>
      </tr>
    </thead>
    <tbody>
      ${bl.lignes.map((l, i) => `<tr><td>${i + 1}. <strong>${l.articleNom}</strong></td><td>${l.unite ?? "kg"}</td><td class="right">${l.quantite}</td><td class="right">${(l.prixUnitaire ?? 0).toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td><td class="right">${l.total.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td></tr>`).join("")}
    </tbody>
  </table>

  <div class="totals-block">
    <div class="totals-table">
      <div class="totals-row"><span class="label">Total HT</span><span class="value">${subtotal.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span></div>
      ${(bl.montantCaisses ?? 0) > 0 ? `<div class="totals-row"><span class="label">Caisses</span><span class="value">${(bl.montantCaisses!).toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span></div>` : ""}
      <div class="totals-row"><span class="label">TVA (0%)</span><span class="value">0,00 DH</span></div>
      <div class="totals-row final"><span class="label">NET A PAYER</span><span class="value">${total.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span></div>
    </div>
  </div>

  <div class="payment-info">
    <div class="payment-info-title">Modalites de paiement</div>
    <div style="font-size:12px;color:#1e293b;">Paiement a reception — Merci de mentionner le numero de facture lors du reglement.<br>${company?.mentionsFacture ?? "Tout retard de paiement entraîne des penalites de 1.5% par mois."}</div>
  </div>

  <div class="signature-block">
    <div class="sig-box"><div class="sig-label">Etablie par</div><div class="sig-line">${companyNom}</div></div>
    <div class="sig-box"><div class="sig-label">Bon pour accord</div><div class="sig-line">${bl.clientNom}</div></div>
  </div>
</div>
<script>window.onload=()=>{window.print();}</script>
</body>
</html>`

  const w = window.open("", "_blank", "width=850,height=1100")
  if (w) { w.document.write(html); w.document.close() }
}

// ── Print Ultra-Pro Purchase Order ────────────────────────────────────────────
export function printPurchaseOrder(po: PurchaseOrder, company?: CompanyConfig) {
  const cfg = { ...EMPIRE_FRESH_CONFIG, ...company }
  const accent = cfg.couleurEntete ?? "#1a4f2a"
  const goldAccent = "#b8962e"
  const companyNom = cfg.nom ?? "Empire Fresh"
  const dateStr = po.date ?? new Date().toLocaleDateString("fr-FR")
  const total = po.total

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>PO ${po.id}</title>
  <style>${blCSS(accent)}
    .po-header-stripe { height: 6px; background: linear-gradient(90deg, ${accent}, ${accent}80); border-radius: 3px; margin-bottom: 24px; }
    .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; }
    .status-ouvert { background: #dbeafe; color: #1d4ed8; }
    .status-envoye { background: #fef9c3; color: #a16207; }
    .status-receptionne { background: #dcfce7; color: #15803d; }
    .conditions-box { background: #f8fafc; border-left: 4px solid ${accent}; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 20px; }
  </style>
</head>
<body>
<div class="doc">
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;padding-bottom:16px;border-bottom:4px solid ${accent};">
    <div style="display:flex;align-items:center;gap:12px;">
      <img src="/empire-fresh-logo.png" alt="Empire Fresh" style="width:64px;height:64px;object-fit:contain;" onerror="this.style.display='none'" />
      <div>
        <div style="font-size:18px;font-weight:900;color:${accent};">Empire <span style="color:${goldAccent};">Fresh</span></div>
        <div style="font-size:9px;font-weight:700;color:${goldAccent};letter-spacing:1.5px;text-transform:uppercase;">Fruit &amp; Vegetable Distribution</div>
        <div style="font-size:10px;color:#475569;margin-top:3px;line-height:1.5;">
          ${cfg.adresse ?? ""} — ${cfg.ville ?? ""}<br>
          Tel: ${cfg.telephone ?? ""} &mdash; ICE: ${cfg.ice ?? ""}<br>
          IF: ${cfg.if_fiscal ?? ""} &mdash; RC: ${cfg.rc ?? ""}
        </div>
      </div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:26px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;text-transform:uppercase;">Bon de Commande</div>
      <div style="width:36px;height:4px;background:${goldAccent};margin:6px 0 6px auto;border-radius:2px;"></div>
      <div style="font-size:14px;font-weight:800;color:${accent};">PO-${po.id.slice(0, 8).toUpperCase()}</div>
      <div style="font-size:11px;color:#64748b;">Date: ${dateStr}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-card">
      <div class="info-card-title">Fournisseur</div>
      <div class="info-card-value">${po.fournisseurNom}</div>
      <div class="info-card-sub">${po.fournisseurEmail ?? ""}</div>
    </div>
    <div class="info-card">
      <div class="info-card-title">Acheteur / Emis par</div>
      <div class="info-card-value">${companyNom}</div>
      <div class="info-card-sub">Ref interne: PO-${po.id.slice(0, 8).toUpperCase()}</div>
      ${po.depotNom ? `<div class="info-card-sub">Depot: ${po.depotNom}</div>` : ""}
    </div>
  </div>

  <div class="conditions-box">
    <div style="font-size:11px;font-weight:700;color:${accent};margin-bottom:4px;">CONDITIONS DE LIVRAISON</div>
    <div style="font-size:12px;color:#1e293b;">Livraison dans les meilleurs delais — Qualite conforme aux specifications — Bon etat sanitaire obligatoire.</div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:45%">Designation</th>
        <th>Unite</th>
        <th class="right">Quantite commandee</th>
        <th class="right">Prix unitaire HT</th>
        <th class="right">Total HT</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${po.articleNom}</strong></td>
        <td>${po.articleUnite}</td>
        <td class="right"><strong>${po.quantite.toLocaleString("fr-MA")}</strong></td>
        <td class="right">${po.prixUnitaire.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td>
        <td class="right"><strong>${total.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="totals-block">
    <div class="totals-table">
      <div class="totals-row final">
        <span class="label">TOTAL A REGLER</span>
        <span class="value">${total.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span>
      </div>
    </div>
  </div>

  ${po.notes ? `<div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 14px;margin-bottom:20px;font-size:12px;color:#92400e;"><strong>Notes:</strong> ${po.notes}</div>` : ""}

  <div class="signature-block">
    <div class="sig-box"><div class="sig-label">Approuve par (Acheteur)</div><div class="sig-line">${companyNom}</div></div>
    <div class="sig-box"><div class="sig-label">Confirme par (Fournisseur)</div><div class="sig-line">${po.fournisseurNom}</div></div>
  </div>

  <div class="mentions">PO genere automatiquement — Valable 48h — ${companyNom} se reserve le droit d'annuler en cas de non-conformite.</div>
</div>
<script>window.onload=()=>{window.print();}</script>
</body>
</html>`

  const w = window.open("", "_blank", "width=850,height=1100")
  if (w) { w.document.write(html); w.document.close() }
}

// ── Print HR Document ─────────────────────────────────────────────────────────
export function printHRDoc(data: HRDocData, company?: CompanyConfig) {
  const cfg = { ...EMPIRE_FRESH_CONFIG, ...company }
  const accent = cfg.couleurEntete ?? "#1a4f2a"
  const goldAccent = "#b8962e"
  const companyNom = data.societe ?? cfg.nom ?? "Empire Fresh"

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>${data.titre}</title>
  <style>
    ${BASE_CSS}
    body { padding: 0; }
    .doc { max-width: 700px; margin: 0 auto; padding: 40px 50px; }
    .letterhead { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 36px; padding-bottom: 18px; border-bottom: 4px solid ${accent}; }
    .co-brand { display: flex; align-items: center; gap: 12px; }
    .co-logo { width: 56px; height: 56px; object-fit: contain; }
    .co-name { font-size: 20px; font-weight: 900; color: ${accent}; line-height: 1; }
    .co-name span { color: ${goldAccent}; }
    .co-tag { font-size: 8px; font-weight: 700; color: ${goldAccent}; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 2px; }
    .co-meta { font-size: 10px; color: #64748b; margin-top: 4px; line-height: 1.6; }
    .doc-ref { text-align: right; }
    .doc-ref-title { font-size: 15px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; }
    .doc-ref-accent { width: 30px; height: 3px; background: ${goldAccent}; margin: 5px 0 5px auto; border-radius: 2px; }
    .doc-ref-date { font-size: 11px; color: #64748b; margin-top: 4px; }
    .doc-subject { font-size: 14px; font-weight: 800; color: ${accent}; margin-bottom: 28px; padding: 10px 14px; border-left: 4px solid ${accent}; background: ${accent}08; border-radius: 0 8px 8px 0; }
    .doc-body { font-size: 13px; line-height: 1.9; color: #1e293b; white-space: pre-wrap; }
    .emp-info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px 16px; margin: 20px 0; }
    .emp-info-box .row { display: flex; gap: 8px; font-size: 12px; color: #1e293b; margin-bottom: 4px; }
    .emp-info-box .lbl { font-weight: 700; min-width: 140px; color: #64748b; }
    .sig-area { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .sig-box { }
    .sig-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 50px; }
    .sig-line { border-top: 1px dashed #cbd5e1; padding-top: 6px; font-size: 11px; color: #64748b; font-weight: 600; }
    .stamp-area { margin-top: 20px; width: 100px; height: 100px; border: 2px dashed #cbd5e1; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; color: #cbd5e1; font-weight: 700; text-transform: uppercase; text-align: center; }
    .confidential { text-align: center; margin-top: 30px; font-size: 9px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
  </style>
</head>
<body>
<div class="doc">
  <div class="letterhead">
    <div class="co-brand">
      <img src="/empire-fresh-logo.png" alt="Empire Fresh" class="co-logo" onerror="this.style.display='none'" />
      <div>
        <div class="co-name">Empire <span>Fresh</span></div>
        <div class="co-tag">Fruit &amp; Vegetable Distribution</div>
        <div class="co-meta">
          ${cfg.adresse ?? ""}${cfg.ville ? " — " + cfg.ville : ""}<br>
          ${cfg.telephone ? "Tel: " + cfg.telephone : ""}${cfg.rc ? " &mdash; RC: " + cfg.rc : ""}
        </div>
      </div>
    </div>
    <div class="doc-ref">
      <div class="doc-ref-title">${data.titre}</div>
      <div class="doc-ref-accent"></div>
      <div class="doc-ref-date">Date: ${data.dateDoc ?? new Date().toLocaleDateString("fr-FR")}</div>
    </div>
  </div>

  <div class="doc-subject">Objet: ${data.titre}</div>

  ${data.employe ? `
  <div class="emp-info-box">
    ${data.employe ? `<div class="row"><span class="lbl">Employe(e):</span> <span>${data.employe}</span></div>` : ""}
    ${data.poste ? `<div class="row"><span class="lbl">Poste:</span> <span>${data.poste}</span></div>` : ""}
    ${data.cin ? `<div class="row"><span class="lbl">CIN:</span> <span>${data.cin}</span></div>` : ""}
    ${data.cnss ? `<div class="row"><span class="lbl">N° CNSS:</span> <span>${data.cnss}</span></div>` : ""}
  </div>` : ""}

  <div class="doc-body">${data.contenu}</div>

  <div class="sig-area">
    <div class="sig-box">
      <div class="sig-label">Direction / Employeur</div>
      <div class="stamp-area">CACHET<br>ET<br>SIGNATURE</div>
    </div>
    <div class="sig-box">
      <div class="sig-label">${data.employe ?? "Employe(e)"} — Lu et approuve</div>
      <div class="sig-line" style="margin-top:50px;">${data.employe ?? ""}</div>
    </div>
  </div>

  <div class="confidential">Document confidentiel — ${companyNom} — ${new Date().getFullYear()}</div>
</div>
<script>window.onload=()=>{window.print();}</script>
</body>
</html>`

  const w = window.open("", "_blank", "width=750,height=1000")
  if (w) { w.document.write(html); w.document.close() }
}

// ── Print Payslip (Fiche de paie ultra-pro) ───────────────────────────────────
export function printFichePaie(salarie: Salarie | null, brut: number, periode: string, heuresSup = 0, primes = 0, modePaie = "virement", company?: CompanyConfig) {
  const cfg = { ...EMPIRE_FRESH_CONFIG, ...company }
  const accent = cfg.couleurEntete ?? "#1a4f2a"
  const companyNom = cfg.nom ?? "Empire Fresh"
  const calc = calcPayroll(brut + primes)
  const totalBrut = brut + primes
  const brutSup = heuresSup > 0 ? Math.round((brut / 208) * 1.25 * heuresSup) : 0

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Bulletin de paie — ${salarie ? salarie.nom + " " + salarie.prenom : "Salarie"}</title>
  <style>
    ${BASE_CSS}
    .doc { max-width: 720px; margin: 0 auto; padding: 28px 32px; }
    .header-stripe { height: 8px; background: linear-gradient(90deg, ${accent}, ${accent}99); border-radius: 4px; margin-bottom: 20px; }
    .slip-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 22px; padding-bottom: 16px; border-bottom: 2px solid #e2e8f0; }
    .co-name { font-size: 18px; font-weight: 900; color: ${accent}; }
    .co-meta { font-size: 10px; color: #64748b; margin-top: 3px; line-height: 1.5; }
    .slip-title-block { text-align: right; }
    .slip-title { font-size: 18px; font-weight: 900; text-transform: uppercase; color: #0f172a; letter-spacing: 1px; }
    .slip-periode { font-size: 12px; font-weight: 700; color: ${accent}; margin-top: 2px; }
    .emp-section { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
    .emp-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 14px; }
    .emp-card-title { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 5px; }
    .emp-row { display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; }
    .emp-lbl { color: #64748b; font-weight: 500; }
    .emp-val { color: #0f172a; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    .tbl-header { background: ${accent}; color: #fff; }
    .tbl-header th { padding: 9px 12px; text-align: left; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; }
    .tbl-header th.right { text-align: right; }
    .tbl-section { background: #f1f5f9; }
    .tbl-section td { padding: 6px 12px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #475569; }
    tr.item { border-bottom: 1px solid #f1f5f9; }
    tr.item:last-child { border-bottom: none; }
    tr.item td { padding: 7px 12px; font-size: 12px; color: #1e293b; }
    td.right { text-align: right; }
    td.amount { text-align: right; font-weight: 700; color: #0f172a; }
    td.deduction { text-align: right; font-weight: 700; color: #dc2626; }
    .net-block { background: linear-gradient(135deg, ${accent}, ${accent}cc); color: #fff; border-radius: 14px; padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .net-label { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    .net-amount { font-size: 28px; font-weight: 900; }
    .net-mode { font-size: 10px; opacity: 0.85; margin-top: 2px; }
    .footer-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 20px; }
    .sig-box { text-align: center; }
    .sig-lbl { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin-bottom: 40px; }
    .sig-line { border-top: 1px dashed #cbd5e1; padding-top: 5px; font-size: 10px; color: #64748b; font-weight: 600; }
    .legal { text-align: center; font-size: 9px; color: #cbd5e1; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-top: 14px; }
  </style>
</head>
<body>
<div class="doc">
  <div class="header-stripe"></div>
  <div class="slip-header">
    <div style="display:flex;align-items:center;gap:10px;">
      <img src="/empire-fresh-logo.png" alt="Empire Fresh" style="width:48px;height:48px;object-fit:contain;" onerror="this.style.display='none'" />
      <div>
        <div class="co-name">${companyNom}</div>
        <div class="co-meta">
          ${cfg.adresse ?? ""}${cfg.ville ? " — " + cfg.ville : ""}
          ${cfg.ice ? "<br>ICE: " + cfg.ice : ""}
        </div>
      </div>
    </div>
    <div class="slip-title-block">
      <div class="slip-title">Bulletin de Paie</div>
      <div class="slip-periode">${periode}</div>
    </div>
  </div>

  <div class="emp-section">
    <div class="emp-card">
      <div class="emp-card-title">Employe(e)</div>
      <div class="emp-row"><span class="emp-lbl">Nom complet</span><span class="emp-val">${salarie ? `${salarie.civilite} ${salarie.nom} ${salarie.prenom}` : "—"}</span></div>
      <div class="emp-row"><span class="emp-lbl">Poste</span><span class="emp-val">${salarie?.poste ?? "—"}</span></div>
      <div class="emp-row"><span class="emp-lbl">CIN</span><span class="emp-val">${salarie?.cin ?? "—"}</span></div>
      <div class="emp-row"><span class="emp-lbl">N° CNSS</span><span class="emp-val">${salarie?.cnss ?? "—"}</span></div>
      <div class="emp-row"><span class="emp-lbl">Date embauche</span><span class="emp-val">${salarie?.dateEmbauche ?? "—"}</span></div>
    </div>
    <div class="emp-card">
      <div class="emp-card-title">Periode & Paiement</div>
      <div class="emp-row"><span class="emp-lbl">Periode</span><span class="emp-val">${periode}</span></div>
      <div class="emp-row"><span class="emp-lbl">Mode paiement</span><span class="emp-val">${modePaie.toUpperCase()}</span></div>
      <div class="emp-row"><span class="emp-lbl">Banque</span><span class="emp-val">${salarie?.banque ?? "—"}</span></div>
      <div class="emp-row"><span class="emp-lbl">RIB</span><span class="emp-val">${salarie?.numCompteBancaire ?? "—"}</span></div>
      <div class="emp-row"><span class="emp-lbl">Contrat</span><span class="emp-val">${salarie?.typeContrat?.toUpperCase() ?? "CDI"}</span></div>
    </div>
  </div>

  <!-- Gains -->
  <table>
    <thead class="tbl-header">
      <tr><th>Designation</th><th class="right">Base</th><th class="right">Taux</th><th class="right">Montant (DH)</th></tr>
    </thead>
    <tbody>
      <tr class="tbl-section"><td colspan="4">Remuneration Brute</td></tr>
      <tr class="item"><td>Salaire de base</td><td class="right">${brut.toLocaleString("fr-MA", { minimumFractionDigits: 2 })}</td><td class="right">100%</td><td class="amount">${brut.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td></tr>
      ${heuresSup > 0 ? `<tr class="item"><td>Heures supplementaires (${heuresSup}h)</td><td class="right">${heuresSup}h</td><td class="right">125%</td><td class="amount">${brutSup.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td></tr>` : ""}
      ${primes > 0 ? `<tr class="item"><td>Prime exceptionnelle</td><td class="right">—</td><td class="right">—</td><td class="amount">${primes.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td></tr>` : ""}
      <tr class="item" style="background:#f0fdf4;font-weight:700;"><td><strong>TOTAL BRUT</strong></td><td></td><td></td><td class="amount" style="color:#15803d;"><strong>${totalBrut.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</strong></td></tr>
      <!-- Deductions -->
      <tr class="tbl-section"><td colspan="4">Cotisations & Retenues</td></tr>
      <tr class="item"><td>CNSS Salariale (4.48% plafonne)</td><td class="right">${totalBrut.toLocaleString("fr-MA", { minimumFractionDigits: 2 })}</td><td class="right">4.48%</td><td class="deduction">-${calc.cnss.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td></tr>
      <tr class="item"><td>AMO (Assurance Maladie Obligatoire)</td><td class="right">${totalBrut.toLocaleString("fr-MA", { minimumFractionDigits: 2 })}</td><td class="right">2.26%</td><td class="deduction">-${calc.amo.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td></tr>
      <tr class="item"><td>IR (Impot sur le Revenu)</td><td class="right">${(totalBrut - calc.cnss - calc.amo).toLocaleString("fr-MA", { minimumFractionDigits: 2 })}</td><td class="right">Bareme</td><td class="deduction">-${calc.ir.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td></tr>
      ${(salarie?.avances ?? 0) > 0 ? `<tr class="item"><td>Avance sur salaire</td><td class="right">—</td><td class="right">—</td><td class="deduction">-${(salarie?.avances ?? 0).toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td></tr>` : ""}
      <tr class="item" style="background:#fef2f2;font-weight:700;"><td><strong>TOTAL RETENUES</strong></td><td></td><td></td><td class="deduction"><strong>-${(calc.totalRetenues + (salarie?.avances ?? 0)).toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</strong></td></tr>
    </tbody>
  </table>

  <div class="net-block">
    <div>
      <div class="net-label">NET A PAYER</div>
      <div class="net-mode">Mode: ${modePaie.toUpperCase()}</div>
    </div>
    <div class="net-amount">${(calc.net - (salarie?.avances ?? 0)).toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</div>
  </div>

  <div class="footer-grid">
    <div class="sig-box"><div class="sig-lbl">Signature Employeur</div><div class="sig-line">${companyNom}</div></div>
    <div class="sig-box"><div class="sig-lbl">Signature Employe(e) — Recu</div><div class="sig-line">${salarie ? salarie.nom + " " + salarie.prenom : "—"}</div></div>
  </div>

  <div class="legal">Bulletin de salaire — ${companyNom} — ${periode} — Confidentiel</div>
</div>
<script>window.onload=()=>{window.print();}</script>
</body>
</html>`

  const w = window.open("", "_blank", "width=750,height=1100")
  if (w) { w.document.write(html); w.document.close() }
}

// ── Download HR Doc as Word (.doc) ────────────────────────────────────────────
export function downloadHRDocAsWord(data: HRDocData, company?: CompanyConfig) {
  const cfg = { ...EMPIRE_FRESH_CONFIG, ...company }
  const companyNom = data.societe ?? cfg.nom ?? "Empire Fresh"
  const content = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="UTF-8"><style>body{font-family:Times New Roman,serif;font-size:12pt;line-height:1.8;margin:3cm;color:#000}h1{font-size:16pt;font-weight:bold;text-align:center;margin-bottom:20pt}h2{font-size:13pt;font-weight:bold;margin-top:14pt}.header{display:flex;justify-content:space-between;margin-bottom:30pt;padding-bottom:10pt;border-bottom:2pt solid #000}.sig{margin-top:60pt;display:grid;grid-template-columns:1fr 1fr;gap:40pt}.sig-box{text-align:center}.sig-line{border-top:1pt solid #000;padding-top:6pt;margin-top:40pt}</style></head>
<body>
<div class="header"><div><strong>${companyNom}</strong><br>${cfg.adresse ?? ""}<br>${cfg.telephone ? "Tel: " + cfg.telephone : ""}</div><div style="text-align:right"><strong>${data.titre ?? ""}</strong><br>Date: ${data.dateDoc ?? new Date().toLocaleDateString("fr-FR")}</div></div>
<h1>${(data.titre ?? "").toUpperCase()}</h1>
<p><strong>Objet:</strong> ${data.titre ?? ""}</p>
${data.employe ? `<p><strong>Employe(e):</strong> ${data.employe}${data.poste ? " — Poste: " + data.poste : ""}${data.cin ? " — CIN: " + data.cin : ""}</p>` : ""}
<br>
<div style="white-space:pre-wrap;line-height:2">${data.contenu}</div>
<div class="sig">
  <div class="sig-box"><p><strong>Direction</strong></p><div class="sig-line">${companyNom}</div></div>
  <div class="sig-box"><p><strong>${data.employe ?? "Employe(e)"}</strong></p><div class="sig-line">&nbsp;</div></div>
</div>
</body></html>`

  const blob = new Blob([content], { type: "application/msword" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${(data.titre ?? "document").replace(/\s+/g, "_")}_${data.dateDoc ?? new Date().toISOString().split("T")[0]}.doc`
  a.click()
  URL.revokeObjectURL(url)
}

// ── WhatsApp text builder for HR ──────────────────────────────────────────────
export function buildHRWhatsAppText(data: HRDocData): string {
  return `${(data.titre ?? data.docType ?? "Document").toUpperCase()}\n\n${data.employe ? "Employe: " + data.employe + "\n" : ""}${data.employeNom ? "Employe: " + data.employeNom + "\n" : ""}${data.periode ? "Periode: " + data.periode + "\n" : ""}${data.salaireBrut ? "Salaire brut: " + data.salaireBrut.toLocaleString("fr-MA") + " DH\n" : ""}${data.netAPayer ? "Salaire net: " + data.netAPayer.toLocaleString("fr-MA") + " DH\n" : ""}\nDate: ${data.dateDoc ?? new Date().toLocaleDateString("fr-FR")}`
}

export function sendWhatsApp(phone: string, text: string) {
  const clean = phone.replace(/\D/g, "")
  const full = clean.startsWith("212") ? clean : `212${clean.replace(/^0/, "")}`
  window.open(`https://wa.me/${full}?text=${encodeURIComponent(text)}`, "_blank")
}

// ── Export Payroll to Excel (CSV-based XLS) ───────────────────────────────────
export function exportPayrollExcel(
  employees: { salarie: Salarie | null; nom: string; brut: number; heuresSup?: number; primes?: number }[],
  periode: string,
  societe: string
) {
  const headers = ["N°", "Civilite", "Nom complet", "CIN", "N° CNSS", "Poste", "Departement", "Type contrat", "Salaire Brut (DH)", "Heures Sup (DH)", "Primes (DH)", "TOTAL BRUT (DH)", "CNSS Salariale (DH)", "AMO (DH)", "IR (DH)", "TOTAL RETENUES (DH)", "Avances (DH)", "NET A PAYER (DH)", "Mode paiement", "Banque", "RIB", "Periode", "Societe"]
  const rows = employees.map(({ salarie: s, nom, brut, heuresSup = 0, primes = 0 }, i) => {
    const totalBrut = brut + primes + (heuresSup > 0 ? Math.round((brut / 208) * 1.25 * heuresSup) : 0)
    const calc = calcPayroll(totalBrut)
    const avances = s?.avances ?? 0
    return [
      i + 1,
      s?.civilite ?? "",
      s ? `${s.nom} ${s.prenom}` : nom,
      s?.cin ?? "",
      s?.cnss ?? "",
      s?.poste ?? "",
      s?.departement ?? "",
      s?.typeContrat?.toUpperCase() ?? "CDI",
      brut.toFixed(2),
      heuresSup > 0 ? Math.round((brut / 208) * 1.25 * heuresSup).toFixed(2) : "0.00",
      primes.toFixed(2),
      totalBrut.toFixed(2),
      calc.cnss.toFixed(2),
      calc.amo.toFixed(2),
      calc.ir.toFixed(2),
      calc.totalRetenues.toFixed(2),
      avances.toFixed(2),
      (calc.net - avances).toFixed(2),
      s?.modePaiement?.toUpperCase() ?? "VIREMENT",
      s?.banque ?? "",
      s?.numCompteBancaire ?? "",
      periode,
      societe,
    ]
  })

  // Add totals row
  const totBrut = employees.reduce((s, e) => s + e.brut + (e.primes ?? 0), 0)
  const totNet  = employees.reduce((acc, e) => acc + e.brut + (e.primes ?? 0), 0)
  void totNet
  void totNet // avoid unused warning
  const totNetReal = employees.reduce((acc, e) => {
    const tb = e.brut + (e.primes ?? 0)
    const c = calcPayroll(tb)
    const av = e.salarie?.avances ?? 0
    return acc + c.net - av
  }, 0)

  rows.push(Array(headers.length).fill("") as string[])
  const totalRow: (string | number)[] = Array(headers.length).fill("") as string[]
  totalRow[0] = "TOTAL"
  totalRow[8] = totBrut.toFixed(2)
  totalRow[17] = totNetReal.toFixed(2)
  rows.push(totalRow)

  const csv = [headers, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\n")

  const bom = "\uFEFF"
  const blob = new Blob([bom + csv], { type: "application/vnd.ms-excel;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `Paie_${periode.replace(/\s+/g, "_")}_${societe.replace(/\s+/g, "_")}.xls`
  a.click()
  URL.revokeObjectURL(url)
}

// ── printPO alias ─────────────────────────────────────────────────────────────
export const printPO = printPurchaseOrder

// ── BL Print Options (backoffice overrides) ───────────────────────────────────
export interface PrintBLOpts {
  nomSocieteOverride?: string
  adresseOverride?: string
  telOverride?: string
  iceOverride?: string
  rcOverride?: string
  ifOverride?: string
  patentOverride?: string
  logoOverride?: string
  piedDePageOverride?: string
}

interface BOBLLigne {
  articleNom: string
  unite: string
  qteLivree: number
  prixUnit: number
  totalLigne: number
}

interface BOBonLivraison {
  id: string
  numero: string
  clientNom: string
  clientAdresse?: string
  livreurNom?: string
  lignes: BOBLLigne[]
  totalHT: number
  totalTTC: number
  tva?: number
  date: string
  statut?: string
  clientIce?: string
  clientModalitePaiement?: string
  clientCreditSolde?: number
  clientCreditAutorise?: boolean
  notesBL?: string
}

function buildBLHtml(bl: BOBonLivraison, opts: PrintBLOpts): string {
  const cfg = { ...EMPIRE_FRESH_CONFIG }
  const accent = cfg.couleurEntete ?? "#1a4f2a"
  const goldAccent = "#b8962e"
  const companyNom = opts.nomSocieteOverride || cfg.nom
  const adresse = opts.adresseOverride || cfg.adresse || ""
  const telephone = opts.telOverride || cfg.telephone || ""
  const ice = opts.iceOverride || cfg.ice || ""
  const rc = opts.rcOverride || cfg.rc || ""
  const ifFiscal = opts.ifOverride || cfg.if_fiscal || ""
  const logo = opts.logoOverride || cfg.logo || "/empire-fresh-logo.png"
  const piedDePage = opts.piedDePageOverride || cfg.mentionsBL || "Document non contractuel — Litige a signaler sous 48h"
  const dateStr = bl.date ? new Date(bl.date).toLocaleDateString("fr-FR") : new Date().toLocaleDateString("fr-FR")

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>BL ${bl.numero}</title>
  <style>
    ${blCSS(accent)}
    .ef-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:24px; padding-bottom:18px; border-bottom:4px solid ${accent}; }
    .ef-brand { display:flex; align-items:center; gap:14px; }
    .ef-logo { width:72px; height:72px; object-fit:contain; }
    .ef-company { font-size:20px; font-weight:900; color:${accent}; }
    .ef-company span { color:${goldAccent}; }
    .ef-tagline { font-size:9px; font-weight:700; color:${goldAccent}; letter-spacing:1.5px; text-transform:uppercase; }
    .ef-contact { font-size:10px; color:#475569; line-height:1.6; margin-top:4px; }
    .ef-doc-block { text-align:right; }
    .ef-doc-title { font-size:28px; font-weight:900; color:#0f172a; text-transform:uppercase; }
    .ef-doc-accent { width:40px; height:4px; background:${goldAccent}; margin:6px 0 6px auto; border-radius:2px; }
    .ef-doc-num { font-size:14px; font-weight:800; color:${accent}; }
    .ef-doc-date { font-size:11px; color:#64748b; margin-top:2px; }
  </style>
</head>
<body>
<div class="doc">
  <div class="ef-header">
    <div class="ef-brand">
      <img src="${logo}" alt="${companyNom}" class="ef-logo" onerror="this.style.display='none'" />
      <div>
        <div class="ef-company">${companyNom.replace("Fresh", "<span>Fresh</span>")}</div>
        <div class="ef-tagline">Fruit &amp; Vegetable Distribution Network</div>
        <div class="ef-contact">
          ${adresse}<br>
          ${telephone ? "Tel: " + telephone + " &mdash; " : ""}ICE: ${ice}<br>
          RC: ${rc} &mdash; IF: ${ifFiscal}${opts.patentOverride ? " &mdash; Patente: " + opts.patentOverride : ""}
        </div>
      </div>
    </div>
    <div class="ef-doc-block">
      <div class="ef-doc-title">Bon de Livraison</div>
      <div class="ef-doc-accent"></div>
      <div class="ef-doc-num">${bl.numero}</div>
      <div class="ef-doc-date">${dateStr}</div>
      <div style="margin-top:8px"><span class="badge badge-green">${(bl.statut ?? "EMIS").toUpperCase()}</span></div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-card">
      <div class="info-card-title">Client / Destinataire</div>
      <div class="info-card-value">${bl.clientNom}</div>
      <div class="info-card-sub">${bl.clientAdresse ?? ""}</div>
      ${bl.clientIce ? `<div class="info-card-sub">ICE: ${bl.clientIce}</div>` : ""}
      ${bl.clientModalitePaiement ? `<div class="info-card-sub">Modalite: ${bl.clientModalitePaiement}</div>` : ""}
    </div>
    <div class="info-card">
      <div class="info-card-title">Informations livraison</div>
      <div class="info-card-value">${livreurNomStr(bl.livreurNom)}</div>
      <div class="info-card-sub">Date: ${dateStr}</div>
      ${bl.tva !== undefined ? `<div class="info-card-sub">TVA: ${bl.tva}%</div>` : ""}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:40%">Designation</th>
        <th>Unite</th>
        <th class="right">Quantite</th>
        <th class="right">Prix U. HT</th>
        <th class="right">Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${bl.lignes.map(l => `
        <tr>
          <td><strong>${l.articleNom}</strong></td>
          <td>${l.unite ?? "kg"}</td>
          <td class="right">${l.qteLivree.toLocaleString("fr-MA")}</td>
          <td class="right">${l.prixUnit.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td>
          <td class="right">${l.totalLigne.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</td>
        </tr>`).join("")}
    </tbody>
  </table>

  <div class="totals-block">
    <div class="totals-table">
      <div class="totals-row"><span class="label">Total HT</span><span class="value">${bl.totalHT.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span></div>
      <div class="totals-row"><span class="label">TVA (${bl.tva ?? 0}%)</span><span class="value">${(bl.totalTTC - bl.totalHT).toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span></div>
      <div class="totals-row final"><span class="label">TOTAL TTC</span><span class="value">${bl.totalTTC.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH</span></div>
    </div>
  </div>

  <div class="signature-block">
    <div class="sig-box"><div class="sig-label">Signature Livreur</div><div class="sig-line">${bl.livreurNom ?? ""}</div></div>
    <div class="sig-box"><div class="sig-label">Signature Client / Cachet</div><div class="sig-line">${bl.clientNom}</div></div>
  </div>

  <div class="mentions">${piedDePage}</div>
</div>
<script>window.onload=()=>{window.print();}</script>
</body>
</html>`
}

function livreurNomStr(nom?: string) {
  return nom ? `Livreur: ${nom}` : "Livreur: —"
}

export function printBLFromBO(bl: BOBonLivraison, opts: PrintBLOpts = {}) {
  const html = buildBLHtml(bl, opts)
  const w = window.open("", "_blank", "width=850,height=1100")
  if (w) { w.document.write(html); w.document.close() }
}

export function downloadBLFromBO(bl: BOBonLivraison, opts: PrintBLOpts = {}) {
  const html = buildBLHtml(bl, opts)
  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `BL-${bl.numero.replace(/[^a-zA-Z0-9-]/g, "_")}.html`
  a.click()
  URL.revokeObjectURL(url)
}

export function buildBLWhatsAppText(
  numero: string,
  clientNom: string,
  date: string,
  lignes: { nom: string; quantite: number; unite: string; total: number }[],
  totalTTC: number,
  modalite?: string
): string {
  const lines = lignes.map(l => `  • ${l.nom}: ${l.quantite} ${l.unite} — ${l.total.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH`).join("\n")
  return `*BON DE LIVRAISON ${numero}*\nDate: ${date}\nClient: ${clientNom}\n\n*Articles:*\n${lines}\n\n*TOTAL TTC: ${totalTTC.toLocaleString("fr-MA", { minimumFractionDigits: 2 })} DH*${modalite ? `\nModalite: ${modalite}` : ""}`
}
