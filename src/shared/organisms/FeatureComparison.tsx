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
    { name: 'API Credits', description: 'Pay only for what you pull. Unused credits stay in your account forever, so you can scale at your own pace.', free: '250', freeDetail: 'One-time', pro: '25,000', proDetail: 'Per refill' },
    { name: 'Live Database Updates', description: 'Our library evolves weekly with new variations and data. Connect once and your app stays fresh automatically.', free: 'Static snapshot', pro: 'Live & continuous' },
    { name: 'Male Exercises & Equipment', description: 'Meticulously engineered and human-perfected over a year to guarantee flawless form and studio-quality realism.', free: 'Names & Descriptions +', freeDetail: 'Watermarked images', pro: 'Names & Descriptions +', proDetail: 'Clean (High-Res) images' },
    { name: 'Female Exercises', comingSoon: true, description: 'Expand your demographic reach. Includes complete names, detailed execution descriptions, and high-res female visuals.', free: '—', pro: 'Names & Descriptions +', proDetail: 'Clean (High-Res) images' },
    { name: 'Body Shapes (Data)', description: 'Hyper-personalize your UI. Connect visual models (Apple, Pear, Hourglass, Rectangle, Triangle) to insights on fat distribution and metabolic profiles.', free: 'Descriptions +', freeDetail: 'Watermarked images', pro: 'Descriptions +', proDetail: 'Clean (High-Res) images' },
    { name: 'Body Shape Engine', comingSoon: true, description: 'Pass raw user measurements to our endpoint to instantly compute their exact shape, returning the matched data object and visual model.', free: 'Computed +', freeDetail: 'Watermarked images', pro: 'Computed +', proDetail: 'Clean (High-Res) images' },
    { name: 'Somatotypes (Data)', description: "Match your user's specific build (Ectomorph, Mesomorph, Endomorph) to high-res male and female visual models.", free: 'Descriptions +', freeDetail: 'Watermarked images', pro: 'Descriptions +', proDetail: 'Clean (High-Res) images' },
    { name: 'Somatotype Engine', comingSoon: true, description: 'Automatically classify users based on onboarding inputs, instantly returning the correct somatotype profile and visual asset.', free: 'Computed +', freeDetail: 'Watermarked images', pro: 'Computed +', proDetail: 'Clean (High-Res) images' },
    { name: 'Body Fat % Engine', comingSoon: true, description: 'Compute body fat seamlessly by passing raw metrics through your choice of multiple scientifically proven formulas in a single API call.', free: 'Computed', freeDetail: 'Standard formula', pro: 'Computed', proDetail: 'All scientific formulas' },
    { name: 'Lean Muscle Mass Engine', comingSoon: true, description: 'Calculate lean mass instantly using a variety of validated scientific equations, delivering clinical-grade precision directly to your UI.', free: 'Computed', freeDetail: 'Standard formula', pro: 'Computed', proDetail: 'All scientific formulas' },
    { name: 'Total Muscle Mass Engine', comingSoon: true, description: 'Accurately estimate total muscle mass based on industry-standard scientific formulas to help users track actual hypertrophy.', free: 'Computed', freeDetail: 'Standard formula', pro: 'Computed', proDetail: 'All scientific formulas' },
    { name: 'Cinematic Videos', comingSoon: true, description: 'Expert-perfected motion guidance. Countless hours spent by human specialists refining biomechanics to ensure exact, flawless movement.', free: '—', pro: 'Included' },
    { name: 'Global Localization', description: 'Launch worldwide on day one with expertly translated exercise names and detailed instructions.', free: 'English only', pro: '30 Languages' },
    { name: 'Advanced Metadata', description: 'Power your custom algorithms with deep clinical data, including MET scores, recovery times, and modalities.', free: 'Basic', pro: 'Full dataset' },
    { name: 'Muscle Activation Data', description: 'Included directly in the exercise response object. Our detailed muscle arrays are continuously enriched with new anatomical data to keep your app industry-leading.', free: 'Primary only', pro: 'Full activation arrays' },
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
