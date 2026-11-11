import { useEffect, useState } from 'react';
import { SiteLayout } from '../components/templates/SiteLayout';
import { getUser, type User } from '../lib/auth';
import styles from './account.module.css';
export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [message, setMessage] = useState('Loading account…');
    useEffect(() => { getUser().then(value => { setUser(value); setMessage(value ? '' : 'Please sign in to view your account.'); }).catch(() => setMessage('Unable to load your account. Please try again.')); }, []);
    return <SiteLayout><section className={styles.profile}><h1>Account</h1>{message && <p role="status">{message}</p>}{user && <div className={styles.card}>{user.picture && <img src={user.picture} alt="" referrerPolicy="no-referrer" />}<div><h2>{user.name || 'Your account'}</h2>{user.email && <p>{user.email}</p>}<p>Signed in with Google</p></div></div>}</section></SiteLayout>;
}
