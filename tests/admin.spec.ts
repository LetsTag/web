import { test, expect } from '@playwright/test';

test('admin manages a user and reviews credit history', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('session_token','admin-session'));
    await page.route('**/v1/auth/me', route => route.fulfill({ json: { name:'Admin', email:'admin@example.com', picture:null, has_purchased_credits:false, is_admin:true } }));
    const user = { user_id:'user-1', name:'Alice', email:'alice@example.com', picture:null, is_admin:false, banned:false, ban_reason:null, subscription:{type:null,status:'none'}, credits:{balance:100,total_granted:150,used:50,total_adjusted:0}, created_at:'2026-11-01T00:00:00Z',updated_at:'2026-11-01T00:00:00Z',last_login_at:null };
    await page.route('**/v1/admin/users?**', route => route.fulfill({ json:{users:[user],total:1,limit:20,offset:0} }));
    let adjustment: unknown;
    await page.route('**/v1/admin/users/user-1/credit', route => { adjustment=route.request().postDataJSON(); return route.fulfill({json:{balance:75}}); });
    await page.route('**/v1/admin/users/user-1/credit?**', route => route.fulfill({json:{entries:[{id:'entry',kind:'adjustment',amount:-25,occurred_at:'2026-11-01T00:00:00Z',description:'Administrator adjustment',endpoint:null,reason:'Correction'}],has_more:false}}));
    await page.goto('/');
    await page.getByRole('button',{name:/Admin/}).click();
    await page.getByRole('menuitem',{name:'Admin console'}).click();
    await expect(page.getByRole('heading',{name:'Admin console'})).toBeVisible();
    let synced = false;
    await page.route('**/v1/admin/subscriptions/sync', route => { synced = route.request().method() === 'POST'; return route.fulfill({json:{updated:2,transactions_recovered:1,transactions_skipped:0}}); });
    await page.getByRole('button',{name:'Sync with Paddle'}).click();
    await expect(page.getByText('Sync complete:', {exact:false})).toContainText('1 transactions recovered');
    expect(synced).toBe(true);
    await page.getByRole('button',{name:'alice@example.com'}).click();
    await page.getByRole('button',{name:'Update credits'}).click();
    await page.getByLabel('Credits to add or subtract').fill('-25');
    await page.getByLabel('Reason', {exact:true}).fill('Correction');
    await page.getByRole('button',{name:'Apply adjustment'}).click();
    await expect(page.getByText('Credits updated.')).toBeVisible();
    expect(adjustment).toEqual({amount:-25,reason:'Correction'});
    await page.getByRole('button',{name:'See credit history'}).click();
    await expect(page.getByRole('region',{name:'Credit usage history'})).toContainText('Correction');
});

test('admin view rejects a non-admin account', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('session_token','user-session'));
    await page.route('**/v1/auth/me', route => route.fulfill({ json:{name:'User',email:'user@example.com',picture:null,has_purchased_credits:false,is_admin:false} }));
    await page.goto('/admin/');
    await expect(page.getByRole('alert')).toContainText('Administrator sign-in is required.');
});
