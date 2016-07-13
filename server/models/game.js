/* eslint-disable max-len, func-names */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
  const pieceIndex = this.pieces.findIndex((val) => val.x === moveInfo.startx && val.y === moveInfo.starty);
  if (pieceIndex < 0) {
    return new Error('Piece not found at specified location');
  }
  const destinationIndex = this.pieces.findIndex((val) => val.x === moveInfo.tox && val.y === moveInfo.toy);
  if (destinationIndex > -1) {
    return new Error('Invalid move - some piece already exist');
  }

  this.turn = this.turn === 'p1' ? 'p2' : 'p1';

  this.pieces[pieceIndex].x = moveInfo.tox;
  this.pieces[pieceIndex].y = moveInfo.toy;
  return null;
};

module.exports = mongoose.model('Game', schema);
