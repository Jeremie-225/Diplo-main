import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { CommandPaletteProvider } from '@/components/ui/CommandPaletteProvider';
import '@/styles/global.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root container #root not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* CommandPaletteProvider attaches the global ⌘K / Ctrl+K shortcut
          and provides a context that any component can use to open the
          palette programmatically (e.g. the header's "⌘K" pill). */}
      <CommandPaletteProvider>
        <App />
      </CommandPaletteProvider>
      {/*
        Branded toasts: white background, blue success border, soft shadow.
        Slides from the top-right corner on appear (default of react-hot-toast).
      */}
      <Toaster
        position="top-right"
        gutter={10}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#0F172A',
            borderRadius: '0.75rem',
            padding: '0.85rem 1rem',
            fontSize: '0.875rem',
            border: '1px solid #F1F5F9',
            boxShadow: '0 12px 32px -8px rgba(15, 23, 42, 0.18)',
          },
          success: {
            iconTheme: { primary: '#1E3A8A', secondary: '#FFFFFF' },
            style: {
              background: '#ffffff',
              color: '#0F172A',
              borderLeft: '4px solid #1E3A8A',
              borderRadius: '0.75rem',
              padding: '0.85rem 1rem',
              fontSize: '0.875rem',
              boxShadow: '0 12px 32px -8px rgba(30, 58, 138, 0.25)',
            },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
            style: {
              background: '#ffffff',
              color: '#0F172A',
              borderLeft: '4px solid #EF4444',
              borderRadius: '0.75rem',
              padding: '0.85rem 1rem',
              fontSize: '0.875rem',
              boxShadow: '0 12px 32px -8px rgba(239, 68, 68, 0.25)',
            },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>,
);
