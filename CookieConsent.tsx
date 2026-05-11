import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const STORAGE_KEY = 'cookie-consent';

/**
 * Bottom-fixed slide-up consent banner. Shows on first visit only — once the
 * user clicks Accept or Decline, we write to localStorage and never show it
 * again on this device. (No real cookies are set in Phase 1; this is the
 * UI scaffolding for Phase 2 analytics.)
 */
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Defer to next tick so we don't pop the banner during page transition
    const t = window.setTimeout(() => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
      } catch {
        /* localStorage may be unavailable in privacy modes — silently skip. */
      }
    }, 1500);
    return () => window.clearTimeout(t);
  }, []);

  const close = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-md z-40 rounded-2xl bg-white border border-neutral-100 shadow-lift p-5"
        >
          <div className="flex items-start gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-primary shrink-0">
              <Cookie className="w-5 h-5" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-neutral-900">We use cookies</p>
              <p className="mt-1 text-sm text-neutral-700 leading-relaxed">
                We use a small number of cookies to keep this site fast and to
                understand which pages help our visitors most. You can opt out
                anytime.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => close('accepted')}>
                  Accept
                </Button>
                <Button size="sm" variant="ghost" onClick={() => close('declined')}>
                  Decline
                </Button>
              </div>
            </div>
            <button
              type="button"
              aria-label="Dismiss"
              onClick={() => close('declined')}
              className="p-1 rounded-md text-neutral-700 hover:bg-neutral-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CookieConsent;
