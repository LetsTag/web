import styles from './Pricing.module.css';

type Feature = {
    name: string;
    description: string;
    free: string;
    pro: string;
    freeDetail?: string;
    proDetail?: string;
    comingSoon?: boolean;
};

const features: Feature[] = [
    { name: 'API Credits', description: 'Pay only for what you pull. Unused credits stay in your account while it remains active.', free: '3,000', freeDetail: 'One-time', pro: '300,000', proDetail: 'Per refill' },
    { name: 'Database Updates', description: 'Access the latest exercises and equipment as the catalog evolves.', free: 'Included', pro: 'Included' },
    { name: 'Male Exercises & Equipment', description: 'Human-reviewed illustrations show the equipment on its own and in use.', free: 'Names & Descriptions +', freeDetail: 'Watermarked images', pro: 'Names & Descriptions +', proDetail: 'Clean (High-Res) images' },
    { name: 'Global Localization', description: 'Access translated exercise names and descriptions in supported languages.', free: 'English only', pro: '24 languages' },
    { name: 'Exercise Metadata', description: 'Explore MET scores, muscle recovery estimates, and movement modalities.', free: 'Included', pro: 'Included' },
    { name: 'Muscle Activation Data', description: 'Muscle data is included directly in each exercise response.', free: 'Included', pro: 'Included' },
    { name: 'Direct Engineer Support', description: "Don't get stuck in a generic help desk loop. Get your technical integration questions answered directly by the engineers who built the API.", free: 'Standard docs', pro: 'Priority engineer access' },
];

type Props = { price: string; freeCredits?: number; proCredits?: number };
export function FeatureComparison({ price, freeCredits, proCredits }: Props) {
    return <section className={styles.featureComparison} aria-labelledby="feature-comparison-title">
        <div className={styles.featureComparisonIntro}>
            <p className={styles.comparisonEyebrow}>BUILT TO GROW WITH YOU</p>
            <h2 id="feature-comparison-title">The Pro feature comparison</h2>
            <p>Start with the essentials. Unlock more data, imagery, and support when you need them.</p>
        </div>
        <div className={styles.featureTableWrap}>
            <table className={styles.featureTable}>
                <caption className={styles.caption}>Compare Free and Pro features</caption>
                <thead><tr><th scope="col">Feature</th><th scope="col">Free</th><th scope="col">Pro</th></tr></thead>
                <tbody>{features.map(feature => <tr key={feature.name}>
                    <th scope="row"><div className={styles.featureTitle}>{feature.name}{feature.comingSoon && <span className={styles.comingSoon}>Coming soon</span>}</div><p>{feature.description}</p></th>
                    <td data-label="Free"><span>{feature.name === 'API Credits' && freeCredits != null ? freeCredits.toLocaleString() : feature.free}</span>{feature.freeDetail && <small>{feature.freeDetail}</small>}</td>
                    <td data-label="Pro"><span>{feature.name === 'API Credits' && proCredits != null ? proCredits.toLocaleString() : feature.pro}</span>{feature.proDetail && <small>{feature.name === 'API Credits' && price ? `Per ${price} refill` : feature.proDetail}</small>}</td>
                </tr>)}</tbody>
            </table>
        </div>
    </section>;
}
