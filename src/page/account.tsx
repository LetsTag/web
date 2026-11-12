import { useEffect, useState } from 'react';
import { SiteLayout } from '../components/templates/SiteLayout';
import { clearSession, getUser, sessionRequest, type User } from '../lib/auth';
import { openCheckout } from '../lib/checkout';
import { getCatalog, previewProPrice } from '../lib/pricing';
import { loadPaddle } from '../lib/paddle';
import styles from './account.module.css';
type ApiKey = { api_key: string; created_at: string };
function displayDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState('Loading account…');
    const [portalError, setPortalError] = useState('');
    const [openingPortal, setOpeningPortal] = useState(false);
    const [apiKey, setApiKey] = useState<ApiKey | null>(null);
    const [keyError, setKeyError] = useState('');
    const [keyLoading, setKeyLoading] = useState(true);
    const [keyNotice, setKeyNotice] = useState('');
    const [balance, setBalance] = useState<number | null>(null);
    const [rotatingKey, setRotatingKey] = useState(false);
    const [topUpPrice, setTopUpPrice] = useState('');
    const [packCredits, setPackCredits] = useState(0);
    const [openingTopUp, setOpeningTopUp] = useState(false);
    const [topUpError, setTopUpError] = useState('');
    const [monthlyStatus, setMonthlyStatus] = useState('loading');
    const [selectMonthly, setSelectMonthly] = useState(false);
    const [monthlyPrice, setMonthlyPrice] = useState('');
    const [monthlyError, setMonthlyError] = useState('');
    const [monthlyBusy, setMonthlyBusy] = useState(false);
    useEffect(() => { getUser().then(value => { setUser(value); setMessage(value ? '' : 'Please sign in to view your account.'); }).catch(() => setMessage('Unable to load your account. Please try again.')); }, []);
    useEffect(() => {
        if (!user) return;
        let active = true;
        getCatalog().then(catalog => { if (active) setPackCredits(catalog.pro_credits); return previewProPrice(catalog.prices.pro); }).then(price => { if (active) setTopUpPrice(price); }).catch(() => { if (active) setTopUpError('Top-up pricing is unavailable.'); });
        setApiKey(null); setKeyError(''); setKeyLoading(true);
        sessionRequest('/v1/account/credits').then(async response => { if (!response.ok) throw new Error(); const result: { balance: number } = await response.json(); if (active) setBalance(result.balance); }).catch(() => { if (active) setBalance(null); });
        sessionRequest('/v1/account/api-key').then(async response => {
            if (response.status === 401) {
                clearSession(); window.dispatchEvent(new Event('session-expired'));
                if (active) { setUser(null); setMessage('Your session has expired. Please sign in again.'); }
                return;
            }
            if (response.status === 404) { if (active) setKeyError('No displayable key found. Regenerate your key to create a new one.'); return; }
            if (!response.ok) throw new Error();
            const result: ApiKey = await response.json();
            if (!result.api_key || !result.created_at) throw new Error();
            if (active) setApiKey(result);
        }).catch(() => { if (active) setKeyError('Unable to load API key. Please try again later.'); })
          .finally(() => { if (active) setKeyLoading(false); });
        return () => { active = false; };
    }, [user]);
    useEffect(() => {
        if (!user) return;
        let active = true;
        let priceLoaded = false;
        let selectionInitialized = false;
        async function refresh() {
            try {
                const response = await sessionRequest('/v1/account/monthly-refill');
                if (!response.ok) throw new Error();
                const result: { status: string; price_id: string } = await response.json();
                if (active) {
                    setMonthlyStatus(result.status);
                    if (!selectionInitialized) { setSelectMonthly(['active', 'inactive', 'pending'].includes(result.status)); selectionInitialized = true; }
                }
                if (result.price_id && !priceLoaded) {
                    priceLoaded = true;
                    previewProPrice(result.price_id).then(price => { if (active) setMonthlyPrice(price); }).catch(() => { priceLoaded = false; if (active) setMonthlyError('Monthly pricing is unavailable.'); });
                }
                sessionRequest('/v1/account/credits').then(async response => {
                    if (!response.ok) return;
                    const result: { balance: number } = await response.json();
                    if (active) setBalance(result.balance);
                }).catch(() => {});
            } catch { if (active) setMonthlyStatus('unavailable'); }
        }
        refresh(); const timer = window.setInterval(refresh, 5000);
        return () => { active = false; window.clearInterval(timer); };
    }, [user]);
    async function toggleMonthly() {
        if (!selectMonthly) { setSelectMonthly(true); setMonthlyError(''); return; }
        if (monthlyStatus !== 'active' && monthlyStatus !== 'inactive') { setSelectMonthly(false); setMonthlyError(''); return; }
        if (!window.confirm('Cancel monthly refill immediately? You keep credits already purchased.')) return;
        setMonthlyBusy(true); setMonthlyError('');
        try {
            const response = await sessionRequest('/v1/account/monthly-refill/cancel', 'POST');
            if (!response.ok) { const error: { detail?: string } = await response.json(); throw new Error(error.detail || 'Could not cancel monthly refill.'); }
            const result: { status: string } = await response.json();
            setMonthlyStatus(result.status); setSelectMonthly(false);
        } catch (error) { setMonthlyError(error instanceof Error ? error.message : 'Could not cancel monthly refill.'); }
        finally { setMonthlyBusy(false); }
    }
    async function copyKey() {
        if (!apiKey) return;
        try { await navigator.clipboard.writeText(apiKey.api_key); setKeyNotice('API key copied.'); }
        catch { setKeyNotice('Could not copy the key. Please select and copy it.'); }
    }
    async function rotateKey() {
        if (apiKey && !window.confirm('Regenerate your API key? The current key will stop working immediately.')) return;
        setRotatingKey(true); setKeyError(''); setKeyNotice('');
        try {
            const response = await sessionRequest('/v1/account/api-key/rotate', 'POST');
            if (!response.ok) throw new Error();
            const result: ApiKey = await response.json();
            if (!result.api_key || !result.created_at) throw new Error();
            setApiKey(result); setKeyNotice('API key regenerated. Update your applications with the new key.');
        } catch { setKeyError('Unable to regenerate the API key. Please try again.'); }
        finally { setRotatingKey(false); }
    }
    async function topUp() {
        setOpeningTopUp(true); setTopUpError('');
        try {
            if (!selectMonthly) {
                const result = await openCheckout(user?.email);
                if (result !== 'opened') setTopUpError('Please sign in again to buy credits.');
            } else {
                const response = await sessionRequest('/v1/account/monthly-refill', 'POST');
                if (!response.ok) { const error: { detail?: string } = await response.json(); throw new Error(error.detail || 'Could not start monthly checkout.'); }
                const result: { status: string; transaction_id: string } = await response.json();
                setMonthlyStatus(result.status);
                const paddle = await loadPaddle(() => {});
                if (!paddle || !result.transaction_id) throw new Error('Unable to open checkout.');
                paddle.Checkout.open({ transactionId: result.transaction_id, ...(user?.email ? { customer: { email: user.email } } : {}) });
            }
        } catch (error) { setTopUpError(error instanceof Error ? error.message : 'Unable to open checkout. Please try again.'); }
        finally { setOpeningTopUp(false); }
    }
    async function openPortal() {
        setOpeningPortal(true); setPortalError('');
        try {
            const response = await sessionRequest('/v1/customer-portal', 'POST');
            if (response.status === 401) { clearSession(); window.dispatchEvent(new Event('session-expired')); setUser(null); setMessage('Your session has expired. Please sign in again.'); return; }
            if (response.status === 404) { setPortalError('Your billing account will be available after your first completed purchase.'); return; }
            if (response.status === 409) { setPortalError('Multiple billing accounts were found. Please contact support for help.'); return; }
            if (!response.ok) throw new Error();
            const result: { url: string } = await response.json();
            const url = new URL(result.url);
            if (url.protocol !== 'https:' || !url.hostname.endsWith('.paddle.com') || url.username || url.password || (url.port && url.port !== '443')) throw new Error();
            window.location.assign(url.href);
        } catch { setPortalError('Unable to open the billing portal. Please try again.'); }
        finally { setOpeningPortal(false); }
    }
    return <SiteLayout><section className={styles.profile}><h1>Account</h1>{message && <p role="status">{message}</p>}{user && <><div className={styles.card}>{user.picture && <img src={user.picture} alt="" referrerPolicy="no-referrer" />}<div><h2>{user.name || 'Your account'}</h2>{user.email && <p>{user.email}</p>}<p>Signed in with Google</p></div></div><section className={styles.billing}><h2>Credits</h2><p>{balance === null ? 'Credit balance unavailable' : `${balance.toLocaleString()} credits available`}</p><button className={styles.portalButton} disabled={openingTopUp || monthlyBusy || (selectMonthly ? !monthlyPrice || ['loading', 'unavailable', 'creating', 'active', 'inactive'].includes(monthlyStatus) : !topUpPrice)} onClick={topUp}>{openingTopUp ? 'Opening checkout…' : 'Refill'}</button>{(selectMonthly ? monthlyPrice : topUpPrice) && <p>{selectMonthly ? 'Monthly refill' : 'One-time refill'}: {packCredits.toLocaleString()} credits · {selectMonthly ? monthlyPrice : topUpPrice}{selectMonthly ? ' per month' : ''} before tax.</p>}{topUpError && <p role="alert">{topUpError}</p>}<div className={styles.refill}><h3>Monthly refill</h3><p>Get 25,000 credits each month{monthlyPrice ? ` for ${monthlyPrice} per month before tax` : ''}. Credits remain in your account until used. Cancel anytime.</p><label className={styles.monthlyToggle}><input className={styles.switch} type="checkbox" role="switch" checked={selectMonthly} disabled={monthlyBusy || monthlyStatus === 'loading' || monthlyStatus === 'creating' || monthlyStatus === 'unavailable'} onChange={toggleMonthly} /> Enable monthly refill</label><p role="status">{monthlyStatus === 'active' ? 'Monthly refill is active.' : monthlyStatus === 'pending' ? 'Complete checkout to enable monthly refill.' : monthlyStatus === 'inactive' ? 'Your subscription is inactive. Manage billing or cancel it.' : monthlyStatus === 'creating' ? 'Checkout could not be confirmed. Contact support.' : monthlyStatus === 'unavailable' ? 'Monthly refill status is unavailable.' : selectMonthly ? 'Monthly refill selected. Select Refill to start checkout.' : 'One-time refill selected.'}</p>{monthlyError && <p role="alert">{monthlyError}</p>}</div></section><section className={styles.billing}><h2>Billing and purchases</h2><p>Manage your payments and invoices with Paddle.</p><button className={styles.portalButton} type="button" disabled={openingPortal} onClick={openPortal}>{openingPortal ? 'Opening billing portal…' : 'Manage billing'} <span aria-hidden="true">↗</span></button>{portalError && <p role="alert">{portalError}</p>}</section><section className={styles.billing} aria-labelledby="api-key-title"><h2 id="api-key-title">API key</h2><p>Your key is used to access the API. All your credits are available through this key.</p>{keyLoading ? <p role="status">Loading API key…</p> : <><div className={styles.keyBox}><code>{apiKey?.api_key || 'No key available'}</code><button className={styles.copyButton} type="button" onClick={copyKey} disabled={!apiKey} aria-label="Copy API key" title="Copy API key"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg></button></div>{apiKey && <div className={styles.keyDate}>Created {displayDate(apiKey.created_at)}</div>}<button className={styles.rotateButton} type="button" disabled={rotatingKey} onClick={rotateKey}><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7v5h-5"/><path d="M4 17v-5h5"/><path d="M5.5 9a7 7 0 0 1 11.6-2.6L20 12M4 12l2.9 5.6A7 7 0 0 0 18.5 15"/></svg>{rotatingKey ? 'Regenerating…' : 'Regenerate Key'}</button>{keyError && <p role="alert">{keyError}</p>}{keyNotice && <p role="status">{keyNotice}</p>}</>}</section></>}</section></SiteLayout>;
}
