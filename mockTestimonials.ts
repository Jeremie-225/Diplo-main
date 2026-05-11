import type { Testimonial } from '@/types';

export const mockTestimonials: Testimonial[] = [
  {
    id: 't-1',
    authorName: 'Marie Nguemo',
    authorTitle: 'Procurement Manager',
    authorCompany: 'Central Markets Ltd.',
    authorPhoto: 'https://placehold.co/200x200/1E3A8A/FCD34D?text=MN',
    quote:
      'Their reliability and quality have made them our preferred distributor for over five years. Always on time, always professional.',
    rating: 5,
    isFeatured: true,
    orderIndex: 1,
  },
  {
    id: 't-2',
    authorName: 'Jean-Paul Mballa',
    authorTitle: 'CEO',
    authorCompany: 'Mballa Retail Group',
    authorPhoto: 'https://placehold.co/200x200/FCD34D/1E3A8A?text=JM',
    quote:
      'Outstanding service and competitive pricing. They understand the local market like no one else.',
    rating: 5,
    isFeatured: true,
    orderIndex: 2,
  },
  {
    id: 't-3',
    authorName: 'Aïcha Bello',
    authorTitle: 'Operations Director',
    authorCompany: 'Sahel Trading Co.',
    authorPhoto: 'https://placehold.co/200x200/3B82F6/FFFFFF?text=AB',
    quote:
      'A true partner in our growth. Their team goes above and beyond to ensure our success.',
    rating: 5,
    isFeatured: true,
    orderIndex: 3,
  },
  {
    id: 't-4',
    authorName: 'David Tchoumi',
    authorTitle: 'Founder',
    authorCompany: 'Quick Mart Stores',
    authorPhoto: 'https://placehold.co/200x200/0F172A/FCD34D?text=DT',
    quote:
      'Consistently high-quality products and a customer service team that actually listens.',
    rating: 4,
    isFeatured: false,
    orderIndex: 4,
  },
];
