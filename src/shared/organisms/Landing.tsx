import { useState } from 'react';
import { formatUpdateDate, releasedUpdates } from '../../lib/productUpdates';
import styles from './Landing.module.css';

declare const __AUTH_API_BASE_URL__: string;
const image = '/img/marketing/front-squat.webp';
const latestUpdate = releasedUpdates[0];
const exerciseExample = `{
  "name": "Dumbbell Front Squat",
  "modality": "strength",
  "measure": "reps",
  "mode": "massDouble",
  "muscles": [{ "id": "QUADRICEPS",
    "role": "primary" }],
  "equipment": [{ "id": "DUMBBELLS" }],
  "met": 3.0,
  "image": "https://…",
  "thumb": "https://…"
}`;
function StartLink({ className }: { className: string }) {
    return <div><a className={className} href="/pricing/">Start for free <span aria-hidden="true">↗</span></a></div>;
}

export function LandingIntro() {
    const [language, setLanguage] = useState<'EN' | 'ES' | 'DE'>('EN');
    const names = { EN: 'Dumbbell front squat', ES: 'Sentadilla frontal con mancuernas', DE: 'Kurzhantel-Frontkniebeuge' };
    return <>
        <section className={styles.hero}>
            <div className={styles.heroCopy}>
                <p className={styles.eyebrow}><span /> FITNESS DATA, BUILT FOR DEVELOPERS</p>
                <h1>Build fitness apps with <em>illustrated exercise data.</em></h1>
                <p className={styles.lead}>Find exercises by muscle group or equipment. Get movement descriptions and human-reviewed illustrations in one API call.</p>
                <div className={styles.actions}><StartLink className={styles.primary} /><a className={styles.secondary} href={`${__AUTH_API_BASE_URL__}/v1/docs`}>Read the Docs <span aria-hidden="true">↗</span></a></div>
                <p className={styles.creditNote}><span>✓</span> 3,000 evaluation credits to get started</p>
            </div>
            <div className={styles.heroVisual}>
                <div className={styles.codeWindow}><div className={styles.codeTop}><span className={styles.codeDots}><i /><i /><i /></span><span>exercise.json</span><span className={styles.codeBadge}>EXAMPLE</span></div><div className={styles.codeRequest}><span>GET</span> /v1/exercise/DUMBBELL_FRONT_SQUAT</div><pre>{exerciseExample}</pre><div className={styles.codeFoot}>Response excerpt</div></div>
                <div className={styles.heroImage}><div className={styles.imageGlow} /><img src={image} alt="An anatomical illustration of a dumbbell front squat" /><span className={styles.imageTag}>DUMBBELL FRONT SQUAT <b>↗</b></span></div>
            </div>
        </section>
        <a className={styles.momentum} href="/updates/">
            <span className={styles.pulse} aria-hidden="true" />
            <strong>Latest Update <time dateTime={latestUpdate.date}>({formatUpdateDate(latestUpdate.date, true)})</time></strong>
            <span className={styles.momentumSummary}>{latestUpdate.title}</span>
            <span className={styles.momentumArrow} aria-hidden="true">↗</span>
        </a>
        <section className={styles.showcase} aria-labelledby="showcase-title">
            <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>MORE THAN A DATABASE</p><h2 id="showcase-title">The details make<br /><em>the difference.</em></h2></div><p>Visuals that move people. Data that gives you room to build something better.</p></div>
            <div className={styles.featureGrid}>
                <article className={styles.featureCard}><div className={styles.visualCompare}><div className={styles.figureSide}><span>STANDARD</span><svg viewBox="0 0 100 130" aria-label="Simple stick figure" role="img"><circle cx="48" cy="20" r="10"/><path d="M48 32v43M23 48l25-10 27 9M48 75l-20 32M48 75l22 32"/></svg></div><div className={styles.richSide}><span>LET’S TAG</span><img src={image} alt="Detailed anatomical exercise illustration" loading="lazy" /></div></div><div className={styles.cardCopy}><span className={styles.cardNumber}>01 / VISUALS</span><h3>Flawless Visuals</h3><p>Studio-quality, transparent-background imagery, refined by humans and ready for your app.</p></div></article>
                <article className={styles.featureCard}><div className={styles.metadataVisual}><div><span>MET SCORE</span><strong>5.0 <small>MET</small></strong><i>↗</i></div><div><span>RECOVERY</span><strong>48 <small>HRS</small></strong><i>◷</i></div><p>MODALITY <b>STRENGTH</b></p></div><div className={styles.cardCopy}><span className={styles.cardNumber}>02 / DATA</span><h3>Exercise Metadata</h3><p>Give every movement context with MET scores, recovery times, and modality tags.</p></div></article>
                <article className={styles.featureCard}><div className={styles.languageVisual}><div className={styles.languageTabs}>{(['EN', 'ES', 'DE'] as const).map(value => <button key={value} type="button" aria-pressed={language === value} onClick={() => setLanguage(value)}>{value}</button>)}</div><span>EXERCISE NAME</span><strong>{names[language]}</strong><div className={styles.translationMark}>Aa <span>↗</span></div></div><div className={styles.cardCopy}><span className={styles.cardNumber}>03 / LOCALIZATION</span><h3>Global Reach</h3><p>Bring your product to more people with exercise names and instructions in multiple languages.</p></div></article>
            </div>
        </section>
        <section className={styles.engines} aria-labelledby="catalog-filters-title">
            <div className={styles.engineHeading}>
                <div>
                    <h2 id="catalog-filters-title">Don’t just fetch data.<br /><em>Find the right exercises.</em></h2>
                    <p>Build an exercise picker with three filters you can combine in a single request.</p>
                </div>
            </div>
            <div className={styles.engineLayout}>
                <div className={styles.engineCards}>
                    <article><div><h3>Browse by modality</h3><p>Give strength, cardio, and flexibility exercises their own views.</p></div></article>
                    <article><div><h3>Filter by equipment</h3><p>Choose dumbbells to show exercises that use them, or select an air bike to explore that machine’s entries.</p></div></article>
                    <article><div><h3>Explore by muscle group</h3><p>List the exercises tagged by muscle group, from biceps curls to chest presses.</p></div></article>
                </div>
                <div className={styles.engineCode}>
                    <div>Dumbbell exercises for biceps</div>
                    <pre><code>{String.raw`curl -G https://api.letstag.app/v1/exercise \
  -H "Authorization: Bearer $API_KEY" \
  -d modality=strength \
  -d equipment=DUMBBELLS \
  -d muscle=BICEPS`}</code></pre>
                    <small>Matching exercises include Alternating Hammer Curl.</small>
                </div>
            </div>
        </section>
    </>;
}

