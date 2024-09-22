import "@/styles/globals.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
export const BaseUrl="http://localhost:8000";


export default function App({ Component, pageProps }) {
  return<>
   <Component {...pageProps} />
   <ToastContainer />
  </>;
}
