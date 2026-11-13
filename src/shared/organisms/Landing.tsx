import { useState, type MouseEvent } from 'react';
import { token } from '../../lib/auth';
import styles from './Landing.module.css';

declare const __AUTH_API_BASE_URL__: string;
const image = '/img/marketing/front-squat.webp';
const exerciseExample = `{
  "name": "Dumbbell Front Squat",
  "equipment": "Dumbbells",
  "muscle_activation_arrays": {
    "primary": ["quadriceps", "glutes"],
    "secondary": ["core", "hamstrings"]
  },
  "met_score": 5.0
}`;
const engineExample = `// Example request
{ "waist": 32, "hips": 40 }

// Example response
{
  "body_shape": "Pear",
  "image_url": "..."
}`;

function StartLink({ className }: { className: string }) {
    const [notice, setNotice] = useState('');
    function start(event: MouseEvent<HTMLAnchorElement>) {
        event.preventDefault();
        if (token()) { window.location.assign('/account/'); return; }
        setNotice('Sign in with Google above to get your 250 free credits.');
        const root = event.currentTarget.getRootNode();
        if (root instanceof ShadowRoot || root instanceof Document) root.querySelector('#sign-in-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return <div><a className={className} href="/account/" onClick={start}>Start for free <span aria-hidden="true">↗</span></a>{notice && <p className={styles.signInNotice} role="status">{notice}</p>}</div>;
}

export function LandingIntro() {
    const [language, setLanguage] = useState<'EN' | 'ES' | 'DE'>('EN');
    const names = { EN: 'Dumbbell front squat', ES: 'Sentadilla frontal con mancuernas', DE: 'Kurzhantel-Frontkniebeuge' };
    return <>
        <section className={styles.hero}>
            <div className={styles.heroCopy}>
                <p className={styles.eyebrow}><span /> FITNESS DATA, BUILT FOR DEVELOPERS</p>
                <h1>Build fitness apps faster with <em>human-perfected</em> AI data.</h1>
                <p className={styles.lead}>The most visually stunning, biomechanically accurate exercise and body-typing API. Pay only for what you pull.</p>
                <div className={styles.actions}><StartLink className={styles.primary} /><a className={styles.secondary} href={`${__AUTH_API_BASE_URL__}/docs`}>Read the Docs <span aria-hidden="true">↗</span></a></div>
                <p className={styles.creditNote}><span>✓</span> 250 evaluation credits to get started</p>
            </div>
            <div className={styles.heroVisual}>
                <div className={styles.codeWindow}><div className={styles.codeTop}><span className={styles.codeDots}><i /><i /><i /></span><span>exercise.json</span><span className={styles.codeBadge}>EXAMPLE</span></div><div className={styles.codeRequest}><span>GET</span> /v1/exercises/DUMBBELL_FRONT_SQUAT</div><pre>{exerciseExample}</pre><div className={styles.codeFoot}>Illustrative response</div></div>
                <div className={styles.heroImage}><div className={styles.imageGlow} /><img src={image} alt="An anatomical illustration of a dumbbell front squat" /><span className={styles.imageTag}>DUMBBELL FRONT SQUAT <b>↗</b></span></div>
            </div>
        </section>
        <div className={styles.momentum}><span className={styles.pulse} /><strong>Latest Update <span>(Nov 12)</span></strong><span className={styles.momentumDivider} /><p>Added Body Shape Engine endpoints and primary somatotype arrays to 150 exercises.</p></div>
        <section className={styles.showcase} aria-labelledby="showcase-title">
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>MORE THAN A DATABASE</p><h2 id="showcase-title">The details make<br /><em>the difference.</em></h2></div><p>Visuals that move people. Data that gives you room to build something better.</p></div>
            <div className={styles.featureGrid}>
                <article className={styles.featureCard}><div className={styles.visualCompare}><div className={styles.figureSide}><span>STANDARD</span><svg viewBox="0 0 100 130" aria-label="Simple stick figure" role="img"><circle cx="48" cy="20" r="10"/><path d="M48 32v43M23 48l25-10 27 9M48 75l-20 32M48 75l22 32"/></svg></div><div className={styles.richSide}><span>LET’S TAG</span><img src={image} alt="Detailed anatomical exercise illustration" loading="lazy" /></div></div><div className={styles.cardCopy}><span className={styles.cardNumber}>01 / VISUALS</span><h3>Flawless Visuals</h3><p>Studio-quality, transparent-background imagery, refined by humans and ready for your app.</p></div></article>
                <article className={styles.featureCard}><div className={styles.metadataVisual}><div><span>MET SCORE</span><strong>5.0 <small>MET</small></strong><i>↗</i></div><div><span>RECOVERY</span><strong>48 <small>HRS</small></strong><i>◷</i></div><p>MODALITY <b>STRENGTH</b></p></div><div className={styles.cardCopy}><span className={styles.cardNumber}>02 / DATA</span><h3>Clinical Metadata</h3><p>Give every movement context with MET scores, recovery times, and modality tags.</p></div></article>
                <article className={styles.featureCard}><div className={styles.languageVisual}><div className={styles.languageTabs}>{(['EN', 'ES', 'DE'] as const).map(value => <button key={value} type="button" aria-pressed={language === value} onClick={() => setLanguage(value)}>{value}</button>)}</div><span>EXERCISE NAME</span><strong>{names[language]}</strong><div className={styles.translationMark}>Aa <span>↗</span></div></div><div className={styles.cardCopy}><span className={styles.cardNumber}>03 / LOCALIZATION</span><h3>Global Reach</h3><p>Bring your product to more people with exercise names and instructions in multiple languages.</p></div></article>
            </div>
        </section>
        <section className={styles.engines} aria-labelledby="engine-title"><div className={styles.engineHeading}><div><p className={styles.eyebrow}>A SMARTER KIND OF API</p><h2 id="engine-title">Don’t just fetch data.<br /><em>Compute it.</em></h2><p>Turn raw measurements into insights with calculation engines built for your next idea.</p></div><span>COMING SOON ↗</span></div><div className={styles.engineLayout}><div className={styles.engineCards}><article><span>01</span><div><h3>Body Shape Engine</h3><p>Match measurements to a body shape and visual model.</p></div><b>↗</b></article><article><span>02</span><div><h3>Somatotype Engine</h3><p>Turn onboarding inputs into a somatotype profile.</p></div><b>↗</b></article><article><span>03</span><div><h3>Body Fat % Engine</h3><p>Calculate body fat with a choice of scientific formulas.</p></div><b>↗</b></article></div><div className={styles.engineCode}><div><span>MEASUREMENTS → INSIGHTS</span><b>EXAMPLE</b></div><pre>{engineExample}</pre><small>Illustrative request and response</small></div></div></section>
    </>;
}

export function LandingOutro() {
    return <section className={styles.outro}><div><p className={styles.eyebrow}>REAL PEOPLE. REAL SUPPORT.</p><h2>Built by engineers,<br /><em>supported by engineers.</em></h2><p>Skip the generic help desk. Get direct access to the team that built the API and trained the models.</p></div><div><StartLink className={styles.outroButton} /><span>250 free credits. Ready when you are.</span></div></section>;
}
