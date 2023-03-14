import { signinByEmail, signinServer } from "@/services/auth";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import styles from "@/styles/pages/login.module.css";

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string>('');

  useEffect(() => {
    router.events.on('routeChangeComplete', () => setIsLoading(false));
    router.events.on('routeChangeError', () => setIsLoading(false));

    return () => {
      router.events.off('routeChangeComplete', () => setIsLoading(false));
      router.events.off('routeChangeError', () => setIsLoading(false));
    }
  }, []);

  const clickSignin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email) {
      setAlert('Email Address field is required !');
      return;
    }

    setIsLoading(true);
    const token = await signinByEmail(email);
    if (!token) {
      setAlert('There is something wrong in logging in...');
      setIsLoading(false);
      return;
    }

    const isLoggedIn = await signinServer(token);
    if (!isLoggedIn) {
      setAlert('There is something wrong in our auth system, please try again');
      setIsLoading(false);
      return;
    }

    router.push("/");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlert('');
    setEmail(e.target.value);
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix signin</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width="128"
                height="34"
              />
            </div>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type="text"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleChange}
          />

          <p className={styles.userMsg}>{alert}</p>
          <button onClick={clickSignin} className={styles.loginBtn}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </div>
      </main>
    </div>
  )
}

export default Login;