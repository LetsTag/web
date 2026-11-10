// style-loader's insert module runs in the browser, inside the app's style boundary.
module.exports = function insertStyles(element) {
    var host = document.getElementById('root');
    var shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    shadow.appendChild(element);
};
