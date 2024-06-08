let globalSessionId = null;
let globalSteamLoginSecure = null;


const testbutton = document.getElementById('testbutton').addEventListener('click', function() {
  chrome.storage.local.get(['sessionid', 'steamloginsecure'], function(items) {
    console.log(items.sessionid)
    console.log(items.steamloginsecure)
    console.log(items)
  })
});

function test(params) {
    console.log("Test")
}

document.addEventListener('DOMContentLoaded', function() {
  const starterGoToSteam = document.getElementById('starterGoToSteam');
  const getCookies = document.getElementById('getCookies');
  const welcomeMenu = document.getElementById('welcomeMenu');

  chrome.storage.local.get(['sessionid', 'steamloginsecure'], function(items) {
    const sessionid = items.sessionid;
    const steamloginsecure = items.steamloginsecure;

    if (sessionid && steamloginsecure) {
      welcomeMenu.style.display = 'block';
      starterGoToSteam.style.display = 'none';
      getCookies.style.display = 'none';
      deletebutton = document.getElementById('deleteCookies').addEventListener('click', deleteCookiesFun);
      console.log( deletebutton);
    } else {
      chrome.tabs.query({}, function(tabs) {
        let steamTabOpen = false;
        for (let tab of tabs) {
          if (tab.url.includes('steamcommunity.com')) {
            steamTabOpen = true;
            break;
          }
        }

        if (steamTabOpen) {
          getCookies.style.display = 'block';
          starterGoToSteam.style.display = 'none';
          welcomeMenu.style.display = 'none';
        } else {
          starterGoToSteam.style.display = 'block';
          getCookies.style.display = 'none';
          welcomeMenu.style.display = 'none';
        }
      });
    }
  });

  document.getElementById('getCookies').addEventListener('click', function() {
    // Obter todas as abas abertas e buscar cookies do site steamcommunity.com
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        const url = new URL(tab.url);
        const domain = url.hostname;
        if (domain.includes("steamcommunity.com")) {
          showCookiesForDomain(domain, tab.id);
        }
      });
    });
  });

  

  const deleteCookiesFun = () => {
    console.log("Deletando Cookies...");
    console.log("Antes de apagar globalSessionId:", globalSessionId);
    console.log("Antes de apagar globalSteamLoginSecure:", globalSteamLoginSecure);
    globalSessionId = null;
    globalSteamLoginSecure = null;
    console.log("Depois de apagar globalSessionId:", globalSessionId);
    console.log("Depois de apagar globalSteamLoginSecure:", globalSteamLoginSecure);
    console.log("Cookies deletados do armazenamento local.");
    console.log("Apagando Cookies do armazenamento local.");
    chrome.storage.local.remove(['sessionid', 'steamloginsecure'], () => {
      console.log("Cookies deletados do armazenamento local.");
    });
  }
});



  // Função para exibir cookies do site steamcommunity.com
  function showCookiesForDomain(domain, tabId) {
    chrome.cookies.getAll({ domain: domain }, (cookies) => {
      if (cookies.length === 0) {
        console.log('No cookies found for domain:', domain);
      } else {
        cookies.forEach((cookie) => {
          if (cookie.name === "sessionid") {
            globalSessionId = cookie.value;
          }
          if (cookie.name === "steamLoginSecure") {
            globalSteamLoginSecure = cookie.value;
          }
        });
        chrome.storage.local.set(
          {
            sessionid: globalSessionId,
            steamloginsecure: globalSteamLoginSecure,
          },
          () => {
            console.log("Cookies salvos no armazenamento local:", {
              sessionid: globalSessionId,
              steamloginsecure: globalSteamLoginSecure,
            });
          }
        );
      }
    });
  }
