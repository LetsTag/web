import { test, expect, type Page } from '@playwright/test';

async function mockPricing(page: Page) {
    const names = ['free_monthly', 'free_annual', 'lite_monthly', 'lite_annual', 'plus_monthly', 'plus_annual', 'max_monthly', 'max_annual'];
    const values = ['$0', '$0', '$12.99', '$125', '$29.99', '$285', '$99.99', '$950'];
    const prices = Object.fromEntries(names.map((name, i) => [name, 'pri_' + String.fromCharCode(97 + i).repeat(26)]));
    const formatted = Object.fromEntries(names.map((name, i) => [prices[name], values[i]]));
    await page.route('**/v1/pricing/catalog', route => route.fulfill({ json: { prices } }));
    await page.route('https://cdn.paddle.com/paddle/v2/paddle.js', route => route.fulfill({
        contentType: 'application/javascript',
        body: `window.PaddleBillingV1 = { Environment: { set() {} }, Initialize() { this.Initialized = true; }, PricePreview({ items }) { const amounts = ${JSON.stringify(formatted)}; return Promise.resolve({ data: { details: { lineItems: items.map(item => ({ price: { id: item.priceId }, formattedTotals: { subtotal: amounts[item.priceId] } })) } } }); }, Checkout: { open(options) { window.checkoutOptions = options; } } };`,
    }));
}

const expectedFeatures = [
    ['Target audience', 'Hackathon devs & evaluation', 'Indie apps & solo developers', 'Growing apps & platforms', 'High-traffic & enterprise apps'],
    ['Monthly price', '$0 / mo', '$12.99 / mo', '$29.99 / mo', '$99.99 / mo'],
    ['Annual price', '$0 / year', '$125 / year', '$285 / year', '$950 / year'],
    ['Monthly call limit', '500 calls (Hard Cap)', '10,000 calls (Hard Cap)', '100,000 calls (Soft Cap)', '500,000 calls (Soft Cap)'],
    ['Male images', 'Watermarked', 'Clean (High-Res)', 'Clean (High-Res)', 'Clean (High-Res)'],
    ['Female images', '—', '—', 'Clean (High-Res)', 'Clean (High-Res)'],
    ['Equipment images', 'Watermarked', '—', 'Clean (High-Res)', 'Clean (High-Res)'],
    ['Male videosUpcoming', '—', '—', '—', 'Included'],
    ['Female videosUpcoming', '—', '—', '—', 'Included'],
    ['Languages', 'English only', 'English, Spanish, German', 'All 30 Languages', 'All 30 Languages'],
    ['Metadata depth', 'Basic descriptions', 'Names, desc, modalities', 'Full metadata (MET, recovery)', 'Full metadata'],
    ['Muscle mapping', 'Primary muscles only', 'Primary + Secondary', 'Full visual muscle maps', 'Full visual muscle maps'],
    ['Overage billing', 'Blocked (429 Error)', 'Blocked (Requires upgrade)', '$1.50 per 1,000 calls', '$1.00 per 1,000 calls'],
];

test('shows the exact pricing matrix and switches billing without changing call limits', async ({ page }) => {
    await mockPricing(page);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Big ideas.Straightforward pricing.');
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(expectedFeatures.length);
    for (const [index, values] of expectedFeatures.entries()) {
        await expect(rows.nth(index).locator('th, td')).toHaveText(values);
    }
    await expect(page.getByRole('article', { name: 'Lite plan' })).toContainText('$12.99');
    await page.getByRole('button', { name: /Annually/ }).click();
    await expect(page.getByRole('button', { name: /Annually/ })).toHaveAttribute('aria-pressed', 'true');
    for (const [name, price] of [['Free', '$0'], ['Lite', '$125'], ['Plus', '$285'], ['Max', '$950']]) {
        await expect(page.getByRole('article', { name: `${name} plan` })).toContainText(price);
    }
    await expect(page.getByRole('article', { name: 'Plus plan' })).toContainText('100,000');
    await page.getByRole('button', { name: 'Monthly', exact: true }).click();
    await expect(page.getByRole('article', { name: 'Max plan' })).toContainText('$99.99');
    expect(errors).toEqual([]);
    expect(await page.locator('script[src*="cdn.paddle.com"]').count()).toBe(1);
});

test('external CSS cannot restyle atomic components', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { level: 1 });
    const read = () => heading.evaluate(element => {
        const style = getComputedStyle(element);
        return [style.color, style.fontSize, style.fontFamily, style.margin, style.display];
    });
    const before = await read();
    await page.addStyleTag({ content: '* { color: red !important; font-size: 5px !important; font-family: monospace !important; margin: 100px !important; } h1 { display: none !important; }' });
    expect(await read()).toEqual(before);
    await expect(heading).toBeVisible();
});

