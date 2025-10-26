const sharp = require('sharp');
const fs = require('fs');

// Create a simple icon with a chat bubble
const createIcon = async (size) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#4F46E5" rx="${size/8}"/>
      <circle cx="${size*0.35}" cy="${size*0.4}" r="${size*0.06}" fill="white"/>
      <circle cx="${size*0.5}" cy="${size*0.4}" r="${size*0.06}" fill="white"/>
      <circle cx="${size*0.65}" cy="${size*0.4}" r="${size*0.06}" fill="white"/>
      <path d="M ${size*0.25} ${size*0.55} Q ${size*0.5} ${size*0.7}, ${size*0.75} ${size*0.55}" 
            stroke="white" stroke-width="${size*0.05}" fill="none" stroke-linecap="round"/>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(`public/pwa-${size}x${size}.png`);
  
  console.log(`Created pwa-${size}x${size}.png`);
};

(async () => {
  await createIcon(192);
  await createIcon(512);
})();
