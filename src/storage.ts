export const STORAGE_SAVE_IN_MINUTES = 'STORAGE_SAVE_IN_MINUTES';
export const STORAGE_TIME_KEY = 'STORAGE_TIME_KEY';
const STORAGE_LAST_USED = 'STORAGE_LAST_USED';
export const storage = {
  set: (duration: string) => {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ STORAGE_TIME_KEY: duration }, () => {
        resolve();
        setLastUsed();
      });
    });
  },
  get: () => {
    return new Promise<string>((resolve, reject) => {
      chrome.storage.sync.get(STORAGE_TIME_KEY, value => {
        resolve(value.STORAGE_TIME_KEY || null);
      });
    });
  },
  getLastUsed,
};

function setLastUsed() {
  chrome.storage.sync.set({ STORAGE_LAST_USED: JSON.stringify(new Date()) });
}

function getLastUsed() {
  return new Promise<Date>((resolve, reject) => {
    chrome.storage.sync.get(STORAGE_LAST_USED, value => {
      if (!value[STORAGE_LAST_USED]) {
        resolve(null);
      }
      try {
        resolve(new Date(JSON.parse(value[STORAGE_LAST_USED])));
      } catch (e) {
        resolve(null);
      }
    });
  });
}
