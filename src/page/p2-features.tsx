import * as React from "react";
import _ from "src/i18n/locale"
import { Footer } from "src/part/footer";
import NavigationBar from "src/part/navbar";

export default function P2Features() {
    return <>
        <NavigationBar title="" />
        <div className="ms-base-page pb-5">
            <img src="/img/s2_robot.webp" height={512} width={512} className="mx-auto img-fluid" alt={_("MAIN.P2.IMG")} />
            <h1 className="text-center pt-3">{_("MAIN.P2.HEAD")}</h1>

            <section>
                <h4 className="mt-4">{_("FEATURES.ABOUT")}</h4>
                <a href="https://letstag.app/trynow" target="_blank">
                    <small><i>{_("BTN.SRC2")}.</i></small>
                </a>
            </section>
            <section>
                <h2>{_("FEATURES.HEAD1")}</h2>
                <p className="mt-3">{_("FEATURES.DESC1")}</p>
            </section>

            <section >
                <h2>{_("FEATURES.HEAD2")}</h2>
                <p className="mt-3">{_("FEATURES.DESC2_1")}</p>
                <p className="mt-3">{_("FEATURES.DESC2_2")}</p>
            </section>

            <section >
                <h2>{_("FEATURES.HEAD3")}</h2>
                <p className="mt-3">{_("FEATURES.DESC3_1")}</p>
                <p className="mt-3">{_("FEATURES.DESC3_2")}</p>
                <p className="mt-3">{_("FEATURES.DESC3_3")}</p>
            </section>
        </div>
        <Footer />
    </>
}