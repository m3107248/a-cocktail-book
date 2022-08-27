import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";
import { LoginContext } from "./_app";

const SUPABASE_URL = "https://iznfbqrevlorsxyoaueo.supabase.co";
const supabase = createClient(
  SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASEANON
);

export default function Login() {
  const [username, setUsername] = useState(null);
  const [passwd, setPasswd] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const router = useRouter();
  const { loginState, setLoginState } = useContext(LoginContext);

  function handleUsernameInput(e) {
    setUsername(e.target.value);
  }
  function handlePasswdInput(e) {
    setPasswd(e.target.value);
  }
  async function supaSignIn(e) {
    e.preventDefault();
    const { user, session, error } = await supabase.auth.signIn({
      email: `${username}`,
      password: `${passwd}`,
    });
    if (session) {
      setLoginState("authenticating");
      setUserInfo(user);
    }
    if (error) {
      console.log(error);
    }
  }
  async function supaSignUp(e) {
    e.preventDefault();
    const { user, session, error } = await supabase.auth.signUp({
      email: `${username}`,
      password: `${passwd}`,
    });
    supaSignIn(e);
  }

  if (loginState === "authenticating" && userInfo !== null) {
    if (userInfo.aud === "authenticated") {
      router.push("/");
    }
  }

  return (
    <div className="login-container">
      <div className="login-inner-container">
        <h1 className="dark">A COCKTAIL BOOK</h1>
        <h3 className="m-25 dark">
          A cocktail book for you anytime and anywhere.
        </h3>
        <div className="general-container align-center login-section">
          <label htmlFor="username" className="col-50 col-s-100 p-25">
            <input
              className="dark"
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleUsernameInput}
            />
          </label>
          <label htmlFor="password" className="col-50 col-s-100 p-25 pt-s-0">
            <input
              className="dark"
              type="password"
              name="password"
              placeholder="Password"
              onChange={handlePasswdInput}
            />
          </label>
          <div className="general-container align-center no-flex m-10">
            <button
              id="supbase-signin"
              className="btn dark"
              onClick={supaSignIn}
            >
              Login
            </button>
            <p className="dark">
              Don’t have an account? Enter your details above and&nbsp;
              <a id="supbase-signup" onClick={supaSignUp}>
                Sign Up Now
              </a>
            </p>
          </div>
        </div>
      </div>
      <div className="container-bg">
        <div></div>
      </div>
    </div>
  );
}
