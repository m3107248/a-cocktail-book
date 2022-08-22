import { useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://iznfbqrevlorsxyoaueo.supabase.co";
const supabase = createClient(
  SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASEANON
);
export default function Login() {
  const [username, setUsername] = useState(null);
  const [passwd, setPasswd] = useState(null);

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
      console.log(user);
      console.log(session);
    }
    if (error) {
      console.log("error");
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

  return (
    <div className="login-container">
      <div className="login-inner-container">
        <h1>A COCKTAIL BOOK</h1>
        <h3 className="m-25">A cocktail book for you anytime and anywhere.</h3>
        <div className="general-container align-center login-section">
          <label htmlFor="username" className="col-50 p-25">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleUsernameInput}
            />
          </label>
          <label htmlFor="password" className="col-50 p-25">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handlePasswdInput}
            />
          </label>
          <div className="general-container align-center no-flex m-10">
            <button id="supbase-signin" className="btn" onClick={supaSignIn}>
              Login
            </button>
            <p>
              Don’t have an account? Enter your details above and&nbsp;
              <a id="supbase-signup">Sign Up Now</a>
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
