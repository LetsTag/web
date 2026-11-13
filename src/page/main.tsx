import { SiteLayout } from '../shared/templates/SiteLayout';
import { Pricing } from '../shared/organisms/Pricing';
import { LandingIntro, LandingOutro } from '../shared/organisms/Landing';
export default function MainPage() {
    return <SiteLayout><LandingIntro /><Pricing /><LandingOutro /></SiteLayout>;
}
