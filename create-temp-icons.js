import { copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const sourceLogo = join(__dirname, 'public', 'logo.png');
const outputDir = join(__dirname, 'public');

console.log('📱 יוצר אייקונים זמניים מהלוגו...\n');

try {
  for (const size of sizes) {
    const outputPath = join(outputDir, `icon-${size}.png`);
    copyFileSync(sourceLogo, outputPath);
    console.log(`✅ נוצר: icon-${size}.png (זמני - משתמש בלוגו)`);
  }
  
  console.log('\n🎉 אייקונים זמניים נוצרו!');
  console.log('\n💡 לאייקונים מותאמים בגדלים שונים:');
  console.log('   1. התקן sharp: npm install sharp --save-dev');
  console.log('   2. הרץ: npm run generate-icons');
  console.log('   או השתמש בשירות אונליין: https://realfavicongenerator.net/\n');
} catch (error) {
  console.error('❌ שגיאה:', error.message);
  process.exit(1);
}
