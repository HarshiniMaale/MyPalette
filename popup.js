document.getElementById("analyzeBtn").addEventListener("click", () => {
  const file = document.getElementById("imageInput").files[0];
  const loadingDiv = document.getElementById("loading");
  const resultDiv = document.getElementById("result");

  if (!file) {
    alert("Please upload an image first.");
    return;
  }

  // Reset UI state
  resultDiv.classList.add("hidden");
  loadingDiv.classList.remove("hidden");

  const img = new Image();
  img.src = URL.createObjectURL(file);

  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(50, 50, 100, 100);
    const data = imageData.data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.floor(r / count);
    g = Math.floor(g / count);
    b = Math.floor(b / count);

    const undertone = getUndertone(r, g, b);

    // Wait 5 seconds to simulate analyzing
    setTimeout(() => {
      loadingDiv.classList.add("hidden");
      resultDiv.innerHTML = `<div class="result-line"> Detected undertone </div><div class="undertone-value">✨${undertone}✨</div>`;
      resultDiv.classList.remove("hidden");

      // Store and communicate the result
      chrome.storage.local.set({ undertone }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "applyFilter" });
        });
        chrome.runtime.sendMessage({ action: "enableFiltering" });
      });
    }, 5000);
  };
});

function getUndertone(r, g, b) {
  if (r > b && g > b) return "warm";
  if (b > r && b > g) return "cool";
  return "neutral";
}

const webcamBtn = document.getElementById("webcamBtn");
const video = document.getElementById("video");
const captureBtn = document.getElementById("captureBtn");
const canvas = document.getElementById("snapshotCanvas");

let stream;

// Start webcam when button is clicked
webcamBtn.addEventListener("click", async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.classList.remove("hidden");
    captureBtn.classList.remove("hidden");
  } catch (err) {
    alert("Could not access webcam: " + err.message);
  }
});

// Capture the frame and process
captureBtn.addEventListener("click", () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  stream.getTracks().forEach(track => track.stop());
  video.classList.add("hidden");
  captureBtn.classList.add("hidden");

  const imageData = ctx.getImageData(50, 50, 100, 100);
  const data = imageData.data;

  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  const undertone = getUndertone(r, g, b);

  showLoadingAndResult(undertone);
});

// Helper function to show loading and result
function showLoadingAndResult(undertone) {
  const loadingDiv = document.getElementById("loading");
  const resultDiv = document.getElementById("result");

  resultDiv.classList.add("hidden");
  loadingDiv.classList.remove("hidden");

  setTimeout(() => {
    loadingDiv.classList.add("hidden");
    resultDiv.innerHTML = `<div class="result-line">Detected undertone</div><div class="undertone-value">✨${undertone}✨</div>`;
    resultDiv.classList.remove("hidden");

    chrome.storage.local.set({ undertone }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "applyFilter" });
      });
      chrome.runtime.sendMessage({ action: "enableFiltering" });
    });
  }, 6000);
}

const compliments = [
  "You're glowing today! ✨",
  "Such a radiant smile 😊",
  "You're effortlessly stylish!",
  "Confidence suits you so well!",
  "You're beauty and brains! 🧠❤️",
  "A true trendsetter 💅",
  "You're rocking that look!",
  "Your vibe is immaculate 😎",
  "Slaying it, as always 🔥",
  "Elegance runs in your veins 💃",
  "You're pure magic 🌟",
  "Absolutely stunning!",
  "You're a walking aesthetic 🧚",
  "Gorgeous inside and out 💖",
  "You're the definition of grace!"
];

let complimentIndex = 0;
const complimentDiv = document.getElementById("compliment");

function rotateCompliments() {
  complimentDiv.textContent = compliments[complimentIndex];
  complimentIndex = (complimentIndex + 1) % compliments.length;
}

setInterval(rotateCompliments, 3000); // Change every 3 seconds
rotateCompliments(); // Show the first one immediately