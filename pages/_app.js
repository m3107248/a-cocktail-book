import "../styles/globals.css";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Router from "next/router";

/* Router.events.on("routeChangeStart", () => {
  console.log("start loading");
});
Router.events.on("routeChangeComplete", () => {
  console.log("end loading");
});
 */
function MyApp({ Component, pageProps }) {
  const [mainNav, setMainNav] = useState("close");
  const router = useRouter();

  /* MENU EVENT */
  function handleMenuClick() {
    setMainNav("open");
  }
  function handleMenuCloseClick() {
    setMainNav("close");
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
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp;
