import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export const BaseUrl="http://localhost:8000";


export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
