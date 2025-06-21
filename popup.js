function colorDistance(c1, c2) {
  return Math.sqrt((c1[0] - c2[0]) ** 2 + (c1[1] - c2[1]) ** 2 + (c1[2] - c2[2]) ** 2);
}

function getDominantColor(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');

  try {
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(10, 10, 50, 50).data;
    let r = 0, g = 0, b = 0, count = 0;

    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    return [Math.floor(r / count), Math.floor(g / count), Math.floor(b / count)];
  } catch (err) {
    console.warn("Skipped image due to CORS:", img.src);
    return null;
  }
}

function isMatch(dominant, palette) {
  return palette.some(hex => colorDistance(dominant, hexToRgb(hex)) < 100);
}

function processImages(undertone) {
    const matches = palette[undertone];Add commentMore actions
   if (!matches) return;
   const images = Array.from(document.querySelectorAll("img"));Add commentMore actions
  console.log("Processing", images.length, "images for undertone:", undertone);
   images.forEach(img => {Add commentMore actions
    if (!img.complete || img.naturalWidth === 0) return;

    const dominant = getDominantColor(img);
    if (!dominant) return;

    if (isMatch(dominant, matches)) {
      img.style.border = "3px solid limegreen";
    } else {
      img.style.filter = "grayscale(100%) opacity(40%)";
    }
  });
}
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {Add commentMore actions
  if (msg.action === "applyFilter") {
    chrome.storage.local.get("undertone", (res) => {
      if (res.undertone) {
        processImages(res.undertone);
      }
    });
  }
});
