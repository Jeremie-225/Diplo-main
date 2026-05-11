import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils';

/**
 * Skeleton fallbacks tailored to each lazy route. Each one mirrors the rough
 * shape of the page it's standing in for so the layout doesn't pop on load.
 *
 * The visual shimmer is implemented as a `.skeleton` utility in global.css
 * (animated background gradient).
 */

function Bar({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded', className)} />;
}

function CardBlock({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded-2xl', className)} />;
}

export function HomeSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-screen">
      {/* Hero */}
      <div className="bg-primary/95 pt-32 pb-24">
        <Container>
          <Bar className="h-4 w-44 mb-6 bg-white/20" />
          <Bar className="h-12 w-3/4 mb-3 bg-white/20" />
          <Bar className="h-12 w-1/2 mb-6 bg-white/20" />
          <Bar className="h-4 w-2/3 mb-2 bg-white/15" />
          <Bar className="h-4 w-1/2 mb-8 bg-white/15" />
          <div className="flex gap-3">
            <Bar className="h-12 w-40 bg-white/20" />
            <Bar className="h-12 w-32 bg-white/15" />
          </div>
        </Container>
      </div>
      {/* Stats */}
      <Container>
        <div className="py-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardBlock key={i} className="h-28" />
          ))}
        </div>
      </Container>
      {/* Section */}
      <Container>
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardBlock key={i} className="h-56" />
          ))}
        </div>
      </Container>
    </div>
  );
}

export function ProductsListSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-screen pt-24">
      <Container>
        <Bar className="h-4 w-24 mb-2" />
        <Bar className="h-10 w-48 mb-3" />
        <Bar className="h-4 w-2/3 mb-8" />
        <div className="grid lg:grid-cols-[240px_1fr] gap-8">
          <div className="hidden lg:block space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Bar key={i} className="h-9 w-full" />
            ))}
          </div>
          <div>
            <div className="flex gap-3 mb-6">
              <Bar className="h-10 flex-1" />
              <Bar className="h-10 w-44" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <CardBlock key={i} className="h-72" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-screen pt-24">
      <Container>
        <Bar className="h-4 w-72 mb-6" />
        <div className="grid lg:grid-cols-2 gap-10">
          <CardBlock className="aspect-square" />
          <div className="space-y-4">
            <Bar className="h-4 w-24" />
            <Bar className="h-10 w-full" />
            <Bar className="h-8 w-32" />
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-5/6" />
            <Bar className="h-4 w-3/4" />
            <div className="flex gap-3 mt-4">
              <Bar className="h-12 w-40" />
              <Bar className="h-12 w-36" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function NewsListSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-screen pt-24">
      <Container>
        <Bar className="h-4 w-32 mb-2" />
        <Bar className="h-10 w-64 mb-3" />
        <Bar className="h-4 w-2/3 mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardBlock key={i} className="h-80" />
          ))}
        </div>
      </Container>
    </div>
  );
}

export function ContactSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-screen pt-24">
      <Container>
        <Bar className="h-10 w-2/3 mb-3" />
        <Bar className="h-4 w-1/2 mb-10" />
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10">
          <CardBlock className="h-96" />
          <CardBlock className="h-96" />
        </div>
      </Container>
    </div>
  );
}

export function GenericSkeleton() {
  return (
    <div aria-hidden="true" className="min-h-[60vh] container mx-auto py-20 space-y-6">
      <Bar className="h-10 w-2/3" />
      <Bar className="h-4 w-full" />
      <Bar className="h-4 w-5/6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <CardBlock className="h-48" />
        <CardBlock className="h-48" />
        <CardBlock className="h-48" />
      </div>
    </div>
  );
}
