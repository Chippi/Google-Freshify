export const STORAGE_SAVE_IN_MINUTES = 'STORAGE_SAVE_IN_MINUTES';

const STORAGE_TIME_KEY = 'STORAGE_TIME_KEY';
export const durationStorage = {
  get(): Date {
    const s = localStorage.getItem(STORAGE_TIME_KEY);
    if (s) {
      return new Date(JSON.parse(s));
    }
    return null;
  },
  set(date: Date): void {
    if (date) {
      localStorage.setItem(STORAGE_TIME_KEY, JSON.stringify(date));
    } else {
      console.log('storage removing', STORAGE_TIME_KEY);
      localStorage.removeItem(STORAGE_TIME_KEY);
    }
  },
};
