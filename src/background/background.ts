console.log('hello from background');

console.log(chrome.webRequest);

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    console.log('onBeforeSendHeaders', details);
  },
  {
    urls: ['https://*.google.com/search*'],
  },
);
