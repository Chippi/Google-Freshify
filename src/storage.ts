export const STORAGE_SAVE_IN_MINUTES = 'STORAGE_SAVE_IN_MINUTES';

const STORAGE_TIME_KEY = 'STORAGE_TIME_KEY';
export const durationStorage = {
  get(): string {
    const s = localStorage.getItem(STORAGE_TIME_KEY);
    return (s === "null" ? null : s)
  },
  set(duration: string): void {
    localStorage.setItem(STORAGE_TIME_KEY, duration);
  },
};
