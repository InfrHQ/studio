import Script from 'next/script';

function Telemetry() {
    return (
        <>
            <Script id="google-tag-manager" strategy="afterInteractive">
                {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','G-DXQLNR5DRX');
        `}
            </Script>
            <Script
                src="https://js.sentry-cdn.com/71c0bcf7089464c438799d0103faf465.min.js"
                crossorigin="anonymous"
            ></Script>
        </>
    );
}

export default Telemetry;
