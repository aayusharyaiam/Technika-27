import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const images = path.join(root, "public", "images");
const original = path.join(images, "elder-wand-original.png");
const source = await readFile(original);
const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 4) {
  const whiteness = Math.min(data[i], data[i + 1], data[i + 2]);
  data[i + 3] = whiteness > 245 ? 0 : whiteness > 220 ? Math.round((245 - whiteness) / 25 * 255) : 255;
}
const cutout = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).trim().flop().png().toBuffer();
await sharp(cutout).resize({ width: 420 }).png().toFile(path.join(images, "elder-wand-cutout.png"));
const diagonal = await sharp(cutout).resize({ width: 120 }).rotate(45, { background: "#00000000" }).png().toBuffer();
await sharp(diagonal).resize(104, 104, { fit: "contain", background: "#00000000" }).png().toFile(path.join(images, "wand-pointer.png"));
await sharp(diagonal).resize(48, 48, { fit: "contain", background: "#00000000" }).png().toFile(path.join(root, "public", "wand-cursor.png"));

const family = "Caveat:wght@400..700";
const css = execFileSync("curl", ["-f", "-L", "--silent", "--show-error", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36", `https://fonts.googleapis.com/css2?family=${family}&display=swap`], { encoding: "utf8" });
const url = [...css.matchAll(/url\((https:[^)]+)\)/g)].at(-1)?.[1];
if (!url) throw new Error("Handwriting font could not be resolved");
await writeFile(path.join(root, "public", "fonts", "caveat.woff2"), execFileSync("curl", ["-f", "-L", "--silent", "--show-error", url]));
await writeFile(path.join(root, "public", "fonts", "OFL-caveat.txt"), execFileSync("curl", ["-f", "-L", "--silent", "--show-error", "https://raw.githubusercontent.com/google/fonts/main/ofl/caveat/OFL.txt"]));
console.log("Prepared photographic Elder Wand cutouts/cursors and local handwriting font.");
