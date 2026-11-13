import { useEffect, useRef, useState } from 'react';
import { Brand } from '../atoms/Brand';
import { clearSession, getUser, sessionRequest, type User } from '../../lib/auth';
import styles from './SiteHeader.module.css';

declare const __GOOGLE_CLIENT_ID__: string;
declare const __AUTH_API_BASE_URL__: string;
declare global {
    interface Window { google?: { accounts: { id: {
        initialize: (options: { client_id: string; callback: (response: { credential: string }) => void }) => void;
        renderButton: (element: HTMLElement, options: { theme: string; size: string; shape: string; text: string; width: number }) => void;
        disableAutoSelect: () => void;
    } } }; }
}
export function SiteHeader({ signIn = true }: { signIn?: boolean }) {
    const button = useRef<HTMLDivElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(false);
    const [status, setStatus] = useState('');
    useEffect(() => {
        if (!signIn) return;
        let active = true;
        getUser().then(value => { if (active) setUser(value); }).catch(() => { if (active) setStatus('Unable to load account.'); }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [signIn]);
    useEffect(() => {
        const expired = () => { setUser(null); setStatus('Please sign in to continue to checkout.'); };
        window.addEventListener('session-expired', expired);
        return () => window.removeEventListener('session-expired', expired);
    }, []);
    useEffect(() => {
        if (!signIn || loading || user) return;
        let active = true;
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client'; script.async = true; script.defer = true;
        script.onload = () => {
            if (!active || !button.current || !window.google) return;
            window.google.accounts.id.initialize({ client_id: __GOOGLE_CLIENT_ID__, callback: async ({ credential }) => {
                setStatus('Signing in…');
                try {
                    const response = await fetch(`${__AUTH_API_BASE_URL__}/auth/google`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ credential }) });
                    if (!response.ok) throw new Error();
                    const result: { session_token: string; expires_at: string; user: User } = await response.json();
                    localStorage.setItem('session_token', result.session_token); localStorage.setItem('session_expires_at', result.expires_at);
                    if (active) { setUser(result.user); setStatus(''); window.dispatchEvent(new Event('signed-in')); }
                } catch { if (active) setStatus('Sign-in failed. Please try again.'); }
            } });
            window.google.accounts.id.renderButton(button.current, { theme: 'outline', size: 'medium', shape: 'pill', text: 'signin_with', width: 160 });
        };
        script.onerror = () => { if (active) setStatus('Google sign-in could not load.'); };
        document.head.appendChild(script);
        return () => { active = false; script.remove(); };
    }, [signIn, loading, user]);
    async function signOut() {
        setStatus('Signing out…');
        try {
            const response = await sessionRequest('/auth/signout', 'POST');
            if (!response.ok && response.status !== 401) throw new Error();
            clearSession(); window.dispatchEvent(new Event('signed-out')); window.google?.accounts.id.disableAutoSelect(); setUser(null); setMenu(false); setStatus('');
            if (location.pathname.startsWith('/account')) location.assign('/');
        } catch { setStatus('Sign-out failed. Please try again.'); }
    }
    return <header className={styles.header}><Brand />{signIn && <div id="sign-in-area" className={styles.signIn}>
        {user ? <div key="account" className={styles.account}><button className={styles.accountButton} onClick={() => setMenu(!menu)} aria-expanded={menu} aria-haspopup="menu"><span>{user.name || user.email || 'Account'}</span><span aria-hidden="true">⌄</span></button>{menu && <div className={styles.menu} role="menu"><a role="menuitem" href="/account/">Account</a><button role="menuitem" onClick={signOut}>Sign out</button></div>}</div> : !loading && <div key="google-sign-in" className={styles.googleButton} ref={button} />}
        <span role="status">{status}</span>
    </div>}</header>;
}
