import * as React from "react";
import _ from "src/i18n/locale"
import { Footer } from "src/part/footer";
import IronImage from "src/part/iron-image";
import NavigationBar from "src/part/navbar";


export default function P1NewOil() {
    return (
        <div>
            <NavigationBar title={_("MAIN.P1.HEAD")} />

            <section className="rr-s-about ms-s-offset">
                <div className="row" >
                    <div className="col-sm-12 col-md-9 order-last order-md-1">
                        <h3 className="mt-3">{_("PRODUCT.P1.ABOUT")}</h3>

                        <h1>{_("PRODUCT.P1.HEAD1")}</h1>
                        <h3 className="mt-3">
                            {_("PRODUCT.P1.DESC1")}

                        </h3>


                        <h1>{_("PRODUCT.P1.HEAD2")}</h1>
                        <h3 className="mt-3">
                            {_("PRODUCT.P1.DESC2")}
                        </h3>


                        <h1>{_("PRODUCT.P1.HEAD3")}</h1>
                        <h3 className="mt-3">
                            {_("PRODUCT.P1.DESC3")}
                        </h3>

                        <h1>{_("PRODUCT.P1.HEAD4")}</h1>
                        <h3 className="mt-3">
                            {_("PRODUCT.P1.DESC4")}
                        </h3>

                        <h1 style={{ color: "#BF4803" }}>{_("PRODUCT.P1.HEAD5")}</h1>
                        <h3 className="mt-3">
                            {_("PRODUCT.P1.DESC5")}
                        </h3>


                    </div>

                    <div className="col-sm-12 col-md-3 order-sm-1">
                        <img src="/img/s1_newOil.webp" className="mx-auto" alt={_("MAIN.P1.IMG")} />
                    </div>
                </div>
            </section>


            <div className="container mb-5 pb-5">
                <div className="row align-items-center justify-content-sm-center" >
                    {/* <div className="col-md-7 col-12 pb-5">
                        <IronImage imgLo="/img/s1_newOil.png" imgHi="/img/s1_newOil.png" text={_("MAIN.P1.IMG")} />
                    </div> */}
                    <div className="col-md-5 col-12 text-center pb-5">
                        <a href={`https://apps.apple.com/${_("APPSTORE")}/app/id1507719251`}
                            target="_blank" title={_("MAIN.P1.DWN")}>
                            <span className="ms-btn-apple my-5 float-md-right text-center" />
                        </a>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
