import { useEffect, useState } from 'react';
import { getCatalog, previewProPrice, type CreditCatalog } from '../../lib/pricing';
import { getUser, type User } from '../../lib/auth';
import { Text } from '../atoms/Text';
import { FeatureComparison } from './FeatureComparison';
import styles from './Pricing.module.css';
import card from '../molecules/PlanCard.module.css';
export function Pricing() {
    const [catalog, setCatalog] = useState<CreditCatalog | null>(null);
    const [price, setPrice] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const [checking, setChecking] = useState(true);
    const [message, setMessage] = useState('');
    useEffect(() => {
        let active = true;
        getCatalog().then(async next => { if (active) setCatalog(next); try { const value = await previewProPrice(next.prices.pro); if (active) setPrice(value); } catch { if (active) setMessage('Pro pricing is temporarily unavailable.'); } }).catch(() => { if (active) setMessage('Pricing is temporarily unavailable.'); });
        return () => { active = false; };
    }, []);
    useEffect(() => {
        let active = true; let generation = 0;
        const refresh = () => { const current = ++generation; getUser().then(value => { if (active && current === generation) setUser(value); }).catch(() => { if (active && current === generation) setUser(null); }).finally(() => { if (active && current === generation) setChecking(false); }); };
        refresh(); for (const event of ['signed-in', 'signed-out', 'session-expired', 'storage']) window.addEventListener(event, refresh);
        return () => { active = false; for (const event of ['signed-in', 'signed-out', 'session-expired', 'storage']) window.removeEventListener(event, refresh); };
    }, []);
    useEffect(() => {
        const continueToAccount = () => {
            if (sessionStorage.getItem('pricing_sign_in') === '1') {
                sessionStorage.removeItem('pricing_sign_in');
                window.location.assign('/account/');
            }
        };
        sessionStorage.removeItem('start_pro_checkout');
        window.addEventListener('signed-in', continueToAccount);
        return () => window.removeEventListener('signed-in', continueToAccount);
    }, []);
    function choose() {
        setMessage('');
        if (!user) {
            sessionStorage.setItem('pricing_sign_in', '1');
            setMessage('Sign in with Google above to continue.');
            document.getElementById('sign-in-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            window.dispatchEvent(new Event('pricing-sign-in'));
            return;
        }
        window.location.assign('/account/');
    }
    return <><section className={styles.intro}><Text variant="eyebrow" align="center">Exercise data, on your terms</Text><Text as="h2" variant="hero" align="center">Build at your pace.<br />Pay for what you use.</Text><div className={styles.description}><Text align="center">One credit for each API object returned. Pull ten objects, use ten credits. Unused credits stay in your account, so you can grow without watching a monthly clock.</Text></div></section>
        {message && <p role="status">{message}</p>}
        <section className={styles.cards} aria-label="Credit plans">{(['free', 'pro'] as const).map(plan => <article key={plan} className={`${card.card} ${plan === 'pro' ? card.featured : ''}`}><div className={card.title}><Text as="h2" variant="subheading">{plan === 'free' ? 'Free' : 'Pro'}</Text></div><div className={card.audience}><Text variant="muted">{plan === 'free' ? 'Explore the API at your own pace.' : 'Build more with a larger credit pack.'}</Text></div><div className={card.cost}><strong className={styles.creditPrice}>{plan === 'free' ? 'Free' : price || 'Price unavailable'}</strong><Text variant="muted">{plan === 'free' ? 'One-time allocation' : 'One-time purchase · before tax'}</Text></div><div className={card.allowance}><span className={card.calls}>{catalog ? (plan === 'free' ? catalog.free_credits : catalog.pro_credits).toLocaleString() : '—'} credits</span></div><Text variant="muted">{plan === 'free' ? 'Try real data with no payment required.' : 'Credits stay available until you use them.'}</Text><button className={card.purchase} disabled={checking} onClick={choose}>{plan === 'free' ? 'Start for free' : 'Buy credits'}</button></article>)}</section>
        <section className={styles.explain}><h2>Simple, fair, and ready to scale.</h2><div className={styles.explainGrid}><div><strong>1 object = 1 credit</strong><p>Every returned API object counts. Ask for ten exercises and spend ten credits.</p></div><div><strong>Keep what you don’t use</strong><p>Credits stay in your account while it remains active. Accounts inactive for 12 months may be closed and their credits forfeited.</p></div><div><strong>Grow on your schedule</strong><p>Start free, then add 300,000 credits whenever you need more room to build.</p></div></div></section><FeatureComparison price={price} freeCredits={catalog?.free_credits} proCredits={catalog?.pro_credits} /></>;
}
