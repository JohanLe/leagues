import React, { Component } from "react";



export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className='dropdown'>
        {this.props.children}
    </div>;
  }
}
