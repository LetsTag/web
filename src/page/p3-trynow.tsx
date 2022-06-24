import * as React from "react";
import _ from "src/i18n/locale"
import { Footer } from "src/part/footer";
import NavigationBar from "src/part/navbar";


export default function P3TryNow() {
    return <>
        <NavigationBar />
        <div className="ms-base-page pb-5">
            <img src="/img/p3_experement.webp" height={512} width={512} className="mx-auto img-fluid" alt={_("MAIN.P2.IMG")} />
            <h1 className="text-center pt-3">{_("MAIN.P3.HEAD")}</h1>

            <section>
                <h4 className="mt-4">{_("TRYNOW.ABOUT")}</h4>
            </section>
            <section>
                <h2>{_("TRYNOW.HEAD1")}</h2>
                <p className="mt-3">{_("TRYNOW.DESC1")}</p>
            </section>

            <section >
                <h2>{_("TRYNOW.HEAD2")}</h2>
                <p className="mt-3">{_("TRYNOW.DESC2_1")}</p>
                <p className="mt-3">{_("TRYNOW.DESC2_2")}</p>
            </section>

            <section >
                <h2>{_("TRYNOW.HEAD3")}</h2>
                <p className="mt-3">{_("TRYNOW.DESC3_1")}</p>
                <p className="mt-3">{_("TRYNOW.DESC3_2")}</p>
                <p className="mt-3">{_("TRYNOW.DESC3_3")}</p>
            </section>
        </div>
        <Footer />
    </>
}