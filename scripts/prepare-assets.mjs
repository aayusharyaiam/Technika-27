import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const refs = path.join(root, "image refs");
const dest = path.join(root, "public", "images");
await mkdir(dest, { recursive: true });

if (!process.argv.includes("--fonts-only")) {
await sharp(path.join(refs, "cinematic_panoramic_dark_fantasy_digital_painting_of_hogwarts_castle_on_a", "screen.png"))
  .webp({ quality: 90 }).toFile(path.join(dest, "hogwarts.webp"));
await sharp(path.join(refs, "technika_27_crest_logo", "screen.png"))
  .extract({ left: 346, top: 49, width: 690, height: 690 })
  .resize(690, 690).webp({ quality: 90 }).toFile(path.join(dest, "crest.webp"));

// Keep the exact imagery from the supplied Stitch exports, hosted locally.
const exports = [
  ["technika_27_registrations_coming_soon", "great-hall", 1],
  ["technika_27_members_coming_soon", "order", 8],
  ["technika_27_alumni_coming_soon", "memory", 3],
];
for (const [folder, prefix, count] of exports) {
  const html = await readFile(path.join(refs, folder, "code.html"), "utf8");
  const urls = [...html.matchAll(/https:\/\/lh3\.googleusercontent\.com\/aida-public\/[^\s"'<>)]*/g)].map((m) => m[0]);
  for (let i = 0; i < Math.min(count, urls.length); i++) {
    const output = path.join(dest, `${prefix}-${i + 1}.webp`);
    try {
      const image = execFileSync("curl", ["-f", "-L", "--retry", "2", "--max-time", "45", "--silent", "--show-error", urls[i]], { maxBuffer: 20 * 1024 * 1024 });
      const pipeline = sharp(image);
      if (prefix === "great-hall") {
        // The hosted reference includes a narrow desktop title bar; keep only the artwork.
        const meta = await sharp(image).metadata();
        const top = Math.ceil(meta.height * .03);
        pipeline.extract({ left: 0, top, width: meta.width, height: meta.height - top });
      }
      await pipeline.resize({ width: prefix === "great-hall" ? 1600 : 700, withoutEnlargement: true }).webp({ quality: 83 }).toFile(output);
      console.log(`Prepared ${prefix}-${i + 1}.webp`);
    } catch (error) {
      console.warn(`Hosted asset unavailable: ${prefix}-${i + 1}; using local castle reference.`, error.message);
      await sharp(path.join(dest, "hogwarts.webp")).resize(700).webp({ quality: 83 }).toFile(output);
    }
  }
}
}

// Download the reference typefaces once; production does not depend on Google Fonts.
const fontsDir = path.join(root, "public", "fonts");
await mkdir(fontsDir, { recursive: true });
for (const [family, filename] of [["EB+Garamond:wght@400..800", "garamond"], ["EB+Garamond:ital,wght@1,400..800", "garamond-italic"], ["Outfit:wght@300..700", "outfit"]]) {
  const css = execFileSync("curl", ["-f", "-L", "--silent", "--show-error", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", `https://fonts.googleapis.com/css2?family=${family}&display=swap`], { encoding: "utf8" });
  const url = [...css.matchAll(/url\((https:[^)]+)\)/g)].at(-1)?.[1];
  if (!url) throw new Error(`Could not resolve ${filename} font`);
  const binary = execFileSync("curl", ["-f", "-L", "--silent", "--show-error", url], { maxBuffer: 5 * 1024 * 1024 });
  await writeFile(path.join(fontsDir, `${filename}.woff2`), binary);
  console.log(`Prepared ${filename} font`);
}
for (const [folder, filename] of [["ebgaramond", "garamond"], ["outfit", "outfit"]]) {
  const license = execFileSync("curl", ["-f", "-L", "--silent", "--show-error", `https://raw.githubusercontent.com/google/fonts/main/ofl/${folder}/OFL.txt`]);
  await writeFile(path.join(fontsDir, `OFL-${filename}.txt`), license);
}
