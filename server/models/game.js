/* eslint-disable max-len, func-names, consistent-return */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Player from '../models/player';

const schema = new Schema({
  player1: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  player2: { type: mongoose.Schema.ObjectId, ref: 'Player' },
  pieces: { type: Array },
  turn: { type: String, default: 'p1' },
});

schema.methods.setupBoard = function () {
  this.pieces.push({ x: 0, y: 0, king: false, owner: 'p1' });
  this.pieces.push({ x: 2, y: 0, king: false, owner: 'p1' });
  this.pieces.push({ x: 4, y: 0, king: false, owner: 'p1' });
  this.pieces.push({ x: 6, y: 0, king: false, owner: 'p1' });

  this.pieces.push({ x: 1, y: 1, king: false, owner: 'p1' });
  this.pieces.push({ x: 3, y: 1, king: false, owner: 'p1' });
  this.pieces.push({ x: 5, y: 1, king: false, owner: 'p1' });
  this.pieces.push({ x: 7, y: 1, king: false, owner: 'p1' });

  this.pieces.push({ x: 0, y: 2, king: false, owner: 'p1' });
  this.pieces.push({ x: 2, y: 2, king: false, owner: 'p1' });
  this.pieces.push({ x: 4, y: 2, king: false, owner: 'p1' });
  this.pieces.push({ x: 6, y: 2, king: false, owner: 'p1' });

  this.pieces.push({ x: 0, y: 5, king: false, owner: 'p2' });
  this.pieces.push({ x: 2, y: 5, king: false, owner: 'p2' });
  this.pieces.push({ x: 4, y: 5, king: false, owner: 'p2' });
  this.pieces.push({ x: 6, y: 5, king: false, owner: 'p2' });

  this.pieces.push({ x: 1, y: 6, king: false, owner: 'p2' });
  this.pieces.push({ x: 3, y: 6, king: false, owner: 'p2' });
  this.pieces.push({ x: 5, y: 6, king: false, owner: 'p2' });
  this.pieces.push({ x: 7, y: 6, king: false, owner: 'p2' });

  this.pieces.push({ x: 0, y: 7, king: false, owner: 'p2' });
  this.pieces.push({ x: 2, y: 7, king: false, owner: 'p2' });
  this.pieces.push({ x: 4, y: 7, king: false, owner: 'p2' });
  this.pieces.push({ x: 6, y: 7, king: false, owner: 'p2' });
};

schema.methods.move = function (moveInfo) {
  let pieceIndex = this.pieces.findIndex((val) => val.x === moveInfo.startx && val.y === moveInfo.starty);
  if (pieceIndex < 0) {
    return new Error('Piece not found at specified location');
  }

  if (Math.abs(moveInfo.startx - moveInfo.tox) !== Math.abs(moveInfo.starty - moveInfo.toy)) {
    return new Error('Invalid move - cannot move in any direction other than angels');
  }

  if (this.pieces[pieceIndex].owner !== this.turn) {
    return new Error('Invalid move - player can only move own piece');
  }

  if (!this.pieces[pieceIndex].king && this.turn === 'p1' && moveInfo.toy <= moveInfo.starty) {
    return new Error('Invalid move - cannot move backwards');
  }

  if (!this.pieces[pieceIndex].king && this.turn === 'p2' && moveInfo.toy >= moveInfo.starty) {
    return new Error('Invalid move - cannot move backwards');
  }

  const destinationIndex = this.pieces.findIndex((val) => val.x === moveInfo.tox && val.y === moveInfo.toy);
  if (destinationIndex > -1) {
    return new Error('Invalid move - some piece already exist');
  }

  if (Math.abs(moveInfo.startx - moveInfo.tox) === 2) {
    // jump code
    const targetx = ((moveInfo.tox - moveInfo.startx) / 2) + moveInfo.startx;
    const targety = ((moveInfo.toy - moveInfo.starty) / 2) + moveInfo.starty;
    const targetIndex = this.pieces.findIndex((val) => val.x === targetx && val.y === targety);
    if (targetIndex < 0) {
      return new Error('Invalid jump - no target piece present');
    }

    if (this.pieces[targetIndex].owner === this.turn) {
      return new Error('Invalid jump - cannot jump own piece');
    }

    this.pieces.splice(targetIndex, 1);
    pieceIndex = this.pieces.findIndex((val) => val.x === moveInfo.startx && val.y === moveInfo.starty);
  } else if (Math.abs(moveInfo.startx - moveInfo.tox) > 1) {
    return new Error('Invalid move - cannot move more than one space');
  }

  if (this.turn === 'p1' && moveInfo.toy === 7) {
    this.pieces[pieceIndex].king = true;
  }

  if (this.turn === 'p2' && moveInfo.toy === 0) {
    this.pieces[pieceIndex].king = true;
  }

  this.turn = this.turn === 'p1' ? 'p2' : 'p1';

  this.pieces[pieceIndex].x = moveInfo.tox;
  this.pieces[pieceIndex].y = moveInfo.toy;
};

schema.methods.checkWin = function (cb) {
  let winnerId = null;
  let loserId = null;
  const p1piece = this.pieces.find((piece) => piece.owner === 'p1');
  const p2piece = this.pieces.find((piece) => piece.owner === 'p2');

  if (!p2piece) {
    winnerId = this.player1;
    loserId = this.player2;
  } else if (!p1piece) {
    winnerId = this.player2;
    loserId = this.player1;
  }

  if (!winnerId) {
    return cb();
  }

  Player.findByIdAndUpdate(winnerId, { $inc: { wins: 1 } }, { new: true }, (err, winningPlayer) => {
    Player.findByIdAndUpdate(loserId, { $inc: { losses: 1 } }, () => {
      cb(winningPlayer);
    });
  });
};


module.exports = mongoose.model('Game', schema);
