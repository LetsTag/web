import { useEffect, useState } from 'react';
import { sessionRequest } from '../../lib/auth';
import styles from './CreditHistory.module.css';

type Entry = { id: string; kind: string; amount: number; occurred_at: string; description: string; endpoint: string | null; reason: string | null };
type History = { entries: Entry[]; has_more: boolean };
export function CreditHistory({ endpoint = '/v1/account/credits/history' }: { endpoint?: string }) {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [offset, setOffset] = useState(0);
    const [more, setMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        let active = true; setLoading(true); setError('');
        sessionRequest(`${endpoint}?limit=20&offset=${offset}`).then(async response => {
            if (!response.ok) throw new Error();
            const result: History = await response.json();
            if (active) { setEntries(result.entries); setMore(result.has_more); }
        }).catch(() => { if (active) setError('Unable to load credit history.'); }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [endpoint, offset]);
    return <section className={styles.history} aria-label="Credit usage history"><h2>Credit history</h2><p>Credit purchases, API usage, and adjustments.</p>{loading ? <p role="status">Loading history…</p> : error ? <p role="alert">{error}</p> : entries.length === 0 ? <p>No credit activity yet.</p> : <ul>{entries.map(entry => <li key={entry.id}><div><strong>{entry.description}</strong><span>{new Date(entry.occurred_at).toLocaleString()}{entry.endpoint && ` · ${entry.endpoint}`}</span>{entry.reason && <span>{entry.reason}</span>}</div><b className={entry.amount < 0 ? styles.debit : styles.credit}>{entry.amount > 0 ? '+' : ''}{entry.amount.toLocaleString()}</b></li>)}</ul>}<div className={styles.pages}><button type="button" disabled={loading || offset === 0} onClick={() => setOffset(Math.max(0, offset - 20))}>Previous</button><button type="button" disabled={loading || !more} onClick={() => setOffset(offset + 20)}>Next</button></div></section>;
}
