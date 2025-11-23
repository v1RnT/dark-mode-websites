import udemyStyles from './sites/udemy.scss?inline';
import googleStyles from './sites/google.scss?inline';

const siteStyles: Record<string, string> = {
  'udemy.com': udemyStyles,
  'google.com': googleStyles
};

const currentHost = window.location.hostname;
const STYLE_ID = 'my-extension-dark-mode';

const matchedDomain = Object.keys(siteStyles).find(domain => 
  currentHost === domain || currentHost.endsWith('.' + domain)
);

function updateStyles(isEnabled: boolean) {
  const existingStyle = document.getElementById(STYLE_ID);
  
  if (isEnabled) {
    if (!existingStyle && matchedDomain) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = siteStyles[matchedDomain] || ''; 
      document.head.appendChild(style);
    }
  } else {
    if (existingStyle) {
      existingStyle.remove();
    }
  }
}

if (matchedDomain) {
  
  chrome.storage.sync.get([matchedDomain], (result) => {
    const isEnabled = result[matchedDomain] === true; 
    updateStyles(isEnabled);
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes[matchedDomain]) {
      const newValue = changes[matchedDomain].newValue === true;
      updateStyles(newValue);
    }
  });
}