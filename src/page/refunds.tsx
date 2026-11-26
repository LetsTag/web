import { SiteLayout } from '../shared/templates/SiteLayout';

export default function RefundsPage() {
    return <SiteLayout>
        <div style={{ maxWidth: 800, margin: '48px auto 80px', lineHeight: 1.7, color: '#233c36' }}>
            <h1>Refund Policy</h1>
            <p><em>Last Updated: November 25, 2026</em></p>
            <p>All billing, payments, and refunds for the LetsTag API (operated by Martspec LLC) are processed by <strong>Paddle</strong>, our Merchant of Record.</p>

            <h2>1. API Credit Purchases</h2>
            <p>Unless required by applicable law or approved under Paddle's Refund Policy, all purchases of API credits (both One-Time Refills and Monthly Refills) are final, non-refundable, and non-exchangeable once delivered to your account. Credits cannot be exchanged for cash or transferred between accounts.</p>

            <h2>2. Monthly Refill Cancellations</h2>
            <p>You may cancel your Monthly Refill at any time through the <strong>Manage billing</strong> link on your account page. Canceling stops future recurring charges, and any remaining credits stay in your account while it remains active. Canceling a Monthly Refill does not automatically refund the current or prior billing cycles.</p>

            <h2>3. Inactive Accounts and Credit Forfeiture</h2>
            <p>Purchased credits do not expire as long as your account remains active. However, if an account has zero activity (no API requests and no dashboard logins) for 12 continuous months, it is classified as abandoned. Martspec LLC reserves the right to close abandoned accounts and permanently forfeit any remaining credit balance without refund.</p>

            <h2>4. Statutory Rights and Discretionary Refunds</h2>
            <p>Nothing in this policy limits mandatory consumer rights under applicable law or remedies for a service that is materially faulty or not as described. Outside of statutory rights, Paddle may review refund requests submitted within 14 days of the transaction date on a case-by-case basis at its sole discretion. If a refund is approved, the corresponding credits will be revoked from your account.</p>

            <h2>5. How to Request a Refund</h2>
            <p>Because Paddle handles all transactions, refund requests must be submitted directly to Paddle using the link in your transaction receipt email or via <a href="https://paddle.net/">paddle.net</a>. For technical issues with the API, contact us first at <a href="mailto:api@martspec.com">api@martspec.com</a> so we can resolve the problem.</p>
        </div>
    </SiteLayout>;
}
