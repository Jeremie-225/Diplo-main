// =====================================================================
// Compatibility shim — the legacy import path `@/data/mockCategories`
// is kept so older modules don't break.  The real source of truth is
// `@/data/categories.ts`.
// =====================================================================
export { categories as mockCategories } from './categories';
