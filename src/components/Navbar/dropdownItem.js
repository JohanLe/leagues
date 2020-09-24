import React, { Component } from 'react'

export default class Item extends Component {
    constructor(props){
        super(props);
        this.state = {
        }
    }

    render() {
        return (
          <a href={this.props.href} className="menu-item">
              {this.props.children}
          </a>
        )
    }
}
