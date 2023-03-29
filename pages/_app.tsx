import "../styles/globals.css";
import "../styles/style.css";
import "../styles/typicons.css";

import "../styles/vendor.bundle.base.css";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
