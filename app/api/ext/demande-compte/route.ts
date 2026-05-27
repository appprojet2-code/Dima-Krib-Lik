import { NextRequest, NextResponse } from "next/server"

// ── Proxy vers l'ERP (f-l.vercel.app) ────────────────────────────────────────
// Cette route transfère les demandes de compte vers l'API ERP principale.
// L'ERP gère la persistance avec 3 niveaux de fallback (jamais d'erreur visible).

const ERP_BASE = "https://f-l.vercel.app"

function corsHeaders(origin: string | null): HeadersInit {
  return {
    "Access-Control-Allow-Origin":  origin ?? "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
  }
}

const SUCCESS_MSG = "Votre demande a été enregistrée. Notre équipe vous contactera sous 24-48h."

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin")

  let body: Record<string, string> = {}
  try { body = await req.json() } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400, headers: corsHeaders(origin) })
  }

  const { type, nom, telephone } = body

  // Basic validation
  const VALID_TYPES = ["client", "chr", "marchand", "particulier", "fournisseur"]
  if (!type || !VALID_TYPES.includes(type)) {
    return NextResponse.json({ error: "Type invalide." }, { status: 400, headers: corsHeaders(origin) })
  }
  if (!nom?.trim() || !telephone?.trim()) {
    return NextResponse.json({ error: "Nom et téléphone sont requis." }, { status: 400, headers: corsHeaders(origin) })
  }

  // Forward to ERP — fire and forget the result, always return success
  try {
    await fetch(`${ERP_BASE}/api/ext/demande-compte`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (e) {
    // Log but don't fail — ERP has its own fallback
    console.warn("[demande-compte proxy] ERP unreachable:", e)
  }

  return NextResponse.json(
    { statut: "en_attente", message: SUCCESS_MSG },
    { status: 201, headers: corsHeaders(origin) }
  )
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req.headers.get("origin")) })
}
