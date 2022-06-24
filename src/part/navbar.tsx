import * as React from "react";
import _, { Locale } from "src/i18n/locale"
import NavBarLang from "./navbar-lang";

export default function NavigationBar() {
    return <nav className="rr-navbar">
        <div className="lButton">
            <a className="btn btn-link" href={Locale.i18nLink("/")}>
                <img src="/img/logo.png" className="img-fluid" alt={_("ERROR.404_BTN")} />
            </a>
        </div>
        <NavBarLang />
    </nav>
}