import { test, expect } from '@playwright/test';

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
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Pay for what you use.');
});


test('checkout surfaces SDK initialization failures', async ({ page }) => {
    await page.route('https://cdn.paddle.com/paddle/v2/paddle.js', route => route.fulfill({ contentType: 'application/javascript', body: 'window.PaddleBillingV1 = { Environment: { set() {} }, Initialize() { throw new Error("Invalid token"); } };' }));
    await page.goto('/checkout/');
    await expect(page.getByRole('status')).toContainText('couldn’t load secure checkout');
});

test('account displays, copies, and rotates its API key', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.addInitScript(() => localStorage.setItem('session_token', 'session-test'));
    await page.route('**/auth/me', route => route.fulfill({ json: { name: 'Test User', email: 'test@example.com', picture: null } }));
    await page.route('**/v1/account/api-key', route => route.fulfill({ json: { api_key: 'wk_full_original_key', created_at: '2026-01-01T00:00:00Z' } }));
    await page.route('**/v1/account/api-key/rotate', route => route.fulfill({ json: { api_key: 'wk_full_rotated_key', created_at: '2026-02-01T00:00:00Z' } }));
    await page.goto('/account/');
    await expect(page.getByRole('heading', { name: 'API key', exact: true })).toBeVisible();
    await expect(page.getByText('wk_full_original_key')).toBeVisible();
    await page.getByRole('button', { name: 'Copy API key' }).click();
    await expect(page.getByText('API key copied.')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('wk_full_original_key');
    page.once('dialog', dialog => dialog.accept());
    await page.getByRole('button', { name: 'Regenerate Key', exact: true }).click();
    await expect(page.getByText('wk_full_rotated_key')).toBeVisible();
});
