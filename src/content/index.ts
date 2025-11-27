import udemyStyles from "./sites/udemy/udemy.scss?inline";
import googleStyles from "./sites/google.scss?inline";

const siteStyles = new Map<string, string>([
  ["udemy.com", udemyStyles],
  ["google.com", googleStyles],
]);

const currentHost = window.location.hostname;
const STYLE_ID = "my-extension-dark-mode";

let matchedDomain: string | undefined;

for (const [domain] of siteStyles) {
  if (currentHost === domain || currentHost.endsWith("." + domain)) {
    matchedDomain = domain;
    break;
  }
}

let cachedStyleElement: HTMLStyleElement | null = null;
let lastEnabledState: boolean | null = null;

function updateStyles(isEnabled: boolean) {
  if (isEnabled === lastEnabledState) return;
  lastEnabledState = isEnabled;

  if (isEnabled) {
    if (cachedStyleElement) {
      if (!cachedStyleElement.isConnected) {
        document.head.appendChild(cachedStyleElement);
      }
    } else if (matchedDomain) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = siteStyles.get(matchedDomain) || "";
      document.head.appendChild(style);

      cachedStyleElement = style;
    }
    console.log(`Dark mode enabled for ${currentHost}`);
  } else {
    if (cachedStyleElement && cachedStyleElement.isConnected) {
      cachedStyleElement.remove();
    }
    console.log(`Dark mode disabled for ${currentHost}`);
  }
}

if (matchedDomain) {
  chrome.storage.sync.get([matchedDomain], (result) => {
    const isEnabled = result[matchedDomain] === true;
    updateStyles(isEnabled);
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes[matchedDomain]) {
      const newValue = changes[matchedDomain].newValue === true;
      updateStyles(newValue);
    }
  });
}
