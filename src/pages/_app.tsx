import "@viniciusgdr/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from "next/app";
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@viniciusgdr/components/layouts/Dashboard';
import { Navbar } from '@viniciusgdr/components/Navbar';
import { ThemeProvider, createTheme } from '@mui/material';
import Head from 'next/head';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


export default function App({ Component, pageProps, router: routerAppProps }: AppProps) {
  const router = useRouter()
  const startPanelRoute = '/dashboard'

  return <SessionProvider session={pageProps.session}>
    <Head>
      <title>Almoço ETEGEC</title>
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="etegec-almoco" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.json" />
      <meta name="description" content="Horários de descida programados da ETEGEC" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" href={'/etegec-almoco.png'} />
      <meta property="og:image" content={'/etegec-almoco.png'} />
      <meta property="og:title" content="Almoço ETEGEC" />
      <meta property="og:description" content="Horários de descida programados da ETEGEC" />
      <meta property="og:url" content="https://etegec-almoco.viniciusgdr.com" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Almoço ETEGEC" />
    </Head>
    <ThemeProvider theme={darkTheme}>
      {
        router.asPath.startsWith(startPanelRoute) ? (
          <DashboardLayout Component={Component} pageProps={pageProps} router={routerAppProps} />
        ) : (
          <div className='bg-site bg-cover bg-no-repeat h-full w-full transition duration-[5000ms] min-h-screen font-sora'>
            <Navbar />
            <Component {...pageProps} />
          </div>
        )
      }
      <ToastContainer />
    </ThemeProvider>
  </SessionProvider>;
}