for (const width of [1440, 768, 390, 320]) {
    test(`pricing is usable at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto('/');
        await expect(page.getByRole('article')).toHaveCount(4);
        const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
        expect(horizontalOverflow).toBe(false);
        const region = page.getByRole('region', { name: /Plan feature comparison/ });
        if (width < 900) {
            expect(await region.evaluate(element => element.scrollWidth > element.clientWidth)).toBe(true);
            await region.evaluate(element => { element.scrollLeft = element.scrollWidth; });
            expect(await region.evaluate(element => element.scrollLeft)).toBeGreaterThan(0);
        }
        await page.screenshot({ path: `test-results/pricing-${width}.png`, fullPage: true });
    });
}

test('Paddle initializes in sandbox, keeps payment tokens, and delegates overlay opening to Paddle', async ({ page }) => {
    await page.route('https://cdn.paddle.com/paddle/v2/paddle.js', route => route.fulfill({
        contentType: 'application/javascript',
        body: `window.PaddleBillingV1 = {
            Environment: { set(value) { window.paddleEnvironment = value; } },
            Initialize(options) { window.paddleOptions = options; window.paddleURL = location.href; this.Initialized = true; options.eventCallback({ name: 'checkout.loaded' }); },
            Checkout: { open() { throw new Error('Application must not override payment links'); } }
        };`,
    }));
    await page.goto('/checkout?_ptxn=txn_example&_pctx=keep%2Bthis');
    await expect(page.getByRole('heading', { name: 'Payment details' })).toBeVisible();
    await expect(page.getByRole('status')).toContainText('Follow the steps');
    const initialized = await page.evaluate(() => {
        const state = window as any;
        return { environment: state.paddleEnvironment, token: state.paddleOptions.token, settings: state.paddleOptions.checkout.settings, url: state.paddleURL };
    });
    expect(initialized.environment).toBe('sandbox');
    expect(initialized.token).toMatch(/^test_/);
    expect(initialized.settings.displayMode).toBe('overlay');
    expect(new URL(initialized.url).searchParams.get('_ptxn')).toBe('txn_example');
    expect(new URL(initialized.url).searchParams.get('_pctx')).toBe('keep+this');
    for (const [event, message] of [['checkout.closed', 'Checkout closed'], ['checkout.completed', 'Your checkout is complete'], ['checkout.error', 'couldn’t load']]) {
        await page.evaluate(name => (window as any).paddleOptions.eventCallback({ name }), event);
        await expect(page.getByRole('status')).toContainText(message);
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
});

test('checkout handles a failed Paddle script without a blank page', async ({ page }) => {
    await page.route('https://cdn.paddle.com/paddle/v2/paddle.js', route => route.abort());
    await page.goto('/checkout/');
    await expect(page.getByRole('status')).toContainText('couldn’t load secure checkout');
    await expect(page.getByRole('link', { name: 'Back to pricing' })).toHaveAttribute('href', '/');
});

test('checkout with no payment token stays ready without opening its own overlay', async ({ page }) => {
    await page.route('https://cdn.paddle.com/paddle/v2/paddle.js', route => route.fulfill({ contentType: 'application/javascript', body: 'window.PaddleBillingV1 = { Environment: { set() {} }, Initialize() { this.Initialized = true; } };' }));
    await page.goto('/checkout/');
    await expect(page.getByRole('status')).toContainText('If you arrived from a Paddle payment email');
});

test('removed pages are absent and the 404 fallback provides a route home', async ({ page, request }) => {
    for (const route of ['/about/', '/mission/', '/features/', '/newoil/', '/trynow/', '/privacy-policy/', '/de/']) {
        expect((await request.get(route)).status()).toBe(404);
    }
    await page.goto('/404.html');
    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    await page.getByRole('link', { name: 'Back to pricing' }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Straightforward pricing.');
});


test('checkout surfaces SDK initialization failures', async ({ page }) => {
    await page.route('https://cdn.paddle.com/paddle/v2/paddle.js', route => route.fulfill({ contentType: 'application/javascript', body: 'window.PaddleBillingV1 = { Environment: { set() {} }, Initialize() { throw new Error("Invalid token"); } };' }));
    await page.goto('/checkout/');
    await expect(page.getByRole('status')).toContainText('couldn’t load secure checkout');
});

test('plan actions follow the session and pass the verified email to checkout', async ({ page }) => {
    let signedIn = false;
    await page.route('**/auth/me', route => signedIn
        ? route.fulfill({ json: { name: 'Test User', email: 'test@example.com', picture: null } })
        : route.fulfill({ status: 401, json: {} }));
    await page.route('**/auth/signout', route => { signedIn = false; return route.fulfill({ status: 204 }); });
    await page.route('**/v1/checkout', route => route.fulfill({ json: { transaction_id: 'txn_test' } }));
    await mockPricing(page);
    await page.goto('/');
    await expect(page.getByText('Sign-in to checkout')).toHaveCount(4);
    await expect(page.getByRole('button', { name: 'Choose Lite' })).toHaveCount(0);
    signedIn = true;
    await page.evaluate(() => { localStorage.setItem('session_token', 'test'); window.dispatchEvent(new Event('signed-in')); });
    await expect(page.getByRole('button', { name: 'Choose Lite' })).toBeVisible();
    await page.getByRole('button', { name: 'Choose Lite' }).click();
    await expect.poll(() => page.evaluate(() => (window as any).checkoutOptions)).toMatchObject({ transactionId: 'txn_test', customer: { email: 'test@example.com' } });
    await page.reload();
    await page.getByRole('button', { name: /Test User/ }).click();
    await page.getByRole('menuitem', { name: 'Sign out' }).click();
    await expect(page.getByText('Sign-in to checkout')).toHaveCount(4);
});

test('account lists only API key identifiers returned for the signed-in user', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('session_token', 'session-test'));
    await page.route('**/auth/me', route => route.fulfill({ json: { name: 'Test User', email: 'test@example.com', picture: null } }));
    await page.route('**/v1/account/api-keys', route => route.fulfill({ json: { keys: [{ prefix: 'wk_123456789', created_at: '2026-01-01T00:00:00Z', last_used_at: null }] } }));
    await page.goto('/account/');
    await expect(page.getByRole('heading', { name: 'API keys' })).toBeVisible();
    await expect(page.getByText('wk_123456789…')).toBeVisible();
    await expect(page.getByText('Full keys cannot be displayed again.', { exact: false })).toBeVisible();
});
