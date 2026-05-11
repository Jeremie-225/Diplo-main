import { useSearchParams } from 'react-router-dom';
import { CheckCircle2, Handshake } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { QuoteForm } from '@/components/forms/QuoteForm';

export default function QuoteRequest() {
  const [params] = useSearchParams();
  const fromSimulator = params.get('from') === 'simulator';
  const isPartnerInquiry = params.get('type') === 'partner';

  return (
    <>
      <section className="gradient-primary text-white pt-32 pb-16 sm:pt-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(252,211,77,0.18),transparent_50%)]" aria-hidden="true" />
        <Container className="relative">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">
            {isPartnerInquiry ? 'Partnership Inquiry' : 'Request a Quote'}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight max-w-3xl">
            {isPartnerInquiry
              ? "Let's talk about distributing Diplo across your market."
              : "Tell us what you need — we'll send pricing within 24 hours."}
          </h1>
          <p className="mt-4 text-base text-white/85 max-w-2xl">
            {isPartnerInquiry
              ? "Tell us about your business — we'll be in touch within one business day to discuss partnership terms."
              : 'Three quick steps. Most quotes are returned the same business day.'}
          </p>
        </Container>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <Container size="lg">
          {isPartnerInquiry && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-accent/40 bg-accent/15 px-4 py-3">
              <Handshake className="w-5 h-5 text-primary shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-primary">🤝 Partnership Inquiry</p>
                <p className="text-xs text-neutral-700 mt-0.5">
                  Your message has been pre-filled. Share a few details about your company and we'll
                  reach out to discuss next steps.
                </p>
              </div>
            </div>
          )}
          {fromSimulator && (
            <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-green-800">Loaded from simulation</p>
                <p className="text-xs text-green-600 mt-0.5">
                  Your container simulation details have been pre-filled in the message below.
                </p>
              </div>
            </div>
          )}
          <QuoteForm />
        </Container>
      </section>
    </>
  );
}
