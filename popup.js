document.addEventListener('DOMContentLoaded', function() {
    const refreshToggle = document.getElementById('refreshToggle');
    const refreshIntervalInput = document.getElementById('refreshInterval');
    const inactivityToggle = document.getElementById('inactivityToggle');
    const saveButton = document.getElementById('saveButton');
  
    // Load user preferences
    chrome.storage.sync.get(['isAutoRefreshEnabled', 'refreshInterval', 'checkInactivity'], function(data) {
      refreshToggle.checked = data.isAutoRefreshEnabled || false;
      refreshIntervalInput.value = data.refreshInterval || 5;
      inactivityToggle.checked = data.checkInactivity || false;
    });
  
    // Save user preferences
    saveButton.addEventListener('click', function() {
      const isAutoRefreshEnabled = refreshToggle.checked;
      const refreshInterval = parseInt(refreshIntervalInput.value);
      const checkInactivity = inactivityToggle.checked;
  
      chrome.storage.sync.set({
        isAutoRefreshEnabled: isAutoRefreshEnabled,
        refreshInterval: refreshInterval,
        checkInactivity: checkInactivity
      }, function() {
        console.log('Preferences saved');
      });
    });
  });
  