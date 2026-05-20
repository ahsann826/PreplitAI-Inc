import { Helmet } from "react-helmet-async";

export function Analytics() {
  const GA_ID = (import.meta as any).env?.VITE_GA_ID as string | undefined;
  const GSC = (import.meta as any).env?.VITE_GSC_VERIFICATION as string | undefined;
  const HJ_ID = (import.meta as any).env?.VITE_HOTJAR_ID as string | undefined;
  const HJ_SV = (import.meta as any).env?.VITE_HOTJAR_SV as string | undefined;

  const scripts: any[] = [];

  if (GA_ID) {
    scripts.push(
      <script async key="ga-src" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
    );
    scripts.push(
      <script key="ga-init">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);} 
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </script>
    );
  }

  if (HJ_ID && HJ_SV) {
    scripts.push(
      <script key="hotjar">
        {`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${Number(HJ_ID)},hjsv:${Number(HJ_SV)}};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
      </script>
    );
  }

  return (
    <Helmet>
      {GSC && <meta name="google-site-verification" content={GSC} />}
      {scripts}
    </Helmet>
  );
}