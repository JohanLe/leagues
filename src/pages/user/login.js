import React, { useCallback, useContext } from "react";
import { Redirect } from "react-router";
import { Auth, AuthContext } from "../../firebase/auth.js";
import Database from "../../firebase/database.js";
import Session from "../../helpers/session";

const auth = new Auth();
const db = new Database();
const ssh = new Session();

export default Login => {
  const handleLogin = useCallback(
    async (event) => {
      event.preventDefault();
      const { email, password } = event.target.elements;
      let eValue = email.value;
      let pValue = password.value;
      console.log(eValue, pValue);
      auth.login({eValue, pValue });
    },
  );

  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Redirect to='/' />;
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email
          <input name='email' type='email' placeholder='Email' />
        </label>
        <label>
          Password
          <input name='password' type='password' placeholder='Password' />
        </label>
        <button type='submit'>Log in</button>
      </form>
    </div>
  );
};
