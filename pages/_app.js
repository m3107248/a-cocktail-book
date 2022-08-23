import "../styles/globals.css";
import { useState, useEffect, createContext, useContext, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iznfbqrevlorsxyoaueo.supabase.co";
const supabase = createClient(
  SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASEANON
);

/* Router.events.on("routeChangeStart", () => {
  console.log("start loading");
});
Router.events.on("routeChangeComplete", () => {
  console.log("end loading");
});
 */

export const LoginContext = createContext({
  loginState: "",
  setLoginState: () => {},
});

function MyApp({ Component, pageProps }) {
  const [mainNav, setMainNav] = useState("close");
  const [loginState, setLoginState] = useState(null);
  const user = supabase.auth.user();
  const [userInfo, setUserInfo] = useState(user);
  const router = useRouter();
  const value = useMemo(() => ({ loginState, setLoginState }), [loginState]);

  function sessionCheck() {
    if (loginState !== "login" && loginState !== "authenticating") {
      if (userInfo === null || userInfo.aud !== "authenticated") {
        setLoginState("login");
        router.push("/login");
      }
    }
  }
  useEffect(sessionCheck, [userInfo]);

  /* MENU EVENT */
  function handleMenuClick() {
    setMainNav("open");
  }
  function handleMenuCloseClick() {
    setMainNav("close");
  }
  async function handleSignOut(e) {
    e.preventDefault;
    setMainNav("close");
    const { error } = await supabase.auth.signOut();
    setLoginState(null);
    router.push("/login");
  }

  /* MENU SETUP */
  let mainNavJSX;
  if (router.asPath !== "/login") {
    mainNavJSX = (
      <nav id="main-nav">
        <div
          id="menu-icon"
          onClick={handleMenuClick}
          className={mainNav === "open" ? "hide" : ""}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          Menu
        </div>
        <div
          id="menu-close-icon"
          onClick={handleMenuCloseClick}
          className={mainNav === "close" ? "hide" : "display"}
        >
          <div className="bar"></div>
          <div className="bar"></div>
          Close
        </div>
        <ul className={mainNav === "close" ? "hide" : "display"}>
          <li>
            <Link href="/">
              <a onClick={handleMenuCloseClick}>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/search">
              <a onClick={handleMenuCloseClick}>Search</a>
            </Link>
          </li>
          <li>
            <Link href="/favourite">
              <a onClick={handleMenuCloseClick}>Favourite</a>
            </Link>
          </li>
          <li>
            <Link href="">
              <a onClick={handleSignOut}>Log Out</a>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  /* RETURN */
  return (
    <div id="main-container">
      <header>{mainNavJSX}</header>
      <div
        id="nav-bg"
        className={mainNav === "open" ? "menu-display" : "menu-hide"}
      ></div>
      <main>
        <LoginContext.Provider value={value}>
          <Component {...pageProps} />
        </LoginContext.Provider>
      </main>
    </div>
  );
}

export default MyApp;
