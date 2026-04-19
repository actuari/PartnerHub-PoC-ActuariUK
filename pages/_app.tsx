import "../styles.global.css";
//const NextNProgress = dynamic(() => import('nextjs-progressbar'));
import NextNProgress from "nextjs-progressbar";
import Footer from "../components/common/Footer";
//const Header = dynamic(() => import("../components/Header/Main"));
import Header from "../components/Header/Main";
import { Provider } from "react-redux";
import { store } from "../store";
import ResponseSnackbar from "../components/common/ResponseSnackbar";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import { ChatProvider } from "../contexts/ChatContext";
import { SessionProvider } from "next-auth/react"
import Head from "next/head";
//import dynamic from "next/dynamic";

export default function App({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <SessionProvider session={session}>
            <ChatProvider>
              <Header />
              <NextNProgress />
              <Component {...pageProps} />
              <Footer />
            </ChatProvider>
          </SessionProvider>
        </ThemeProvider>
        <ResponseSnackbar />
      </Provider>
    </>

  );
}
