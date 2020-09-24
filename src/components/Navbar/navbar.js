import React from "react";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <nav className='navbar'>
        <ul className='navbar-nav'>
          {this.props.children}
        </ul>
      </nav>
    );
  }
}

export default Navbar;
