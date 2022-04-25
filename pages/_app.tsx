import type { AppProps } from "next/app";
// import { AuthProvider } from "../contexts/auth";
import initAuth from "../utils/initAuth";

initAuth();

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default App;
