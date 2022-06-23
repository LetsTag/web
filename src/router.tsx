import * as React from "react";
import MainPage from "src/page/main";
import Error_404 from 'src/error/404';
import P1NewOil from "./page/p1-newoil";
import P2Features from "./page/p2-features";
import P3TryNow from "./page/p3-trynow";
import PrivacyPolicy from "./page/private-policy";
import { Locale } from "src/i18n/locale";

import About from "src/page/about";
import Mission from "src/page/mission";


export function App() {
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect == null)
        redirect = location.pathname;
    else
        redirect = redirect.replace(location.href, '/');

    if (redirect.length > 1)
        redirect = redirect.replace(/\/$/, "");

    switch (Locale.setLanguageFromUrl(redirect)) {
        case "/":
            return <MainPage />;
        case "/newoil":
            return <P1NewOil />;
        case "/features":
            return <P2Features />;
        case "/trynow":
            return <P3TryNow />;
        case "/privacy-policy":
            return <PrivacyPolicy />;
        case "/about":
            return <About />
        case "/mission":
            return <Mission />
        default:
            return <Error_404 />;
    }
}

