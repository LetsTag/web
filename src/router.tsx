import PrivacyPage from './page/privacy';
import TermsPage from './page/terms';
import AccountPage from './page/account';
import AdminPage from './page/admin';
import MainPage from './page/main';
import CheckoutPage from './page/checkout';
import PricingPage from './page/pricing';
import UpdatesPage from './page/updates';
import { SiteLayout } from './shared/templates/SiteLayout';
import { Text } from './shared/atoms/Text';
import { Link } from './shared/atoms/Link';

export function App() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '/index.html') return <MainPage />;
    if (path === '/pricing' || path === '/pricing/index.html') return <PricingPage />;
    if (path === '/updates' || path === '/updates/index.html') return <UpdatesPage />;
    if (path === '/privacy' || path === '/privacy/index.html') return <PrivacyPage />;
    if (path === '/terms' || path === '/terms/index.html') return <TermsPage />;
    if (path === '/admin' || path === '/admin/index.html') return <AdminPage />;
    if (path === '/account' || path === '/account/index.html') return <AccountPage />;
    if (path === '/checkout' || path === '/checkout/index.html') return <CheckoutPage />;
    return <SiteLayout compact>
        <Text as="h1" variant="heading">Page not found</Text>
        <Text>This page is no longer available.</Text>
        <Link href="/pricing/">Back to pricing</Link>
    </SiteLayout>;
}
