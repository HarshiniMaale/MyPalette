const palette = {
  warm: [
    '#FF5733', '#FFC300', '#FF8D1A', '#E25822', '#FFB347', '#D2691E',
    '#FFD700', '#CD853F', '#FFA07A', '#DAA520'
  ],
  cool: [
    '#1A75FF', '#8000FF', '#66B2FF', '#5F9EA0', '#4682B4', '#4169E1',
    '#6A5ACD', '#7B68EE', '#8A2BE2', '#708090'
  ],
  neutral: [
    '#999999', '#A67B5B', '#C0C0C0', '#D3D3D3', '#8B8680', '#B0A295',
    '#A9A9A9', '#C8AD7F', '#BEBEBE', '#E5E4E2'
  ]
};


function hexToRgb(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

function colorDistance(c1, c2) {
  return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);
}
More actions
function isMatch(dominant, palette) {
  return palette.some(hex => colorDistance(dominant, hexToRgb(hex)) < 100);
}

function getDominantColorFromCanvas(img) {
  const canvas = document.createElement('canvas');
canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;
  const ctx = canvas.getContext('2d');

  try {

    return [Math.floor(r / count), Math.floor(g / count), Math.floor(b / count)];
  } catch (err) {
    console.warn("Canvas error for image:", img.src);
    return null;
  }
}

async function fetchImageAsBase64(url) {
  try {
    const response = await fetch(`http://localhost:8000/fetch-image?url=${encodeURIComponent(url)}`);
    const data = await response.json();
    return data.base64;
  } catch (error) {
    console.warn("Failed to fetch image via proxy:", url, error);
    return null;
  }
}Add commentMore actions
async function processImages(undertone) {
  const matches = palette[undertone];
  if (!matches) return;

  const images = Array.from(document.querySelectorAll("img"));
  console.log("Processing", images.length, "images for undertone:", undertone);

for (const img of images) {
    const imageUrl = img.src;
     // ⛔ Skip data URLs (like tracking pixels)
    if (imageUrl.startsWith("data:")) {
      console.log("Skipping data URL image:", imageUrl);
      continue;
    }
    
    const base64 = await fetchImageAsBase64(imageUrl);
    if (!base64) continue;
const proxyImg = new Image();
    proxyImg.src = `data:image/jpeg;base64,${base64}`;

    await new Promise(resolve => {
      proxyImg.onload = resolve;
      proxyImg.onerror = resolve; // prevent hang
    });

    const dominant = getDominantColorFromCanvas(proxyImg);
    if (!dominant) continue;

    if (isMatch(dominant, matches)) {
      img.style.border = "3px solid limegreen";
       img.style.boxSizing = "border-box";
      img.style.zIndex = "9999";
      img.style.position = "relative";
    } else {
    }}}
// Receive trigger from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "applyFilter") {
    chrome.storage.local.get("undertone", (res) => {
      if (res.undertone) {
        processImages(res.undertone);
      }
    });
  }
});
