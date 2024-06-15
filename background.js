let refreshInterval;
let isAutoRefreshEnabled;
let checkInactivity;
let refreshTimer;
let isUserActive = true;
const userInactiveTimeout = 60000; // 1 minute

// Load user preferences
chrome.storage.sync.get(['isAutoRefreshEnabled', 'refreshInterval', 'checkInactivity'], function(data) {
  isAutoRefreshEnabled = data.isAutoRefreshEnabled || false;
  refreshInterval = data.refreshInterval || 5;
  checkInactivity = data.checkInactivity || false;
  if (isAutoRefreshEnabled) {
    startAutoRefresh();
  }
});

// Listen for changes in user preferences
chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (changes.isAutoRefreshEnabled) {
    isAutoRefreshEnabled = changes.isAutoRefreshEnabled.newValue;
    if (isAutoRefreshEnabled) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  }
  if (changes.refreshInterval) {
    refreshInterval = changes.refreshInterval.newValue;
    if (isAutoRefreshEnabled) {
      startAutoRefresh();
    }
  }
  if (changes.checkInactivity) {
    checkInactivity = changes.checkInactivity.newValue;
    if (isAutoRefreshEnabled) {
      startAutoRefresh();
    }
  }
});

// Start the auto-refresh process
function startAutoRefresh() {
  stopAutoRefresh();
  refreshTimer = setInterval(function() {
    if (!checkInactivity || (checkInactivity && !isUserActive)) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (tabs.length > 0) {
          chrome.tabs.reload(tabs[0].id);
        }
      });
    }
  }, refreshInterval * 1000);
}

// Stop the auto-refresh process
function stopAutoRefresh() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.userActive !== undefined) {
    isUserActive = request.userActive;
    console.log(`User active status changed: ${isUserActive}`);
  }
});
