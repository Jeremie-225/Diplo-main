import { Mail, Phone, MapPin, Clock, Facebook, Linkedin, Instagram } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Card } from '@/components/ui/Card';
import { ContactForm } from '@/components/forms/ContactForm';
import { mockSiteSettings } from '@/data/mockSiteSettings';

export default function Contact() {
  const s = mockSiteSettings;

  return (
    <>
      <section className="gradient-primary text-white pt-32 pb-20 sm:pt-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_60%,rgba(252,211,77,0.18),transparent_50%)]" aria-hidden="true" />
        <Container className="relative">
          <p className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Contact</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight max-w-3xl">
            Let's start a conversation.
          </h1>
          <p className="mt-5 text-lg text-white/85 max-w-2xl">
            Questions, partnership inquiries, or just curious how we can help — drop us a note and we'll respond within one business day.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20 bg-white">
        <Container>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
            {/* Info column */}
            <div className="space-y-5">
              <Card className="!p-6">
                <h2 className="font-bold text-neutral-900 mb-4">Get in touch</h2>
                <ul className="space-y-4 text-sm">
                  <li className="flex gap-3">
                    <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-700/70 font-semibold">Office</p>
                      <p className="text-neutral-900">{s.contact.address}</p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Phone className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-700/70 font-semibold">Phone</p>
                      <a href={`tel:${s.contact.phone}`} className="text-neutral-900 hover:text-primary">
                        {s.contact.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Mail className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-700/70 font-semibold">Email</p>
                      <a href={`mailto:${s.contact.email}`} className="text-neutral-900 hover:text-primary">
                        {s.contact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="inline-flex w-9 h-9 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                      <Clock className="w-4 h-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-neutral-700/70 font-semibold">Hours</p>
                      <p className="text-neutral-900">{s.contact.hours}</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-5 pt-5 border-t border-neutral-100">
                  <p className="text-xs uppercase tracking-wider text-neutral-700/70 font-semibold mb-3">Follow us</p>
                  <div className="flex gap-2">
                    <a
                      href={s.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="p-2.5 rounded-md bg-neutral-100 hover:bg-primary hover:text-white text-neutral-700 transition-colors"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                    <a
                      href={s.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="p-2.5 rounded-md bg-neutral-100 hover:bg-primary hover:text-white text-neutral-700 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href={s.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="p-2.5 rounded-md bg-neutral-100 hover:bg-primary hover:text-white text-neutral-700 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </Card>

              {/* Map placeholder — Phase 2 will replace with a real Google Maps embed */}
              <div
                className="rounded-2xl overflow-hidden border border-neutral-100 shadow-soft aspect-[4/3] relative bg-gradient-to-br from-primary to-primary-light"
                role="img"
                aria-label="Map placeholder showing office location"
              >
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent text-primary mb-3 shadow-lift">
                      <MapPin className="w-6 h-6" />
                    </span>
                    <p className="font-semibold">{s.contact.address.split(',')[0]}</p>
                    <p className="text-xs text-white/80 mt-1">Map embed available in Phase 2</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <Card className="!p-6 sm:!p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Send us a message</h2>
              <p className="text-sm text-neutral-700 mb-6">
                Fill out the form and we'll be in touch within one business day.
              </p>
              <ContactForm />
            </Card>
          </div>
        </Container>
      </section>
    </>
  );
}
