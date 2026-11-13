import AccountPage from './page/account';
import MainPage from './page/main';
import CheckoutPage from './page/checkout';
import { SiteLayout } from './shared/templates/SiteLayout';
import { Text } from './shared/atoms/Text';
import { Link } from './shared/atoms/Link';

export function App() {
    const path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '/index.html') return <MainPage />;
    if (path === '/account' || path === '/account/index.html') return <AccountPage />;
    if (path === '/checkout' || path === '/checkout/index.html') return <CheckoutPage />;
    return <SiteLayout compact>
        <Text as="h1" variant="heading">Page not found</Text>
        <Text>This page is no longer available.</Text>
        <Link href="/">Back to pricing</Link>
    </SiteLayout>;
}
