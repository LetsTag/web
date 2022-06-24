import * as React from "react";
import _, { Locale } from "src/i18n/locale"
import { Footer } from "../part/footer";
import NavBarLang from "src/part/navbar-lang";


export default function LandingPage() {
    return (
        <div>
            <NavBarLang />

            <section id="header" className="rr-s text-center">
                <img src="/img/logo_512.webp" height={512} width={512} className="mx-auto img-fluid" alt={_("MAIN.HEAD")} />
            </section>


            <section className="rr-s-product pw-color-bg-secondary">
                <div className="row ms-s-offset">
                    <div className="col-md-6 align-self-center order-last order-md-1">
                        <p className="mt-2">{_("MAIN.P1.SUBHEAD")}</p>
                        <h1>{_("MAIN.P1.HEAD")}</h1>
                        <h2>{_("MAIN.P1.TEXT")}</h2>
                        <a href={Locale.i18nLink("newoil")} className="mt-3 rr-btn-large">{_("MAIN.P1.BTN")}</a>
                    </div>
                    <div className="col-md-4 order-sm-1">
                        <img src="/img/s1_newOil.webp" height={512} width={512} className="mx-auto img-fluid" alt={_("MAIN.P1.IMG")} />
                    </div>
                </div>
            </section>

            <section className="rr-s-product my-5">
                <div className="row ms-s-offset">
                    <div className="col-md-4">
                        <img src="/img/s2_robot.webp" height={512} width={512} className="mx-auto img-fluid" alt={_("MAIN.P2.IMG")} />
                    </div>

                    <div className="col-md-6 align-self-center">
                        <p className="mt-2">{_("MAIN.P2.SUBHEAD")}</p>
                        <h1>{_("MAIN.P2.HEAD")}</h1>
                        <h2>{_("MAIN.P2.TEXT")}</h2>
                        <a href={Locale.i18nLink("features")} className="mt-3 rr-btn-large pull-right">{_("MAIN.P2.BTN")}</a>
                    </div>
                </div>
            </section>

            <section className="rr-s-product pw-color-bg-secondary">
                <div className="row ms-s-offset">
                    <div className="col-md-6 align-self-center order-last order-md-1">
                        <p className="mt-2">{_("MAIN.P3.SUBHEAD")}</p>
                        <h1>{_("MAIN.P3.HEAD")}</h1>
                        <h2>{_("MAIN.P3.TEXT")}</h2>
                        <a href={Locale.i18nLink("trynow")} className="mt-3 rr-btn-large">{_("MAIN.P3.BTN")}</a>
                    </div>

                    <div className="col-md-4 order-sm-1">
                        <img src="/img/p3_experement.webp" height={512} width={512} className="mx-auto img-fluid" alt={_("MAIN.P3.IMG")} />
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}