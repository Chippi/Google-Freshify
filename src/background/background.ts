console.log('Hello from background');

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    console.log('onBeforeSendHeaders', details);
  },
  {
    urls: ['https://*.google.com/search*'],
  },
);
