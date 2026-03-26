import React        from 'react';
import ReactDOM     from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter }  from 'react-router-dom';
import { PersistGate }    from 'redux-persist/integration/react';
import { store, persistor } from './store/store.js';
import App   from './App.jsx';
import './index.css';

/* ── Persist-gate loading screen ── */
function PersistLoader() {
  return (
    <div className="fixed inset-0 bg-[var(--color-paper)] flex flex-col
                    items-center justify-center gap-6 z-50">
      {/* Brand mark */}
      <div className="relative flex items-center justify-center w-16 h-16">
        <span className="absolute inset-0 rounded-2xl bg-[var(--color-ink)]
                         opacity-10 animate-ping" />
        <div className="relative w-16 h-16 rounded-2xl bg-[var(--color-ink)]
                        flex items-center justify-center shadow-xl
                        shadow-[var(--color-ink)]/20">
          {/* Simple "S" wordmark */}
          <span className="text-2xl font-bold text-[var(--color-gold)]
                           tracking-tight select-none">
            S
          </span>
        </div>
      </div>

      {/* Brand name */}
      <div className="text-center">
        <p className="text-lg font-bold text-[var(--color-ink)] tracking-tight">
          SketchMint
        </p>
        <p className="text-xs text-[var(--color-mist)] mt-1 animate-pulse">
          Loading your experience…
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-48 h-1 bg-[var(--color-cream)] rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-[var(--color-rust)]
                        via-[var(--color-gold)] to-[var(--color-sage)]
                        rounded-full animate-shimmer" />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<PersistLoader />} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);