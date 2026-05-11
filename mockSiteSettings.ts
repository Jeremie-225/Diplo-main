import type { SiteSettings } from '@/types';

// =====================================================================
// Real Diplo FZE Limited site settings — verbatim copy where indicated.
// Mission text is the official catalogue paragraph; do not paraphrase.
// =====================================================================
export const mockSiteSettings: SiteSettings = {
  heroHeadline: 'Your Gateway to Africa.',
  heroSubheadline:
    'Premium beverages and select foods, distributed across West Africa since 2003.',
  heroCtaPrimary: 'Explore Catalogue',
  heroCtaSecondary: 'Become a Partner',
  stats: {
    yearsActive: '20+',
    products: '160+',
    partners: '20+',
    clients: '1K+', // 7 active markets (6 partners + Ghana HQ)
  },
  // Verbatim from the printed Diplo Catalogue 2026 — do NOT paraphrase.
  missionStatement:
    'Founded in 2003, Diplo was established with a clear mission — to import and distribute premium beverages & food across the West African market. From the very beginning, our belief has been simple yet powerful: quality liquors should be accessible and affordable, not an inclusive luxury. Every product in our portfolio is carefully handpicked through a rigorous selection process, ensuring that each bottle meets our high standards of taste and quality. Our goal is to offer customers a diverse range of exceptional beverages & food that combine great flavor, consistent quality, and fair pricing — making every experience with Diplo both enjoyable and within reach.',
  // TODO: Confirm with client — placeholder vision statement.
  visionStatement:
    'To remain West Africa\'s most trusted gateway for premium beverages & select foods and connecting world-class brands with the retailers, hotels, and distributors who serve West Africa.',
  contact: {
    email: 'info@diplofzghana.com',
    // TODO: Get real phone number from client — placeholder formatted only.
    phone: '+233 (0) 553 340 0400',
    whatsapp: '233553400400',
    address: 'Tema Enclave Free Zone, Tema, Greater Accra, Ghana',
    hours: 'Mon-Fri: 8:00 AM - 5:00 PM',
  },
  social: {
    // TODO: Replace with real social handles when client provides them.
    facebook: 'https://facebook.com/',
    linkedin: 'https://linkedin.com/',
    instagram: 'https://instagram.com/',
  },
  footerAbout:
    'Diplo FZE Limited — your gateway to Africa. Importing and distributing premium beverages and select foods across West Africa since 2003.',
};
