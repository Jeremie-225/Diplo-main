import { lazy, Suspense, type ReactNode } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PublicLayout from '@/components/layout/PublicLayout';
import {
  HomeSkeleton,
  ProductsListSkeleton,
  ProductDetailSkeleton,
  ContactSkeleton,
  GenericSkeleton,
} from '@/components/ui/Skeletons';

// =====================================================================
// Lazy-loaded routes — each page is its own bundle, kept small with
// React.lazy. Suspense fallback shows a tailored skeleton matching the
// page's rough layout so there's no jarring layout shift on load.
// =====================================================================
const Home = lazy(() => import('@/pages/public/Home'));
const About = lazy(() => import('@/pages/public/About'));
const ProductsLanding = lazy(() => import('@/pages/public/ProductsLanding'));
const OwnProducts = lazy(() => import('@/pages/public/OwnProducts'));
const PartnerProducts = lazy(() => import('@/pages/public/PartnerProducts'));
const ProductDetail = lazy(() => import('@/pages/public/ProductDetail'));
const Services = lazy(() => import('@/pages/public/Services'));
const Contact = lazy(() => import('@/pages/public/Contact'));
const QuoteRequest = lazy(() => import('@/pages/public/QuoteRequest'));
const VilniausDegtinePage = lazy(() => import('@/pages/public/partners/VilniausDegtinePage'));
const MassIndustriesPage = lazy(() => import('@/pages/public/partners/MassIndustriesPage'));
const SimulatePage = lazy(() => import('@/pages/public/SimulatePage'));
const DutyFreePage = lazy(() => import('@/pages/public/DutyFreePage'));
const NotFound = lazy(() => import('@/pages/public/NotFound'));

/**
 * Pick a skeleton based on the current pathname so each lazy route shows
 * something resembling its own shape during chunk download.
 */
function PathAwareSkeleton(): ReactNode {
  const { pathname } = useLocation();
  if (pathname === '/') return <HomeSkeleton />;
  if (pathname.startsWith('/products/own/') || pathname.startsWith('/products/partners/')) {
    return <ProductDetailSkeleton />;
  }
  if (pathname.startsWith('/products')) return <ProductsListSkeleton />;
  if (pathname.startsWith('/contact')) return <ContactSkeleton />;
  return <GenericSkeleton />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <Suspense fallback={<HomeSkeleton />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<GenericSkeleton />}>
              <About />
            </Suspense>
          }
        />
        {/* Products landing — index page that funnels visitors into Own
            or Partner brands. */}
        <Route
          path="/products"
          element={
            <Suspense fallback={<ProductsListSkeleton />}>
              <ProductsLanding />
            </Suspense>
          }
        />
        <Route
          path="/products/own"
          element={
            <Suspense fallback={<ProductsListSkeleton />}>
              <OwnProducts />
            </Suspense>
          }
        />
        <Route
          path="/products/own/:slug"
          element={
            <Suspense fallback={<ProductDetailSkeleton />}>
              <ProductDetail kind="own" />
            </Suspense>
          }
        />
        <Route
          path="/products/partners"
          element={
            <Suspense fallback={<ProductsListSkeleton />}>
              <PartnerProducts />
            </Suspense>
          }
        />
        <Route
          path="/products/partners/:slug"
          element={
            <Suspense fallback={<ProductDetailSkeleton />}>
              <ProductDetail kind="partner" />
            </Suspense>
          }
        />
        {/* Partner landing pages */}
        <Route
          path="/partners/vilniaus-degtine"
          element={
            <Suspense fallback={<GenericSkeleton />}>
              <VilniausDegtinePage />
            </Suspense>
          }
        />
        <Route
          path="/partners/mass-industries"
          element={
            <Suspense fallback={<GenericSkeleton />}>
              <MassIndustriesPage />
            </Suspense>
          }
        />
        <Route
          path="/services"
          element={
            <Suspense fallback={<GenericSkeleton />}>
              <Services />
            </Suspense>
          }
        />
        <Route
          path="/contact"
          element={
            <Suspense fallback={<ContactSkeleton />}>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="/quote"
          element={
            <Suspense fallback={<GenericSkeleton />}>
              <QuoteRequest />
            </Suspense>
          }
        />
        <Route
          path="/simulate"
          element={
            <Suspense fallback={<GenericSkeleton />}>
              <SimulatePage />
            </Suspense>
          }
        />
        <Route
          path="/duty-free"
          element={
            <Suspense fallback={<GenericSkeleton />}>
              <DutyFreePage />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PathAwareSkeleton />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
}
