import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

const inputImage = join(__dirname, 'public', 'logo.png');
const outputDir = join(__dirname, 'public');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log('🎨 מתחיל ליצור אייקונים...\n');

async function generateIcons() {
  try {
    for (const size of sizes) {
      const outputPath = join(outputDir, `icon-${size}.png`);
      
      await sharp(inputImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ נוצר: icon-${size}.png`);
    }
    
    console.log('\n🎉 כל האייקונים נוצרו בהצלחה!');
  } catch (error) {
    console.error('❌ שגיאה ביצירת אייקונים:', error);
    process.exit(1);
  }
}

generateIcons();
