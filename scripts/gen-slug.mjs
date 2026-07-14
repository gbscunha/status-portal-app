// Gera um slug não-adivinhável para um cliente: <prefixo>-<sufixo aleatório>.
// O prefixo é só conveniência interna (legível); o segredo é o sufixo.
// Rodar UMA vez por cliente e fixar o resultado em content/clients/<id>.json.
//
//   node scripts/gen-slug.mjs movi
//
import { randomBytes } from "node:crypto";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import path from "node:path";

const CLIENTS_DIR = path.join(process.cwd(), "content", "clients");
const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";
const SUFFIX_LEN = 7;

function existingSlugs() {
  const slugs = new Set();
  if (!existsSync(CLIENTS_DIR)) return slugs;
  for (const f of readdirSync(CLIENTS_DIR)) {
    if (!f.endsWith(".json")) continue;
    try {
      const j = JSON.parse(readFileSync(path.join(CLIENTS_DIR, f), "utf-8"));
      if (j.slug) slugs.add(j.slug);
    } catch {
      // ignora arquivo ilegível
    }
  }
  return slugs;
}

function randomSuffix() {
  const bytes = randomBytes(SUFFIX_LEN);
  let out = "";
  for (let i = 0; i < SUFFIX_LEN; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

const prefix = process.argv[2];
if (!prefix) {
  console.error("uso: node scripts/gen-slug.mjs <prefixo>  (ex: movi)");
  process.exit(1);
}

const taken = existingSlugs();
let slug;
do {
  slug = `${prefix}-${randomSuffix()}`;
} while (taken.has(slug));

console.log(slug);
