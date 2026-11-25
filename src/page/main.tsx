import { SiteLayout } from '../shared/templates/SiteLayout';
import { LandingIntro, LandingOutro } from '../shared/organisms/Landing';
export default function MainPage() {
    return <SiteLayout><LandingIntro /><LandingOutro /></SiteLayout>;
}