export function LandingOutro() {
    return <section className={styles.outro} aria-labelledby="support-title">
        <div className={styles.outroIntro}>
            <p className={styles.eyebrow}>REAL PEOPLE. REAL SUPPORT.</p>
            <h2 id="support-title">Built by engineers,<br /><em>supported by engineers.</em></h2>
            <p>Get direct access to the team that built the API. Explore how the same air bike appears in our equipment library and in an exercise illustration.</p>
        </div>
        <div className={styles.equipmentGrid}>
            <article className={styles.featureCard}>
                <div className={styles.equipmentVisual}>
                    <img src="/img/marketing/air-bike-equipment.webp" alt="Air bike with pedals, moving handlebars, and a fan wheel" width="1536" height="1536" loading="lazy" />
                </div>
                <div className={styles.cardCopy}>
                    <h3>Air bike equipment</h3>
                    <p>Show users the gear they’ll need with standalone equipment images for workout previews and equipment pickers.</p>
                </div>
            </article>
            <article className={styles.featureCard}>
                <div className={styles.equipmentVisual}>
                    <img src="/img/marketing/air-bike-exercise.webp" alt="A person pedaling an air bike, with engaged muscles highlighted" width="1086" height="1448" loading="lazy" />
                </div>
                <div className={styles.cardCopy}>
                    <h3>Air bike exercise</h3>
                    <p>Show the same machine in use, with an anatomical illustration that makes it easier to understand the movement and see which muscles are engaged.</p>
                </div>
            </article>
        </div>
        <div className={styles.outroAction}>
            <StartLink className={styles.outroButton} />
            <span>3,000 free credits. Ready when you are.</span>
        </div>
    </section>;
}
