export const STORAGE_SAVE_IN_MINUTES = 'STORAGE_SAVE_IN_MINUTES';

const STORAGE_TIME_KEY = 'STORAGE_TIME_KEY';
export const durationStorage = {
  get(): string {
    const s = localStorage.getItem(STORAGE_TIME_KEY);
    return s || null;
  },
  set(duration: string): void {
    if (duration) {
      localStorage.setItem(STORAGE_TIME_KEY, duration);
    } else {
      this.remove();
    }
  },
  remove() {
    localStorage.removeItem(STORAGE_TIME_KEY);
  },
};
