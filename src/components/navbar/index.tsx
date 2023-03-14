import { NextPage } from "next";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ROUTE_PATH } from "@/constants";
import { getUserData } from "@/services/auth";
import { logout } from "@/services/client";

import styles from './navbar.module.css';

const NavBar: NextPage = () => {
  const router = useRouter();
  const [isShowDropDown, setIsShowDropdown] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    async function setNavbarUsername() {
      const data = await getUserData();
      if (data) {
        setUsername(data.email || '');
      }
    }
    setNavbarUsername();
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    await logout();
  }

  const handleClickMenu = (e: React.MouseEvent<HTMLLIElement>, path: string) => {
    e.preventDefault();
    router.push(path);
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={(e) => handleClickMenu(e, ROUTE_PATH.HOME)}>
            Home
          </li>
          <li className={styles.navItem2} onClick={(e) => handleClickMenu(e, ROUTE_PATH.MY_LIST)}>
            My List
          </li>
        </ul>

        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={() => setIsShowDropdown(!isShowDropDown)}>
              <p className={styles.username}>{username}</p>
              <Image
                src="/static/expand_more.svg"
                alt="Expand more"
                width="24"
                height="24"
              />
            </button>

            {isShowDropDown && (
              <div className={styles.navDropdown}>
                <div>
                  <Link href="/login" className={styles.linkName} onClick={handleLogout}>
                    Sign out
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;