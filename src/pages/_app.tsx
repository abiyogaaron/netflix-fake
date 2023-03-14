import { checkisLoggedIn } from '@/services/auth';
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

import Loading from '@/components/loading';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const redirect = async () => {
      setIsLoading(true);
      const isLoggedIn = await checkisLoggedIn();
      setIsLoading(false);
      if (isLoggedIn) {
        router.push('/');
        return;
      }
      router.push('/login');
    }
    redirect();
  }, []);

  useEffect(() => {
    router.events.on('routeChangeComplete', () => setIsLoading(false));
    router.events.on('routeChangeError', () => setIsLoading(false));

    return () => {
      router.events.off('routeChangeComplete', () => setIsLoading(false));
      router.events.off('routeChangeError', () => setIsLoading(false));
    }
  }, []);

  return isLoading ? <Loading /> : <Component {...pageProps} />
}
