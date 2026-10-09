import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const image = path.join(root, "public", "images");
const overlay = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="shade" x2="0" y2="1"><stop stop-color="#0f0c19" stop-opacity=".5"/><stop offset="1" stop-color="#0f0c19" stop-opacity=".85"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <rect x="30" y="30" width="1140" height="570" rx="16" fill="none" stroke="#d4b373" stroke-opacity=".5"/>
  <text x="600" y="180" text-anchor="middle" fill="#e1c898" font-family="sans-serif" font-size="16" letter-spacing="5">BIRLA INSTITUTE OF TECHNOLOGY, PATNA</text>
  <text x="600" y="320" text-anchor="middle" fill="#ffdc98" font-family="Georgia,serif" font-size="120">TECHNIKA ’27</text>
  <text x="600" y="392" text-anchor="middle" fill="#f7f2e7" font-family="Georgia,serif" font-size="34" font-style="italic">The Triwizard Tech Odyssey</text>
  <path d="M430 444H770" stroke="#a9894f" stroke-opacity=".7"/>
  <text x="600" y="493" text-anchor="middle" fill="#e6d3ad" font-family="sans-serif" font-size="15" letter-spacing="4">WHERE TECHNOLOGY MEETS MAGIC</text>
</svg>`);

await sharp(path.join(image, "hogwarts.webp")).resize(1200, 630, { fit: "cover" }).composite([{ input: overlay }]).jpeg({ quality: 90 }).toFile(path.join(image, "social-card.jpg"));
await sharp(path.join(image, "crest.webp")).resize(180, 180).png().toFile(path.join(root, "public", "apple-icon.png"));
console.log("Created 1200×630 social image and Apple touch icon.");
