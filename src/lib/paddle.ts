import type { Paddle, PaddleEventData } from '@paddle/paddle-js';

let initialization: Promise<Paddle | undefined> | undefined;
export function loadPaddle(onEvent: (event: PaddleEventData) => void): Promise<Paddle | undefined> {
    if (!__PADDLE_CLIENT_TOKEN__) return Promise.reject(new Error('Paddle is not configured.'));
    // Load the SDK only on checkout. Paddle processes the original URL, including payment-update tokens.
    initialization ??= import('@paddle/paddle-js').then(({ initializePaddle }) => initializePaddle({
        token: __PADDLE_CLIENT_TOKEN__,
        environment: __PADDLE_ENVIRONMENT__,
        checkout: { settings: { displayMode: 'overlay', theme: 'light', locale: 'en' } },
        eventCallback: onEvent,
    })).then(paddle => {
        if (!paddle?.Initialized) throw new Error('Paddle initialization failed.');
        return paddle;
    });
    return initialization;
}
