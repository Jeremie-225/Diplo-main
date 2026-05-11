import { motion } from 'framer-motion';
import { Plane, Truck, Ship } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface Pillar {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  /** Background gradient + icon foreground. */
  tone: 'sky' | 'amber' | 'sea';
}

const PILLARS: Pillar[] = [
  {
    icon: Plane,
    label: 'Air',
    title: 'Air freight',
    description:
      'Time-sensitive shipments and urgent restocks. We coordinate with regional airports for fast delivery to clients across our six markets.',
    tone: 'sky',
  },
  {
    icon: Truck,
    label: 'Land',
    title: 'Cross-border land',
    description:
      'Our duty-free border stores at Aflao, Elubu and Paga combine warehousing with last-mile trucking into Togo, Côte d\'Ivoire and Burkina Faso.',
    tone: 'amber',
  },
  {
    icon: Ship,
    label: 'Sea',
    title: 'Sea freight',
    description:
      'Bulk container imports through the Tema port — the engine room of our 5,500 m² central warehouse and West African distribution.',
    tone: 'sea',
  },
];

const toneStyles: Record<Pillar['tone'], { card: string; icon: string; chip: string }> = {
  sky: {
    card: 'from-sky-50 to-white border-sky-100',
    icon: 'bg-sky-500/10 text-sky-600',
    chip: 'bg-sky-500 text-white',
  },
  amber: {
    card: 'from-amber-50 to-white border-amber-100',
    icon: 'bg-accent/20 text-amber-700',
    chip: 'bg-accent text-primary',
  },
  sea: {
    card: 'from-blue-50 to-white border-blue-100',
    icon: 'bg-primary/10 text-primary',
    chip: 'bg-primary text-white',
  },
};

/**
 * Three-pillar logistics capability section: Air / Land / Sea.
 * Each card has a soft gradient background, a tinted icon, and a hover lift.
 */
export function LogisticsCapabilities() {
  return (
    <section className="py-20 sm:py-28 bg-white" aria-labelledby="logistics-heading">
      <Container>
        <SectionHeading
          eyebrow="How we move goods"
          title="Multi-modal logistics, end-to-end."
          description="Sea, land and air — covered by Diplo's central warehouse in Tema and three duty-free border stores across the region."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            const tone = toneStyles[p.tone];
            return (
              <motion.article
                key={p.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`group relative rounded-2xl bg-gradient-to-br ${tone.card} border p-7 shadow-soft hover:shadow-lift transition-shadow`}
              >
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tone.chip}`}
                >
                  <Icon className="w-3.5 h-3.5" /> {p.label}
                </span>
                <div className={`mt-5 inline-flex items-center justify-center w-12 h-12 rounded-xl ${tone.icon}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-xl font-extrabold text-neutral-900">{p.title}</h3>
                <p className="mt-2 text-neutral-700 leading-relaxed text-sm">
                  {p.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export default LogisticsCapabilities;
