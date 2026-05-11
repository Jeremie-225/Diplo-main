import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Star, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { LazyImage } from '@/components/ui/LazyImage';
import { TiltCard } from '@/components/ui/TiltCard';
import { getCategoryById } from '@/data/categories';
import { partnerTypeLabel, cn } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  product: Product;
  className?: string;
  /** Disable the 3D tilt (e.g. inside a horizontally-scrolling carousel). */
  noTilt?: boolean;
}

// Partner-type → Badge tone. Private Label brands get the warm accent tone,
// exclusive partners get primary, regular partners stay neutral.
const partnerTone: Record<string, 'success' | 'accent' | 'primary' | 'neutral'> = {
  PRIVATE_LABEL: 'accent',
  EXCLUSIVE_PARTNER: 'primary',
  PARTNER: 'neutral',
};

/**
 * The hero of the product UX: lifts on hover, image zooms, "View Details"
 * arrow translates, featured ribbon shows in the corner, optional 3D tilt.
 *
 * Phase 1.5: cards never display a price — Diplo doesn't publish pricing.
 * Instead the badge shows the partner type ("Private Label", "Exclusive", etc.)
 * and the CTA is "Price on request" leading to the quote form.
 */
export function ProductCard({ product, className, noTilt }: Props) {
  const category = getCategoryById(product.categoryId);
  // Build the detail-page link based on whether this is an own-brand SKU
  // or a partner SKU — they live under different URL prefixes.
  const detailHref = product.isOwnBrand
    ? `/products/own/${product.slug}`
    : `/products/partners/${product.slug}`;

  const inner = (
    <Link
      to={detailHref}
      className={cn(
        'group block bg-white rounded-2xl border border-neutral-100 shadow-soft overflow-hidden h-full',
        'transition-all duration-300 hover:-translate-y-1 hover:shadow-lift',
        className,
      )}
    >
      <div className="relative">
        {product.isFeatured && (
          <div
            // Yellow corner ribbon for featured items — purely decorative.
            aria-hidden="true"
            className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-accent text-primary px-2.5 py-1 text-[11px] font-bold shadow-soft"
          >
            <Star className="w-3 h-3 fill-primary" />
            Featured
          </div>
        )}
        <LazyImage
          src={product.image}
          alt={product.name}
          wrapperClassName="aspect-[4/3]"
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {/* Quick-view badge slides up from bottom on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-primary/90 to-primary/0 p-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-primary">
            <Eye className="w-3 h-3" />
            Quick view
          </span>
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          {category && (
            <span className="text-xs font-medium text-primary-light uppercase tracking-wider truncate">
              {category.name}
            </span>
          )}
          <Badge tone={partnerTone[product.partnerType] ?? 'neutral'}>
            {partnerTypeLabel(product.partnerType)}
          </Badge>
        </div>
        <h3 className="text-base font-bold text-neutral-900 mb-1 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-sm text-neutral-700 line-clamp-2 mb-3">
            {product.shortDescription}
          </p>
        )}
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-700/80 mb-4">
          {product.origin && (
            <span className="inline-flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {product.origin}
            </span>
          )}
          {product.volume && <span>{product.volume}</span>}
          {product.alcoholContent !== undefined && <span>{product.alcoholContent}% ABV</span>}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
          <span className="text-sm font-bold text-primary">Price on request</span>
          <span className="text-xs font-semibold text-neutral-700 group-hover:text-primary transition-colors inline-flex items-center gap-1">
            Details
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );

  if (noTilt) return inner;
  return (
    <TiltCard max={6} className="h-full">
      {inner}
    </TiltCard>
  );
}

export default ProductCard;
