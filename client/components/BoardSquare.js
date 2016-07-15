/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable jsx-quotes */
import React from 'react';

class BoardSquare extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    if (this.props.owner) {
      if (this.props.owner === 'p1') {
        this.state.image = (props.ypos % 2 === props.xpos % 2) ? './images/black_on_grey.jpg' : './images/black_on_white.jpg';
      } else {
        this.state.image = (props.ypos % 2 === props.xpos % 2) ? './images/red_on_grey.jpg' : './images/red_on_white.jpg';
      }
    } else {
      this.state.image = (props.ypos % 2 === props.xpos % 2) ? './images/grey.jpg' : './images/white.jpg';
    }

    this.squareClicked = this.squareClicked.bind(this);
  }

  squareClicked() {
    this.props.pieceClick(this.props.xpos, this.props.ypos);
  }

  render() {
    return (
      <img src={this.state.image} role="presentation" onClick={this.squareClicked} />
    );
  }

}

export default BoardSquare;
