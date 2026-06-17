import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { FloatingContact } from "@/components/floating-contact";
import { lazy, Suspense, useEffect } from "react";
import NotFound from "@/pages/not-found";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

const HomePage = lazy(() => import("@/pages/home"));
const ListingsPage = lazy(() => import("@/pages/listings"));
const PropertyDetailPage = lazy(() => import("@/pages/property-detail"));
const LoginPage = lazy(() => import("@/pages/login"));
const RegisterPage = lazy(() => import("@/pages/register"));
const FavoritesPage = lazy(() => import("@/pages/favorites"));
const MessagesPage = lazy(() => import("@/pages/messages"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const AdminPage = lazy(() => import("@/pages/admin"));
const BlogPage = lazy(() => import("@/pages/blog"));
const BlogDetailPage = lazy(() => import("@/pages/blog-detail"));
const TeamPage = lazy(() => import("@/pages/team"));
const BuyingGuidePage = lazy(() => import("@/pages/buying-guide"));
const CitySeoPage = lazy(() => import("@/pages/city-seo"));
const AboutPage = lazy(() => import("@/pages/about"));
const ContactPage = lazy(() => import("@/pages/contact"));
const PressPage = lazy(() => import("@/pages/press"));
const MediaKitPage = lazy(() => import("@/pages/media-kit"));
const InternationalRuPage = lazy(() => import("@/pages/international-ru"));
const InternationalFaPage = lazy(() => import("@/pages/international-fa"));
const EarthquakePage = lazy(() => import("@/pages/earthquake"));
const GeoGuidePage = lazy(() => import("@/pages/geo-guide"));
const GeoFaqPage = lazy(() => import("@/pages/geo-faq"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/istanbul-emlak-ilanlari" component={ListingsPage} />
        <Route path="/istanbul-emlak/:id" component={PropertyDetailPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/favorites" component={FavoritesPage} />
        <Route path="/messages" component={MessagesPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/istanbul-emlak-blog" component={BlogPage} />
        <Route path="/istanbul-emlak-blog/:slug" component={BlogDetailPage} />
        <Route path="/istanbul-emlak-danismanlari" component={TeamPage} />
        <Route path="/istanbul-satin-alma-rehberi" component={BuyingGuidePage} />
        <Route path="/hakkimizda" component={AboutPage} />
        <Route path="/iletisim" component={ContactPage} />
        <Route path="/basin" component={PressPage} />
        <Route path="/medya-kiti" component={MediaKitPage} />
        <Route path="/rusca-emlak-hizmetleri" component={InternationalRuPage} />
        <Route path="/farsca-emlak-hizmetleri" component={InternationalFaPage} />
        <Route path="/deprem-guvenlik-rehberi" component={EarthquakePage} />
        <Route path="/istanbul-emlak-rehberi" component={GeoGuidePage} />
        <Route path="/istanbul-yatirim-bolgeleri" component={GeoGuidePage} />
        <Route path="/istanbul-gayrimenkul-piyasasi" component={GeoGuidePage} />
        <Route path="/besiktas-emlak-rehberi" component={GeoGuidePage} />
        <Route path="/kadikoy-emlak-rehberi" component={GeoGuidePage} />
        <Route path="/sariyer-emlak-rehberi" component={GeoGuidePage} />
        <Route path="/istanbul-emlak-sss" component={GeoFaqPage} />
        <Route path="/:slug" component={CitySeoPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <ScrollToTop />
            <Toaster />
            <Router />
            <FloatingContact />
          </WouterRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
