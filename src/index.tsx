import { createRoot } from 'react-dom/client';
import { App } from './router';

const host = document.getElementById('root');
if (!host) throw new Error('Missing application root.');
const shadow = host.shadowRoot ?? host.attachShadow({ mode: 'open' });
// CSS Modules prevent component collisions; Shadow DOM prevents outside styles leaking in.
// Production CSS is also loaded in the document by webpack, so clone its links into the shadow.
for (const stylesheet of document.querySelectorAll('link[rel="stylesheet"]')) {
    shadow.appendChild(stylesheet.cloneNode(true));
}
const mount = document.createElement('div');
shadow.appendChild(mount);
createRoot(mount).render(<App />);
