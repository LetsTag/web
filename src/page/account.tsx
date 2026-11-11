import { useEffect, useState } from 'react';
import { SiteLayout } from '../components/templates/SiteLayout';
import { clearSession, getUser, sessionRequest, type User } from '../lib/auth';
import styles from './account.module.css';
type ApiKey = { prefix: string; created_at: string; last_used_at: string | null };
function displayDate(value: string) { const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Unknown' : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); }
export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState('Loading account…');
    const [portalError, setPortalError] = useState('');
    const [openingPortal, setOpeningPortal] = useState(false);
    const [keys, setKeys] = useState<ApiKey[] | null>(null);
    const [keysError, setKeysError] = useState('');
    useEffect(() => { getUser().then(value => { setUser(value); setMessage(value ? '' : 'Please sign in to view your account.'); }).catch(() => setMessage('Unable to load your account. Please try again.')); }, []);
    useEffect(() => {
        if (!user) return;
        let active = true;
        setKeys(null); setKeysError('');
        sessionRequest('/v1/account/api-keys').then(async response => {
            if (response.status === 401) {
                clearSession(); window.dispatchEvent(new Event('session-expired'));
                if (active) { setUser(null); setMessage('Your session has expired. Please sign in again.'); }
                return;
            }
            if (!response.ok) throw new Error();
            const result: { keys: ApiKey[] } = await response.json();
            if (!Array.isArray(result.keys)) throw new Error();
            if (active) setKeys(result.keys);
        }).catch(() => { if (active) setKeysError('Unable to load API keys. Please try again later.'); });
        return () => { active = false; };
    }, [user]);
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
    return <SiteLayout><section className={styles.profile}><h1>Account</h1>{message && <p role="status">{message}</p>}{user && <><div className={styles.card}>{user.picture && <img src={user.picture} alt="" referrerPolicy="no-referrer" />}<div><h2>{user.name || 'Your account'}</h2>{user.email && <p>{user.email}</p>}<p>Signed in with Google</p></div></div><section className={styles.billing}><h2>Billing and subscriptions</h2><p>Manage your subscription, payment methods, and invoices with Paddle.</p><button className={styles.portalButton} type="button" disabled={openingPortal} onClick={openPortal}>{openingPortal ? 'Opening billing portal…' : 'Manage billing'} <span aria-hidden="true">↗</span></button>{portalError && <p role="alert">{portalError}</p>}</section><section className={styles.billing} aria-labelledby="api-keys-title"><h2 id="api-keys-title">API keys</h2><p>Active keys linked to your purchases. Full keys cannot be displayed again.</p>{keysError ? <p role="alert">{keysError}</p> : keys === null ? <p role="status">Loading API keys…</p> : keys.length === 0 ? <p>No active API keys found.</p> : <ul className={styles.keyList}>{keys.map(key => <li key={key.prefix}><code>{key.prefix}…</code><span>Created {displayDate(key.created_at)}{key.last_used_at ? ` · Last used ${displayDate(key.last_used_at)}` : ''}</span></li>)}</ul>}</section></>}</section></SiteLayout>;
}
