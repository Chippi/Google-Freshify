function toQuerystring(a: { [key: string]: string | number | boolean }) {
  return (
    Object.keys(a)
      .filter(k => a[k] != null)
      .map(k => encodeURIComponent(k) + '=' + a[k])
      // .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(a[k].toString()))
      .join('&')
  );
}

function parseQuerystring(querystring: string) {
  return JSON.parse(
    '{"' +
      decodeURI(querystring)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}',
  );
}

const mapToQdr = new Map<number, string>([
  [0, 'qdr:h'],
  [1, 'qdr:d'],
  [2, 'qdr:w'],
  [3, 'qdr:m'],
  [4, 'qdr:y'],
  [5, ''],
]);

function getGoogleTimeParam(timeNumber: number): string {
  return mapToQdr.get(timeNumber);
}

export { getGoogleTimeParam, toQuerystring, parseQuerystring, mapToQdr };
