/**
 * DutyFreePage — /duty-free
 *
 * All facts (shop sizes, locations, population reach, services) are sourced
 * from `claude/docs/Diplo Intro Presentation - 2023.pdf` and `dutyFreeShops.ts`.
 * Do not pad with invented content. Mark gaps with TODO comments.
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  ShoppingBag,
  Wine,
  Coffee,
  Sparkles,
  MapPin,
  Truck,
  Clock,
  Globe2,
  Handshake,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { LinkButton } from '@/components/ui/Button';
import {
  DUTY_FREE_SHOPS,
  TEMA_HUB,
  TOTAL_POPULATION_REACH_M,
} from '@/data/dutyFreeShops';
import imgHero from '@/assets/duty-free/dutyfree-cover-00.jpg';

export default function DutyFreePage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Duty Free Shops | Diplo FZE Limited';
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute('content') ?? '';
    if (meta) {
      meta.setAttribute(
        'content',
        "Diplo FZE operates three border duty free shops at Ghana's Aflao, Paga and Elubu crossings, supplied by our 5,500 m² Tema freezone enclave.",
      );
    }
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc) meta.setAttribute('content', prevDesc);
    };
  }, []);

  return (
    <>
      {/* ─── Hero — full-bleed real photo with navy overlay ───────────── */}
      <section className="relative text-white pt-32 pb-16 sm:pt-40 sm:pb-20 overflow-hidden">
        {/* Background photograph (port-yard at twilight, from the Diplo deck) */}
        <img
          src={imgHero}
          alt=""
          width={1980}
          height={1322}
          loading="eager"
          decoding="async"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Navy gradient overlay for text contrast — heavier at the top
            where the headline sits, lighter near the stats grid. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/70 to-primary/55"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(252,211,77,0.18),transparent_55%)]"
          aria-hidden="true"
        />

        <Container className="relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/70 mb-5" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-accent">Home</Link>
            <ChevronRight className="w-3 h-3" aria-hidden="true" />
            <span className="text-white">Duty Free Shops</span>
          </nav>

          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            Border Stores · Cash & Carry
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight max-w-4xl">
            Duty Free Shops at the gates of West Africa.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
            Three border outlets at Ghana's busiest land crossings, supplied by our central
            freezone enclave in Tema. A combined retail reach of {TOTAL_POPULATION_REACH_M}+ million
            people across Togo, Benin, Niger, Burkina Faso, Mali and Côte d'Ivoire.
          </p>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
            <Stat label="Border shops" value="3" />
            <Stat label="Central WH" value="5,500 m²" />
            <Stat label="Population reach" value={`${TOTAL_POPULATION_REACH_M}M+`} />
            <Stat label="SKUs" value="700+" />
          </div>
        </Container>
      </section>

      {/* ─── Introduction ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
                Route to Market
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
                Where the freezone meets the customer.
              </h2>
              <p className="mt-5 text-neutral-700 leading-relaxed">
                Diplo's duty free network is built around one simple idea: meet the buyer at the
                border. Each of our three shops sits directly on a Ghanaian land crossing, stocked
                daily from our central Tema freezone — so traders, fleet operators and travellers
                find what they need without a detour into the country.
              </p>
              <p className="mt-4 text-neutral-700 leading-relaxed">
                Together, Aflao, Paga and Elubu give us a footprint that touches six West African
                markets. The shops are cash &amp; carry by design, with mix-shipment loading and
                24-hour delivery from the Tema hub keeping shelves moving.
              </p>
            </div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lift bg-neutral-100">
              <img
                src={TEMA_HUB.image}
                alt="Diplo FZE Tema enclave warehouse exterior with loading bays"
                width={800}
                height={600}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Locations ────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <Container>
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
              Strategic Placement
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
              Three border shops. Six markets.
            </h2>
            <p className="mt-4 text-neutral-700 leading-relaxed">
              Each shop is positioned where the road traffic is — sized for the markets it serves.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {DUTY_FREE_SHOPS.map((shop, i) => (
              <motion.article
                key={shop.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-lift transition-shadow border border-neutral-100"
              >
                <div className="aspect-[16/10] bg-neutral-100 relative overflow-hidden">
                  <img
                    src={shop.image}
                    alt={`Inside the ${shop.name} duty free shop on the ${shop.border}`}
                    width={800}
                    height={500}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 left-3 inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent text-primary font-extrabold text-sm shadow-soft">
                    {shop.marker}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-extrabold text-neutral-900">{shop.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500 font-semibold inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" aria-hidden="true" />
                    {shop.border}
                  </p>
                  <p className="mt-3 text-sm text-neutral-700 leading-relaxed">{shop.description}</p>
                  <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Size</dt>
                      <dd className="font-bold text-neutral-900">{shop.size_m2.toLocaleString()} m²</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Reach</dt>
                      <dd className="font-bold text-neutral-900">{shop.populationReach_m}M people</dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Serves</dt>
                      <dd className="font-semibold text-neutral-700">{shop.serves}</dd>
                    </div>
                  </dl>
                </div>
              </motion.article>
            ))}
          </div>

          {/* Tema central note */}
          <div className="mt-10 rounded-2xl border-2 border-dashed border-primary/20 bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center">
              <Truck className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold">Central hub</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-neutral-900 mt-1">
                {TEMA_HUB.name} — {TEMA_HUB.size_m2.toLocaleString()} m²
              </h3>
              <p className="mt-2 text-neutral-700 leading-relaxed">{TEMA_HUB.description}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Photo gallery — pulled from the actual deck ─────────────── */}
      <section className="py-12 sm:py-16 bg-white" aria-label="Shop photo gallery">
        <Container>
          <div className="max-w-2xl mb-6">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
              On the ground
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 leading-tight">
              Real shop photos.
            </h2>
            <p className="mt-2 text-sm text-neutral-700 leading-relaxed">
              Storefronts, shelves and loading docks across all three Diplo
              Duty Free locations.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {DUTY_FREE_SHOPS.flatMap((shop) =>
              shop.gallery.slice(0, 2).map((src, gi) => (
                <figure
                  key={`${shop.id}-${gi}`}
                  className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 group"
                >
                  <img
                    src={src}
                    alt={`${shop.name} — photo ${gi + 1}`}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <figcaption className="absolute bottom-1.5 left-1.5 inline-flex items-center px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold tracking-wide">
                    {shop.name.replace(' Duty Free', '').replace(' Enclave', '')}
                  </figcaption>
                </figure>
              )),
            )}
          </div>
        </Container>
      </section>

      {/* ─── What we offer ───────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
              What we stock
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
              700+ SKUs across the FMCG range.
            </h2>
            <p className="mt-4 text-neutral-700 leading-relaxed">
              Our duty free shelves carry the full Diplo distribution catalogue — own-label
              private brands plus our partner suppliers' premium lines.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Offer icon={Wine} title="Wines & Spirits" body="Own-label vodka, gin, vermouth and a curated wine portfolio from our partner cellars." />
            <Offer icon={Coffee} title="Beers & Energy" body="Lagers, cans and the Max12 energy line — moving fast across border traffic." />
            <Offer icon={ShoppingBag} title="Foods & Pantry" body="Canned, dry and pasta lines — the everyday SKUs cross-border traders restock." />
            <Offer icon={Sparkles} title="Premium Brands" body="Vilniaus Degtinė, Cody's, Mass Industries Bonita biscuits and selected European partners." />
          </div>
        </Container>
      </section>

      {/* ─── Why Diplo Duty Free ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <Container>
          <div className="max-w-2xl mb-10">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">
              Why our customers like us
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 leading-tight">
              Cash &amp; Carry, the way the border actually works.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Reason icon={Clock} title="24-hour delivery" body="From Tema to any of the three border shops, every day of the week." />
            <Reason icon={Truck} title="Mix shipment loads" body="Combine SKUs across categories on a single load — no full-pallet minimums." />
            <Reason icon={Globe2} title="Sea, land & air" body="Whatever the route the order calls for, we run the freight end-to-end." />
            <Reason icon={Sparkles} title="700+ SKU breadth" body="One stop for the full FMCG range — beverages, foods, energy and more." />
          </div>
        </Container>
      </section>

      {/* ─── CTA banner ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-20 gradient-primary text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(252,211,77,0.15),transparent_50%)]"
          aria-hidden="true"
        />
        <Container className="relative">
          <div className="max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
              Supplying or sourcing through our duty free network?
            </h2>
            <p className="mt-4 text-white/85 text-lg leading-relaxed">
              Whether you're a brand looking to reach West African travellers, or a buyer planning
              a cross-border load, we'd like to talk.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton
                to="/quote?type=partner"
                variant="accent"
                leftIcon={<Handshake className="w-4 h-4" />}
              >
                Become a duty free partner
              </LinkButton>
              <LinkButton
                to="/contact"
                variant="outline"
                className="!border-white/70 !text-white hover:!bg-white hover:!text-primary"
              >
                Get in touch
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// Local presentational helpers
// ---------------------------------------------------------------------------

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur border border-white/15 px-4 py-3">
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold mt-0.5">{label}</p>
    </div>
  );
}

function Offer({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white border border-neutral-100 p-5 hover:shadow-lift hover:-translate-y-0.5 transition-all">
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center mb-3">
        <Icon className="w-5 h-5" aria-hidden="true" />
      </div>
      <h3 className="font-bold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{body}</p>
    </div>
  );
}

function Reason({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-white border border-neutral-100 p-5">
      <div className="w-9 h-9 rounded-lg bg-accent/20 text-primary flex items-center justify-center mb-3">
        <Icon className="w-4 h-4" aria-hidden="true" />
      </div>
      <h3 className="font-bold text-neutral-900">{title}</h3>
      <p className="mt-2 text-sm text-neutral-700 leading-relaxed">{body}</p>
    </div>
  );
}
