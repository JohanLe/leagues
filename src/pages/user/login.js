import React, { useCallback, useContext } from "react";
import { Redirect } from "react-router";
import { Auth, AuthContext } from "../../firebase/auth.js";
import Database from "../../firebase/database.js";
import Session from "../../helpers/session";

const auth = new Auth();
const db = new Database();
const ssh = new Session();

export default (Login) => {

  /**
   * Get user data from db and set to session.
   * @param {} userId 
   */
  const getUserData = async (userId) => {
    let userData = await db.getUser(userId);
    ssh.set("user", userData);
  };

  const handleLogin = useCallback(async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    let eValue = email.value;
    let pValue = password.value;

    auth.login({ eValue, pValue });
  });

  /**
   * Check if signed in work - if so get userdata and redirect to user home page.
   */
  try {
    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
      getUserData(currentUser.uid);

      return <Redirect to='/user' />;
    }
  } catch (e) {
    console.log("Login error: ", e);
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
