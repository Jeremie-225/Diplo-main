import { motion } from 'framer-motion';
import { Truck, Megaphone, Boxes, ClipboardCheck, Search, Truck as TruckIcon, BarChart3, MapPin } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';

const services = [
  {
    icon: Truck,
    title: 'Distribution',
    text: 'Reliable last-mile delivery across cities and regional markets, with real-time order tracking and dedicated route optimization.',
    bullets: ['Daily routes to major cities', 'Cold-chain capable', 'Same-day urgent delivery'],
  },
  {
    icon: Megaphone,
    title: 'Marketing',
    text: 'Trade marketing, in-store activation, and brand campaigns designed to grow your shelf presence and pull-through.',
    bullets: ['POS materials & merchandising', 'Promotional campaigns', 'Sampling & activation events'],
  },
  {
    icon: Boxes,
    title: 'Warehousing',
    text: 'Modern, climate-controlled warehouses with full WMS, pick-and-pack, and consolidation services.',
    bullets: ['Climate-controlled storage', 'Real-time inventory portal', 'Pick, pack & ship'],
  },
];

const process = [
  { icon: ClipboardCheck, title: 'Onboard', text: 'We learn your business, products, and goals.' },
  { icon: Search, title: 'Plan', text: 'A tailored distribution and marketing plan is built.' },
  { icon: TruckIcon, title: 'Execute', text: 'Products move through our network to your customers.' },
  { icon: BarChart3, title: 'Optimize', text: 'Monthly reviews keep performance trending up.' },
];

export default function Services() {
  return (
    <>
      <section className="gradient-primary text-white pt-32 pb-20 sm:pt-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(252,211,77,0.18),transparent_50%)]" aria-hidden="true" />
        <Container className="relative">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Services</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl">
            Distribution, marketing, and warehousing — under one roof.
          </h1>
          <p className="mt-5 text-lg text-white/85 max-w-2xl">
            We handle the operational heavy lifting so you can focus on building your brand and growing your business.
          </p>
        </Container>
      </section>

      <section className="py-20 sm:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {services.map((srv, idx) => (
              <motion.div
                key={srv.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Card className="h-full !p-8 flex flex-col">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-primary text-white mb-5">
                    <srv.icon className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-3">{srv.title}</h2>
                  <p className="text-neutral-700 leading-relaxed mb-5">{srv.text}</p>
                  <ul className="space-y-2 mt-auto">
                    {srv.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-neutral-700">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" aria-hidden="true" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Coverage map placeholder */}
      <section className="py-20 sm:py-24 bg-neutral-50">
        <Container>
          <SectionHeading
            eyebrow="Our reach"
            title="Coverage that grows with you."
            description="A regional footprint built for reliability — three hubs and counting."
          />
          <div className="mt-10 rounded-3xl overflow-hidden border border-neutral-100 shadow-soft">
            <div
              className="relative w-full aspect-[16/9] bg-gradient-to-br from-primary to-primary-light"
              role="img"
              aria-label="Coverage map placeholder showing regional distribution hubs"
            >
              {/* Decorative grid */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                  backgroundSize: '60px 60px',
                }}
                aria-hidden="true"
              />
              {/* Pin markers */}
              {[
                { top: '35%', left: '28%', label: 'North hub' },
                { top: '55%', left: '50%', label: 'Central hub' },
                { top: '70%', left: '72%', label: 'East hub' },
              ].map((pin) => (
                <div
                  key={pin.label}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: pin.top, left: pin.left }}
                >
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-accent animate-ping" aria-hidden="true" />
                    <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-accent text-primary shadow-lift">
                      <MapPin className="w-4 h-4" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs text-white font-semibold whitespace-nowrap text-center">
                    {pin.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Process timeline */}
      <section className="py-20 sm:py-24 bg-white">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="A simple four-step process."
            description="From kickoff to ongoing optimization, here's how a partnership unfolds."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div
              className="hidden lg:block absolute left-0 right-0 top-7 h-0.5 bg-gradient-to-r from-primary via-primary-light to-accent"
              aria-hidden="true"
            />
            {process.map((step, idx) => (
              <div key={step.title} className="relative bg-white rounded-2xl border border-neutral-100 p-6 shadow-soft">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent text-primary font-extrabold text-lg shadow-soft mb-4 relative z-10">
                  {idx + 1}
                </div>
                <step.icon className="w-5 h-5 text-primary-light mb-2" aria-hidden="true" />
                <h3 className="font-bold text-neutral-900 mb-1">{step.title}</h3>
                <p className="text-sm text-neutral-700">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <LinkButton to="/contact" size="lg">
              Talk to our team
            </LinkButton>
          </div>
        </Container>
      </section>
    </>
  );
}
