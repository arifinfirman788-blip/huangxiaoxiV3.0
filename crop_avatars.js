import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceImage = path.join(__dirname, 'src/image/fJOA7dMo3.jpeg');
const outputDir = path.join(__dirname, 'src/image/avatars');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function cropImages() {
  try {
    const metadata = await sharp(sourceImage).metadata();
    const width = metadata.width;
    const height = metadata.height;
    
    // Calculate thirds
    const thirdWidth = Math.floor(width / 3);
    
    // Crop Peasant (Left)
    await sharp(sourceImage)
      .extract({ left: 0, top: 0, width: thirdWidth, height: height })
      .toFile(path.join(outputDir, 'peasant.png'));
      
    // Crop Knight (Center)
    await sharp(sourceImage)
      .extract({ left: thirdWidth, top: 0, width: thirdWidth, height: height })
      .toFile(path.join(outputDir, 'knight.png'));
      
    // Crop Mage (Right)
    await sharp(sourceImage)
      .extract({ left: thirdWidth * 2, top: 0, width: width - (thirdWidth * 2), height: height })
      .toFile(path.join(outputDir, 'mage.png'));
      
    console.log('Images cropped successfully!');
  } catch (error) {
    console.error('Error cropping images:', error);
  }
}

cropImages();
