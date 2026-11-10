import { useEffect, useState } from 'react';
import { Text } from '../components/atoms/Text';
import { Link } from '../components/atoms/Link';
import { SiteLayout } from '../components/templates/SiteLayout';
import { loadPaddle } from '../lib/paddle';

type Status = 'loading' | 'ready' | 'open' | 'closed' | 'completed' | 'error';
const messages: Record<Status, string> = {
    loading: 'Loading secure checkout…',
    ready: 'If you arrived from a Paddle payment email, your secure checkout will open automatically.',
    open: 'Follow the steps in the secure checkout to update your payment details.',
    closed: 'Checkout closed. To open it again, reload this page or use the link in your Paddle email.',
    completed: 'Your checkout is complete. You can safely close this page.',
    error: 'We couldn’t load secure checkout. Please reload this page or try the payment link in your Paddle email again.',
};
export default function CheckoutPage() {
    const [status, setStatus] = useState<Status>('loading');
    useEffect(() => {
        let active = true;
        const timeout = window.setTimeout(() => { if (active) setStatus('error'); }, 20000);
        loadPaddle(event => {
            if (!active) return;
            if (event.name === 'checkout.loaded') setStatus('open');
            if (event.name === 'checkout.closed') setStatus('closed');
            if (event.name === 'checkout.completed') setStatus('completed');
            if (event.name === 'checkout.error') setStatus('error');
        }).then(paddle => {
            if (active) setStatus(current => paddle ? current === 'loading' ? 'ready' : current : 'error');
            window.clearTimeout(timeout);
        }).catch(() => {
            if (active) setStatus('error');
            window.clearTimeout(timeout);
        });
        return () => { active = false; window.clearTimeout(timeout); };
    }, []);
    return <SiteLayout compact>
        <Text as="h1" variant="heading">Payment details</Text>
        <div role="status" aria-live="polite"><Text variant="muted">{messages[status]}</Text></div>
        <Link href="/">Back to pricing</Link>
    </SiteLayout>;
}
