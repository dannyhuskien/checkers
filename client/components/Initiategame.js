/* eslint-disable no-underscore-dangle */
/* eslint-disable react/prop-types */
/* eslint-disable max-len */
/* eslint-disable jsx-quotes */
import React from 'react';

class Initiategame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateAll = this.updateAll.bind(this);
    this.kickOffGame = this.kickOffGame.bind(this);
  }

  componentDidMount() {
    this.updateAll();
  }

  kickOffGame() {
    const p1 = this.refs.player1.value;
    const p2 = this.refs.player2.value;
    this.props.startGame(p1, p2);
  }

  updateAll() {
    fetch('http://localhost:3333/players')
    .then((response) => response.text())
    .then((rawPlayers) => {
      const players = JSON.parse(rawPlayers);
      this.setState({ players: players.players });
    });
  }

  render() {
    const players = this.state.players;

    if (!this.state.players) {
      return (<h1>No Data Available</h1>);
    }

    const player1 = (
      <select ref='player1'>
        {players.map((p) => <option value={p._id} key={p._id} >{p.name}</option>)}
      </select>
    );

    const startButton = (
      <button onClick={this.kickOffGame} key='initiatefightbutton' type="button" className="btn btn-info">COME AT ME BRO</button>
    );

    const player2 = (
      <select ref='player2'>
        {players.map((p) => <option value={p._id} key={p._id} >{p.name}</option>)}
      </select>
    );

    return (
      <div className="row">
        <div className="col-xs-6">
          <h3>Player1 :</h3>
          {player1}
        </div>
        <div className="col-xs-6">
          <h3> Player2 :</h3>
          {player2}
        </div>
        <div className="row">
          <div className="col-xs-3">
          </div>
          <div className="col-xs-5">
            <p></p>
            <p>{startButton}</p>
          </div>
          <div className="col-xs-4">
          </div>
        </div>
      </div>
    );
  }

} // End of Class
export default Initiategame;
