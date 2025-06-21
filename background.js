// background.js

// Run when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("SkinTone Styler Extension Installed");
});

// Keep track of filtering state
let filterEnabled = false;

// Unified message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle skin tone analysis request
  if (message.type === "analyzeSkinTone") {
    console.log("Received skin tone data:", message.data);

    // Safely check that sender.tab is available
    if (sender.tab && sender.tab.id) {
      chrome.scripting.executeScript({
        target: { tabId: sender.tab.id },
        files: ["content.js"]
      });
    } else {
      console.warn("No sender.tab information found.");
    }

    sendResponse({ status: "success", message: "Skin tone data received." });
    return true; // Keeps the message channel open for async response
  }

  // Enable filtering mode
  if (message.action === "enableFiltering") {
    filterEnabled = true;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "startFiltering" });
      }
    });
  }

  // Check if filtering is enabled
  else if (message.action === "isFilteringEnabled") {
    sendResponse({ enabled: filterEnabled });
  }

  return true; // Ensures sendResponse works asynchronously
});
