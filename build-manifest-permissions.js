const fs = require('fs');
const domains = require('./src/domains.js');
const manifest = './manifest.json';

const init = () => {
  fs.readFile(manifest, { encoding: 'utf-8' }, (err, data) => {
    writeSettings(JSON.parse(data));
  });
};

const writeSettings = data => {
  const domainsPermissions = domains.map(domain => `https://*.google.${domain}/search*`);

  const settings = {
    ...data,
    content_scripts: [
      {
        ...data.content_scripts[0],
        matches: domainsPermissions,
      },
    ],
    permissions: [...domainsPermissions, 'webRequest', 'webRequestBlocking', 'storage'],
  };

  fs.writeFile(manifest, JSON.stringify(settings, null, 2), err => {
    if (err) {
      throw err;
    }

    return;
  });
};

init();
