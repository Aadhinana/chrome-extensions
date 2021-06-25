let color = "#effc28";

chrome.runtime.onInstalled.addListener(() => {
  console.log(chrome);
  chrome.storage.sync.set({ color });
  console.log("Default background color set to %cyellow", `color: ${color}`);
});
