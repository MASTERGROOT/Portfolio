import { writable } from 'svelte/store';

const stored = (typeof localStorage !== 'undefined' && localStorage.getItem('lang')) || 'en';
export const langStore = writable(stored);

langStore.subscribe(v => {
  if (typeof localStorage !== 'undefined') localStorage.setItem('lang', v);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = v;
    document.body.classList.toggle('lang-th', v === 'th');
  }
});
