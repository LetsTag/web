import { SiteLayout } from "../shared/templates/SiteLayout";
export default function TermsPage() { return <SiteLayout><main style={{maxWidth: 800, margin: "48px auto 80px", lineHeight: 1.7, color: "#233c36"}}><h1>API Terms of Service</h1>
<h2>1. Fees and Credit Consumption</h2>
        <p>Our API operates on a consumption-based credit model where one returned top-level entity (e.g., one exercise or one piece of equipment) equals one credit.</p>
        <ul>
            <li><strong>Defining a Billable Item:</strong> Credits are strictly calculated based on the top-level items returned in the response's primary array or dictionary. Any nested properties, dictionaries, or arrays <em>within</em> that primary item are included at no additional cost.</li>
            <li><strong>Query Limits:</strong> Credit consumption is dictated by the <code>limit</code> query parameter in your API request, which defines the maximum number of top-level items returned in the payload.</li>
            <li><strong>Defaults:</strong> If no <code>limit</code> is specified, the API returns up to 10 items by default. Each returned top-level item consumes one credit.</li>
            <li><strong>Depletion:</strong> Once your credit balance reaches zero, the API will return a <code>429 Too Many Requests</code> error until the account is refilled.</li>
        </ul>
<h2>2. Payment Processing and Merchant of Record</h2>
<p>All sales, billing, and payment processing for API credits and subscriptions are securely managed by <strong>Paddle</strong>. Paddle acts as our Merchant of Record (MoR). This means that when you purchase credits, Paddle handles the transaction, issues the receipt, and manages any applicable regional taxes (such as VAT or sales tax) on our behalf.</p>
<h2>3. Intellectual Property and Ownership</h2>
<p>We retain full and exclusive ownership of all data, text descriptions, images, videos, metadata, and calculation models provided through the API. Purchasing credits grants you a limited, non-exclusive license to display this content within your consumer-facing application, but it does not transfer any ownership rights.</p>
<h2>4. Usage Restrictions and Asset Protection</h2>
<p>To protect the integrity and value of our human-perfected dataset, the following actions are strictly prohibited and will result in immediate account termination without refund:</p>
<ul>
<li><strong>No Resale or Redistribution:</strong> You may not resell, redistribute, sub-license, or publicly host the raw data files, JSON payloads, images, videos, or any other assets provided by the API. The data must only be surfaced organically through your application's user interface.</li>
<li><strong>No Asset Modification:</strong> You may not alter, edit, manipulate, or remove watermarks from our images, videos, or visual assets.</li>
<li><strong>No Machine Learning Training:</strong> You are strictly forbidden from scraping or using our dataset, text descriptions, or visual assets to train, fine-tune, or test any machine learning models or artificial intelligence systems intended to reproduce, mimic, or substitute the functionality of this API.</li>
</ul>
<h2>5. Refunds and All Sales Final</h2>
<p>All purchases of API credits and subscriptions are final and non-refundable. Once credits are added to your account balance, they cannot be exchanged for cash, transferred to another account, or refunded to your original payment method, regardless of whether you have used them or not.</p>
<h2>6. Credit Expiration and Account Abandonment</h2>
<p>Credits do not expire as long as your account remains active. However, to safely manage our infrastructure and database liabilities, we enforce an account abandonment policy. If an account shows zero activity—defined as no API requests and no dashboard logins—for a continuous period of 12 months, the account will be classified as abandoned. We reserve the right to close abandoned accounts, at which point any remaining credit balance will be permanently forfeited without refund or notice.</p>
<h2>7. Rate Limiting and Fair Use</h2>
<p>While your usage is governed by your credit balance, we enforce technical rate limits (e.g., maximum requests per second) to ensure the stability of our infrastructure for all users. We reserve the right to temporarily suspend or permanently terminate your access, without refund, if we detect malicious activity, automated scraping attempts, DDoS patterns, or any usage that degrades the performance of the API for others.</p>
<h2>8. Service Availability and "As Is" Provision</h2>
<p>The API is provided on an "as is" and "as available" basis. While we strive for maximum uptime, we do not guarantee uninterrupted, error-free service. We reserve the right to perform scheduled maintenance, which may cause temporary downtime. We do not offer Service Level Agreements (SLAs) for the Free or standard Pro tiers.</p>
<h2>9. Limitation of Liability</h2>
<p>Under no circumstances shall we be held liable for any direct, indirect, incidental, or consequential damages—including lost profits, lost revenue, or business interruption—arising from your use of, or inability to use, our API. If our database experiences an outage, our total liability is strictly limited to the amount you paid for your current active credit balance.</p>
<h2>10. Medical Disclaimer and Accuracy of Data</h2>
<p>All data provided through the API—including but not limited to exercise descriptions, motion mechanics, muscle activation arrays, MET scores, body shape profiles, and biometric calculations (such as body fat percentage and lean muscle mass)—is provided for general informational and educational purposes only.</p>
<ul>
<li><strong>Not Medical Advice:</strong> Our API does not provide medical advice, diagnosis, or treatment. You agree that you will not present the API data to your end-users as a substitute for professional medical consultation or physical therapy.</li>
<li><strong>No Guarantee of Accuracy:</strong> While our dataset is heavily curated and engineered for high quality, biomechanics and physiological calculations are inherently variable. We make no warranties, express or implied, regarding the absolute accuracy, safety, or completeness of any data, formulas, or visual models.</li>
<li><strong>End-User Liability:</strong> You (the developer) are solely responsible for how you display this data in your application. You agree to indemnify and hold us harmless against any claims, damages, or injuries filed by your end-users arising from their reliance on data, routines, or calculations powered by our API.</li>
</ul>
</main></SiteLayout>; }
