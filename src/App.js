import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { AuthProvider } from "./firebase/auth";
import { Auth } from "./firebase/auth";
import Firebase from "firebase/app";
import "firebase/auth";

import ProtectedRoute from "./components/routes/protected";
import Navbar from "./components/navbar/navbar";
import NavItem from "./components/navbar/item";
import Dropdown from "./components/navbar/dropdown";
import DropdownItem from "./components/navbar/dropdownItem";
import Footer from "./components/footer";
import Home from "./pages/home";
import RegisterUser from "./pages/user/register";
import Login from "./pages/user/login";
import UserHome from "./pages/user/home";
import UserSettings from "./pages/user/settings";
import LeagueCreate from "./pages/league/create";
import ManageLeague from "./pages/league/manage";
import LeagueHome from "./pages/league/home";
import RoundCreate from "./pages/league/round/create";

//TODO Flytta Navbar children till navbar component istället

//FIXME Ta bort hårdkodat liga namn & gör dynamsisk beronde på inloggad user osv...

const auth = new Auth();
let App = () => {
  return (
    <div className='App base-grid'>
      <AuthProvider>
        <Navbar className='navbar'>
          <NavItem title='Home' href='/'></NavItem>

          <NavItem
            title='League'
            protected={true}
            href='/league/ChippTrePutt-123abc987'
          >
            <Dropdown>
              <DropdownItem
                protected={true}
                href='/league/ChippTrePutt-123abc987/manage'
              >
                Manage
              </DropdownItem>
              <DropdownItem
                protected={true}
                href='/league/ChippTrePutt-123abc987/settings'
              >
                Settings
              </DropdownItem>
              <DropdownItem
                protected={true}
                href='/league/ChippTrePutt-123abc987/round/create'
              >
                Register round
              </DropdownItem>
            </Dropdown>
          </NavItem>
          <NavItem title='User' href='/user'>
            <Dropdown>
              <DropdownItem href='/auth/signin'>Sign in</DropdownItem>
              <DropdownItem href='/auth/register'>Register</DropdownItem>
              <DropdownItem href='/user/settings' protected={true}>
                Settings
              </DropdownItem>
              <DropdownItem href='#' onClick={auth.signOut}>
                SignOut
              </DropdownItem>
            </Dropdown>
          </NavItem>
        </Navbar>

        <Router>
          <div className='main-content'>
            <Route exact path='/' component={Home} />
            <Route path='/auth/register' component={RegisterUser} />
            <Route path='/auth/signin' component={Login} />
            <ProtectedRoute exact path='/user' component={UserHome} />
            <ProtectedRoute path='/user/settings' component={UserSettings} />
            <ProtectedRoute path='/league/create' component={LeagueCreate} />
            <ProtectedRoute
              exact
              path='/league/:leaguePath'
              component={LeagueHome}
            />
            <ProtectedRoute
              exact
              path='/league/:leaguePath/manage'
              component={ManageLeague}
            />
            <ProtectedRoute
              exact
              path='/league/:leaguePath/round/create'
              component={RoundCreate}
            />
          </div>
        </Router>

        <Footer className='footer' />
      </AuthProvider>
    </div>
  );
};
export default App;
