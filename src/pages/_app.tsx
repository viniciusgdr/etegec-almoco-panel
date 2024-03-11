import "@viniciusgdr/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from "next/app";
import { ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { DashboardLayout } from '@viniciusgdr/components/layouts/Dashboard';
import { Navbar } from '@viniciusgdr/components/Navbar';
import { ThemeProvider, createTheme } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});


export default function App({ Component, pageProps, router: routerAppProps }: AppProps) {
  const router = useRouter()
  const startPanelRoute = '/dashboard'

  return <SessionProvider session={pageProps.session}>
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
