const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const imagePattern = /\.(avif|heic|webp|png|jpe?g|svg|gif|ico)$/i;
function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const filename = path.join(directory, entry.name);
        return entry.isDirectory() ? walk(filename) : [filename];
    });
}
function digest(filename) {
    assert.ok(fs.existsSync(filename), `Missing asset: ${filename}`);
    return createHash('sha256').update(fs.readFileSync(filename)).digest('hex');
}
let checked = 0;
for (const source of walk('src/img').filter(filename => imagePattern.test(filename))) {
    const relative = path.relative('src/img', source);
    const destinations = [path.join('build/img', relative)];
    if (/^(exercise|emotion|emotion_watch|size_watch)\//.test(relative)) destinations.push(path.join('build/img', path.basename(relative)));
    if (relative.startsWith('size/')) destinations.push(path.join('build/img', relative.slice(5)));
    if (relative.startsWith('icon/')) destinations.push(path.join('build', relative));
    const original = digest(source);
    for (const destination of new Set(destinations)) {
        assert.equal(digest(destination), original, `Image changed: ${destination}`);
        checked++;
    }
}
const allowedHtml = ['index.html', 'account/index.html', 'checkout/index.html', '404.html', 'pmail_22c30242162cf766f0b95cf7fe1e790e.html'].sort();
assert.deepEqual(walk('build').filter(name => name.endsWith('.html')).map(name => path.relative('build', name)).sort(), allowedHtml, 'Unexpected page in production output');
console.log(`Verified ${checked} image URLs byte-for-byte; only main, account, checkout, 404, and email verification HTML are emitted.`);
