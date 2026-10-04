// Polyfill/shim for browser environments where window.fetch is a getter-only property
if (typeof window !== 'undefined') {
  try {
    let _activeFetch = window.fetch ? window.fetch.bind(window) : undefined;
    const proto = Object.getPrototypeOf(window) || (typeof Window !== 'undefined' ? Window.prototype : null);

    const makeFetchWritable = (target: any) => {
      if (!target) return;
      try {
        Object.defineProperty(target, 'fetch', {
          get() {
            return _activeFetch;
          },
          set(fn) {
            _activeFetch = fn;
          },
          configurable: true,
          enumerable: true
        });
      } catch {
        // ignore
      }
    };

    makeFetchWritable(window);
    if (proto) makeFetchWritable(proto);

    // Suppress unhandled getter error if an external script tries to assign to window.fetch
    window.addEventListener('error', (event) => {
      if (event?.message && event.message.includes('fetch') && event.message.includes('getter')) {
        event.preventDefault();
        return true;
      }
    });
  } catch {
    // ignore
  }
}

import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
