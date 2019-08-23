import { STORAGE_SAVE_IN_MINUTES } from '../storage';
import './popup.scss';

const clearInput = document.querySelector<HTMLInputElement>('#clearInput');

chrome.storage.sync.get(STORAGE_SAVE_IN_MINUTES, obj => {
  const value = obj && obj.saveInMinutes;

  if (value) {
    clearInput.value = value;
  }

  listenForInputChanges();
});

const listenForInputChanges = () => {
  clearInput.addEventListener('change', event => {
    const value = clearInput.value;

    chrome.storage.sync.set({ STORAGE_SAVE_IN_MINUTES: value });
  });
};
