/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
import React from 'react';
import Initiategame from './Initiategame';
import BoardSquare from './BoardSquare';

class Checkersboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.startGame = this.startGame.bind(this);
    this.pieceClicked = this.pieceClicked.bind(this);
  }

  startGame(player1, player2) {
    fetch('http://localhost:3333/games', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        player1,
        player2,
      }),
    })
    .then((response) => response.text())
    .then((startGameResult) => {
      const gameObject = JSON.parse(startGameResult);
      this.setState({ currentGame: gameObject.game });
    });
  }

  pieceClicked(x, y) {
    if (!this.firstClick) {
      this.firstClick = { x, y };
      return;
    }

    // Move
    fetch(`http://localhost:3333/games/${this.state.currentGame._id}/move`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startx: this.firstClick.x,
        starty: this.firstClick.y,
        tox: x,
        toy: y,
      }),
    })
    .then((response) => response.text())
    .then((moveGameResult) => {
      const gameObject = JSON.parse(moveGameResult);

      this.setState({ invalidMove: null });

      if (gameObject.messages) {
        this.setState({ invalidMove: `NO! ${gameObject.messages[0]}` });
      }

      console.log('Piece 8:', gameObject.game);

      if (gameObject.game) {
        console.log('Game Objects Array:', gameObject.game.pieces);
        this.setState({ currentGame: gameObject.game });
      }

      this.firstClick = null;
    });
  }

  render() {
    let dynamicContent = (<h1> Whats going on?! </h1>);
    let squareObjs = [];
    const squareRows = [];

    const errorContent = <div><h2>{this.state.invalidMove}</h2></div>;

    if (!this.state.currentGame) {
      dynamicContent = (
        <div>
          <Initiategame startGame={this.startGame} />
        </div>
      );
    } else {
      console.log('Pieces array is:', this.state.currentGame.pieces);
      for (let y = 7; y >= 0; y--) {
        squareObjs = [];
        for (let x = 0; x < 8; x++) {
          const currentPiece = this.state.currentGame.pieces.find((p) => p.x === x && p.y === y);
          if (currentPiece) {
            console.log('Current Piece:', currentPiece);
          }
          const owner = currentPiece ? currentPiece.owner : null;
          squareObjs.push(<td><BoardSquare xpos={x} ypos={y} owner={owner} pieceClick={this.pieceClicked} /></td>);
        }
        squareRows.push(squareObjs);
      }

      dynamicContent = (
        <div>
          <table className="table">
            <tbody>
            {squareRows.map((sqr) => <tr>{sqr}</tr>)}
            </tbody>
          </table>
        </div>
        );
    }

    return (
      <div> // Top level Div
        <div className="row">
          <div className="col-xs-6">
            <h1>Checkers</h1>
          </div>
        </div>
        <p></p>
        {dynamicContent}
        {errorContent}
      </div>  // End of Top Level Div
    );
  }

} // End of Class
export default Checkersboard;
