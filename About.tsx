import { motion } from 'framer-motion';
import { Target, Eye, Heart, Award, Users, Leaf } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Card } from '@/components/ui/Card';
import { TiltCard } from '@/components/ui/TiltCard';
import { LazyImage } from '@/components/ui/LazyImage';
import { mockSiteSettings } from '@/data/mockSiteSettings';

const values = [
  { icon: Award, title: 'Excellence', text: 'We hold every product, partner, and process to the highest standard.' },
  { icon: Heart, title: 'Integrity', text: 'Honest dealings, transparent pricing, no hidden fees — ever.' },
  { icon: Users, title: 'Partnership', text: 'Your success is our success. We grow when our partners grow.' },
  { icon: Leaf, title: 'Sustainability', text: 'We choose suppliers and practices that respect people and planet.' },
];

export default function About() {
  const s = mockSiteSettings;

  return (
    <>
      {/* Header band */}
      <section className="gradient-primary text-white pt-32 pb-20 sm:pt-40 sm:pb-24 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(252,211,77,0.15),transparent_50%)]"
          aria-hidden="true"
        />
        <Container className="relative">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            About us
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl">
            Two decades of building trusted distribution networks.
          </h1>
          <p className="mt-5 text-lg text-white/85 max-w-2xl">
            Founded on a simple promise — quality products, delivered reliably — Diplo has grown
            into one of Ghana's most respected distribution and marketing partners.
          </p>
        </Container>
      </section>

      {/* Story */}
      <section className="py-20 sm:py-28 bg-white">
        <Container size="lg">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs uppercase tracking-widest font-semibold text-primary-light mb-3">
                Our story
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-5 leading-tight">
                From a small warehouse to a regional network.
              </h2>
              <div className="space-y-4 text-neutral-700 leading-relaxed">
                <p>
                  Diplo Distribution Co. began in 1993 with a single warehouse in Accra, a small
                  team, and an ambitious goal: bring trusted, quality products to retailers
                  underserved by traditional distribution. In our first year we partnered with
                  twelve local stores. Today, we serve over a thousand businesses across Ghana
                  and the wider West African region.
                </p>
                <p>
                  Along the way we have learned that distribution is fundamentally about people —
                  the farmers and producers we source from, the partners who stock our products,
                  and the customers who trust those shelves. Every decision we make starts with
                  that human chain.
                </p>
                <p>
                  Our growth has come from staying obsessively focused on the basics: products
                  that perform, deliveries that arrive on time, and a team that picks up the
                  phone. We believe the next decade belongs to companies that earn trust the
                  old-fashioned way — by keeping their word, every time.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lift">
                <LazyImage
                  src="/background/our-team-bg1.png"
                  alt="The Diplo team at our headquarters"
                  wrapperClassName="w-full h-full"
                />
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-accent rounded-2xl p-5 shadow-lift max-w-[220px]"
              >
                <p className="text-3xl font-extrabold text-primary leading-none">10+</p>
                <p className="text-sm text-primary/80 mt-1">Years of trusted service</p>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 sm:py-24 bg-neutral-50">
        <Container size="lg">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Target, title: 'Mission', text: s.missionStatement, iconBg: 'bg-primary text-accent' },
              { icon: Eye, title: 'Vision', text: s.visionStatement, iconBg: 'bg-accent text-primary' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <TiltCard max={5} className="h-full">
                  <Card className="!p-8 h-full">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${item.iconBg} mb-5`}
                    >
                      <item.icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 mb-3">{item.title}</h2>
                    <p className="text-neutral-700 leading-relaxed">{item.text}</p>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="py-20 sm:py-28 bg-white">
        <Container>
          <SectionHeading
            eyebrow="Our values"
            title="The principles that guide us."
            description="Four ideas we keep coming back to — in hiring, in sourcing, in every customer conversation."
          />
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, idx) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <TiltCard max={6} className="h-full">
                  <div className="text-center bg-neutral-50 rounded-2xl p-7 hover:shadow-lift transition-shadow border border-neutral-100 h-full">
                    <motion.div
                      whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-primary text-white mb-4"
                    >
                      <v.icon className="w-6 h-6" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{v.title}</h3>
                    <p className="text-sm text-neutral-700 leading-relaxed">{v.text}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

    </>
  );
}
