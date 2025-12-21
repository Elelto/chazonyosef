import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [
  { size: 72, name: 'icon-72.png' },
  { size: 96, name: 'icon-96.png' },
  { size: 128, name: 'icon-128.png' },
  { size: 144, name: 'icon-144.png' },
  { size: 152, name: 'icon-152.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 384, name: 'icon-384.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 180, name: 'apple-touch-icon.png' }
];

async function generateIcons() {
  const inputPath = path.join(__dirname, 'public', 'AppLogo.png');
  const outputDir = path.join(__dirname, 'public');

  try {
    console.log('🎨 מתחיל ליצור אייקונים מ-AppLogo.png...\n');

    // Check if input file exists
    await fs.access(inputPath);

    // Generate each icon size
    for (const { size, name } of sizes) {
      const outputPath = path.join(outputDir, name);
      
      await sharp(inputPath)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ נוצר: ${name} (${size}x${size})`);
    }

    // Generate favicon.ico (using 32x32 size, cropped to center to remove dark edges)
    const faviconPath = path.join(outputDir, 'favicon.ico');
    const imageMetadata = await sharp(inputPath).metadata();
    
    // Crop to center 70% to focus on the logo and remove dark background edges
    const cropSize = Math.floor(Math.min(imageMetadata.width, imageMetadata.height) * 0.7);
    const left = Math.floor((imageMetadata.width - cropSize) / 2);
    const top = Math.floor((imageMetadata.height - cropSize) / 2);
    
    await sharp(inputPath)
      .extract({ left, top, width: cropSize, height: cropSize })
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png()
      .toFile(faviconPath.replace('.ico', '-temp.png'));
    
    // Rename to .ico (browsers accept PNG format with .ico extension)
    await fs.rename(faviconPath.replace('.ico', '-temp.png'), faviconPath);
    console.log(`✅ נוצר: favicon.ico (32x32) ממוקד במרכז`);

    console.log('\n🎉 כל האייקונים נוצרו בהצלחה!');
    console.log('📁 מיקום: public/');
    
  } catch (error) {
    console.error('❌ שגיאה ביצירת אייקונים:', error.message);
    process.exit(1);
  }
}

generateIcons();
