import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script"; // ✅ Use Next.js optimized script

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* ✅ Correct way to load external scripts */}
          <Script 
            src="https://cdn.gomaps.pro/js/gomaps.js" 
            strategy="beforeInteractive" 
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
