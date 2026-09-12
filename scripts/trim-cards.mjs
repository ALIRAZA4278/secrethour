// One-off: the CARDS art ships on a huge square canvas with wide empty
// margins, so the card never fills its frame on the page. Trim each PNG to
// the artwork bounds and downscale to a sane size for web.
import sharp from 'sharp';
import { readdirSync } from 'fs';
import path from 'path';

const DIR = 'public/assets/CARDS';
const TARGET_W = 1000;

for (const file of readdirSync(DIR).filter(f => f.endsWith('.png'))) {
  const src = path.join(DIR, file);
  const img = sharp(src);
  const meta = await img.metadata();
  const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
      // Treat transparent and near-white as background.
      const isBg = a < 12 || (r > 244 && g > 244 && b > 244);
      if (!isBg) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;
  console.log(
    `${file}: ${meta.width}x${meta.height} -> box ${minX},${minY} ${w}x${h} (ratio ${(w / h).toFixed(3)})`
  );

  if (process.argv.includes('--write')) {
    await sharp(src)
      .extract({ left: minX, top: minY, width: w, height: h })
      .resize({ width: TARGET_W })
      .png({ compressionLevel: 9 })
      .toFile(path.join(DIR, `trimmed-${file}`));
  }
}
