import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = path.resolve('src/assets/images');
const widths = [400, 800];
const formats = ['avif', 'webp', 'jpg'];

if (!fs.existsSync(inputDir)) {
  console.error('Папку з зображеннями не знайдено:', inputDir);
  process.exit(1);
}

fs.readdirSync(inputDir).forEach((file) => {
  // Обробляємо лише оригінальні файли (ігноруємо вже згенеровані з суфіксами)
  if (
    file.match(/\.(png|jpg|jpeg)$/i) &&
    !file.includes('-400') &&
    !file.includes('-800')
  ) {
    const filePath = path.join(inputDir, file);
    const name = path.parse(file).name;

    widths.forEach((width) => {
      formats.forEach((format) => {
        const ext = format === 'jpg' ? 'jpg' : format;
        const outputPath = path.join(inputDir, `${name}-${width}.${ext}`);

        let pipeline = sharp(filePath).resize({ width });

        if (format === 'avif') {
          pipeline = pipeline.avif({ quality: 80 });
        } else if (format === 'webp') {
          pipeline = pipeline.webp({ quality: 80 });
        } else if (format === 'jpg') {
          pipeline = pipeline.jpeg({ quality: 80 });
        }

        pipeline
          .toFile(outputPath)
          .then(() => console.log(`Згенеровано: ${path.basename(outputPath)}`))
          .catch((err) => console.error(`Помилка для ${outputPath}:`, err));
      });
    });
  }
});
