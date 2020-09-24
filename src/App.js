import React from "react";
import firebase from "firebase/app";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Navbar from "./components/Navbar/navbar";
import NavItem from "./components/Navbar/item";
import Dropdown from "./components/Navbar/dropdown";
import DropdownItem from "./components/Navbar/dropdownItem";
import Footer from "./components/footer";
import Home from "./pages/home";
import RegisterUser from "./pages/user/register";
import Login from "./pages/user/login";
import UserSettings from "./pages/user/settings";
import CreateLeague from "./pages/league/create";
import ManageLeague from "./pages/league/manage";
import HomeLeague from "./pages/league/home";
import CreateRound from "./pages/league/round/create";


//TODO Fixa ett mer generellt/elegant sätt att ha koll på om man är inloggad
//TODO Flytta Navbar children till navbar component istället

//FIXME Ta bort hårdkodat liga namn & gör dynamsisk beronde på inloggad user osv...
//FIXME  Se till att fixa säkerhet om man är inloggad osv för att kunna komma åt vissa routes..

let App = () => {
  return (
    <div className='App base-grid'>
      
      <Navbar className='navbar'>
        <NavItem title='Home' href="/">
        </NavItem>
        <NavItem title='User' href="#">
          <Dropdown>
            <DropdownItem href='/auth/signin'>Sign in</DropdownItem>
            <DropdownItem href='/auth/register'>Register</DropdownItem>
            <DropdownItem href='/auth/signout'>SignOut</DropdownItem>
            <DropdownItem href='/auth/user/settings'>Settings</DropdownItem>
          </Dropdown>
        </NavItem>
        <NavItem title='League' href='/league/ChippTrePutt-123abc987'>
          <Dropdown>
            <DropdownItem href='/league/ChippTrePutt-123abc987/manage'>Manage</DropdownItem>
            <DropdownItem href='/league/ChippTrePutt-123abc987/settings'>Settings</DropdownItem>
            <DropdownItem href='/league/ChippTrePutt-123abc987/round/create'>Register round</DropdownItem>
          </Dropdown>
        </NavItem>
      </Navbar>

      <Router>
        <div className='main-content'>
          <Route exact path='/' component={Home}></Route>
          <Route path='/auth/register' component={RegisterUser}></Route>
          <Route path='/auth/signin' component={Login}></Route>
          <Route path='/auth/user/settings' component={UserSettings}></Route>
          <Route path='/league/create' component={CreateLeague}></Route>
          <Route exact path='/league/:leaguePath' component={HomeLeague}></Route>
          <Route
            exact path='/league/:leaguePath/manage'
            component={ManageLeague}
          ></Route>
          <Route
            exact path='/league/:leaguePath/round/create'
            component={CreateRound}
          ></Route>
        </div>
      </Router>

      <Footer className='footer' />
    </div>
  );
};
export default App;
