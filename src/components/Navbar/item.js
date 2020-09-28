import React, { Component } from "react";

export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.changeOpenState = this.changeOpenState.bind(this);
  }

  changeOpenState() {
    this.setState((prevState) => ({
      open: !prevState.open,
    }));
  }

  render() {
    return (
      <li
        className='nav-item'
        onMouseEnter={this.changeOpenState}
        onMouseLeave={this.changeOpenState}
      >
        <a href={this.props.href} onClick={this.props.onClick}>{this.props.title}</a>
        {this.state.open && this.props.children}
      </li>
    );
  }
}
