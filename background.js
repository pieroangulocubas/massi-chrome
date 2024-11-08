chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ enabled: true });
  });
  
  chrome.action.onClicked.addListener((tab) => {
    chrome.storage.sync.get('enabled', ({ enabled }) => {
      chrome.storage.sync.set({ enabled: !enabled });
      chrome.action.setIcon({
        path: enabled ? "icons/icon128_disabled.png" : "icons/icon128.png"
      });
    });
  });
  