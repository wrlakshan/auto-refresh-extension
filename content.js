let inactivityTimer;
const userInactiveTimeout = 60000; // 1 minute

document.addEventListener('mousemove', resetInactivityTimer);
document.addEventListener('keypress', resetInactivityTimer);

function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(setUserInactive, userInactiveTimeout);
  setUserActive();
}

function setUserActive() {
  chrome.runtime.sendMessage({ userActive: true }, function(response) {
    console.log('User is active.');
  });
}

function setUserInactive() {
  chrome.runtime.sendMessage({ userActive: false }, function(response) {
    console.log('User is inactive.');
  });
}

// Initialize inactivity timer on page load
resetInactivityTimer();
