import { Plane, Truck, Ship } from 'lucide-react';
import { Container } from '@/components/ui/Container';

/**
 * Compact horizontal strip placed under the hero — three pill chips
 * (air, land, sea) followed by a single tagline.  Mobile-first: pills
 * wrap on small screens.
 */
export function LogisticsTrustStrip() {
  return (
    <section className="bg-white border-b border-neutral-100" aria-label="Logistics modes">
      <Container>
        <div className="py-5 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 sm:gap-8 text-sm">
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-primary font-semibold">
              <Plane className="w-3.5 h-3.5" /> Air
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-primary font-semibold">
              <Truck className="w-3.5 h-3.5" /> Land
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 text-primary font-semibold">
              <Ship className="w-3.5 h-3.5" /> Sea
            </span>
          </div>
          <p className="text-neutral-700 text-center sm:text-left">
            Fast, reliable, multi-modal delivery across West Africa.
          </p>
        </div>
      </Container>
    </section>
  );
}

export default LogisticsTrustStrip;
