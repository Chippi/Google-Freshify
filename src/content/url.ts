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

export { getGoogleTimeParam, mapToQdr };
