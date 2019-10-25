export const STORAGE_SAVE_IN_MINUTES = 'STORAGE_SAVE_IN_MINUTES';

export const STORAGE_TIME_KEY = 'STORAGE_TIME_KEY';

export const storage = {
  set: async (duration: string) => {
    const p = new Promise((resolve, reject) => {
      chrome.storage.sync.set({ STORAGE_TIME_KEY: duration }, () => {
        resolve();
      });
    });
    const result = await p;
    return result;
  },
  get: async () => {
    const p = new Promise<string>((resolve, reject) => {
      chrome.storage.sync.get(STORAGE_TIME_KEY, value => {
        resolve(value.STORAGE_TIME_KEY);
      });
    });
    const result = await p;
    return result;
  },
};
