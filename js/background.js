chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'getCookies') {
    chrome.cookies.get({ url: 'https://steamcommunity.com', name: 'sessionid' }, function(cookie1) {
      chrome.cookies.get({ url: 'https://steamcommunity.com', name: 'steamLoginSecure' }, function(cookie2) {
        sendResponse({
          sessionid: cookie1 ? cookie1.value : null,
          steamloginsecure: cookie2 ? cookie2.value : null
        });
      });
    });
    return true;
  }
});
