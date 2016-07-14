/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names, max-len */

const expect = require('chai').expect;
const Game = require('../../dst/models/game');

describe('Game', () => {
  describe('constructor', () => {
    it('should create a new game object', (done) => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.validate(err => {
        expect(err).to.be.undefined;
        expect(testGame.player1).to.be.ok;
        expect(testGame.player2).to.be.ok;
        expect(testGame.pieces).to.be.ok;
        expect(testGame.turn).to.equal('p1');
        done();
      });
    });
  });
  describe('#setupBoard', () => {
    it('should build the pieces array of the board', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.setupBoard();
      expect(testGame.pieces).to.have.length(24);
      expect(testGame.pieces[0].x).to.equal(0);
      expect(testGame.pieces[0].y).to.equal(0);
      expect(testGame.pieces[0].owner).to.be.ok;
      expect(testGame.pieces[0].king).to.be.false;
    });
  });
  describe('#move', () => {
    it('should move the piece to the specified coordinate', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.setupBoard();
      const err = testGame.move({ startx: 0, starty: 2, tox: 1, toy: 3 });
      expect(err).to.be.undefined;
      expect(testGame.pieces[8].x).to.equal(1);
      expect(testGame.pieces[8].y).to.equal(3);
      expect(testGame.turn).to.equal('p2');
    });
    it('should NOT move the piece to the specified coordinate - piece does not exist', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.setupBoard();
      const savedArray = testGame.pieces;
      const err = testGame.move({ startx: 1, starty: 2, tox: 1, toy: 4 });
      expect(err).to.be.ok;
      expect(testGame.pieces).to.deep.equal(savedArray);
      expect(testGame.turn).to.equal('p1');
    });
    it('should NOT move the piece to the specified coordinate - some other piece already exist', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.setupBoard();
      const savedArray = testGame.pieces;
      const err = testGame.move({ startx: 0, starty: 0, tox: 1, toy: 1 });
      expect(err).to.be.ok;
      expect(err.message).to.equal('Invalid move - some piece already exist');
      expect(testGame.pieces).to.deep.equal(savedArray);
      expect(testGame.turn).to.equal('p1');
    });
    it('should NOT move the piece to the specified coordinate - backwards[in angle] p1', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 2, y: 3, king: false, owner: 'p1' });
      const savedArray = testGame.pieces;
      const err = testGame.move({ startx: 2, starty: 3, tox: 1, toy: 2 });
      expect(err).to.be.ok;
      expect(err.message).to.equal('Invalid move - cannot move backwards');
      expect(testGame.pieces).to.deep.equal(savedArray);
      expect(testGame.turn).to.equal('p1');
    });
    it('should NOT move the piece to the specified coordinate - backwards[in angle] p2', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 2, y: 3, king: false, owner: 'p2' });
      testGame.turn = 'p2';
      const savedArray = testGame.pieces;
      const err = testGame.move({ startx: 2, starty: 3, tox: 1, toy: 4 });
      expect(err).to.be.ok;
      expect(err.message).to.equal('Invalid move - cannot move backwards');
      expect(testGame.pieces).to.deep.equal(savedArray);
      expect(testGame.turn).to.equal('p2');
    });
    it('should NOT move the piece to the specified coordinate - can only move at angles', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 2, y: 3, king: false, owner: 'p1' });
      const savedArray = testGame.pieces;
      const err = testGame.move({ startx: 2, starty: 3, tox: 2, toy: 4 });
      expect(err).to.be.ok;
      expect(err.message).to.equal('Invalid move - cannot move in any direction other than angels');
      expect(testGame.pieces).to.deep.equal(savedArray);
      expect(testGame.turn).to.equal('p1');
    });
    it('should NOT move the piece to the specified coordinate - can only move one position at a time', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 2, y: 3, king: false, owner: 'p1' });
      const savedArray = testGame.pieces;
      const err = testGame.move({ startx: 2, starty: 3, tox: 5, toy: 6 });
      expect(err).to.be.ok;
      expect(err.message).to.equal('Invalid move - cannot move more than one space');
      expect(testGame.pieces).to.deep.equal(savedArray);
      expect(testGame.turn).to.equal('p1');
    });
    it('should NOT move the piece to the specified coordinate - player can only move own pieces', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 2, y: 3, king: false, owner: 'p2' });
      const savedArray = testGame.pieces;
      const err = testGame.move({ startx: 2, starty: 3, tox: 3, toy: 4 });
      expect(err).to.be.ok;
      expect(err.message).to.equal('Invalid move - player can only move own piece');
      expect(testGame.pieces).to.deep.equal(savedArray);
      expect(testGame.turn).to.equal('p1');
    });
    it('should jump the piece to the specified coordinate - p1 jump upper right', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 3, y: 3, king: false, owner: 'p1' });
      testGame.pieces.push({ x: 4, y: 4, king: false, owner: 'p2' });
      const err = testGame.move({ startx: 3, starty: 3, tox: 5, toy: 5 });
      expect(err).to.be.undefined;
      expect(testGame.pieces).to.have.length(1);
      expect(testGame.pieces[0].x).to.equal(5);
      expect(testGame.pieces[0].y).to.equal(5);
    });
    it('should jump the piece to the specified coordinate - p1 jump upper left', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 3, y: 3, king: false, owner: 'p1' });
      testGame.pieces.push({ x: 2, y: 4, king: false, owner: 'p2' });
      const err = testGame.move({ startx: 3, starty: 3, tox: 1, toy: 5 });
      expect(err).to.be.undefined;
      expect(testGame.pieces).to.have.length(1);
      expect(testGame.pieces[0].x).to.equal(1);
      expect(testGame.pieces[0].y).to.equal(5);
    });
    it('should jump the piece to the specified coordinate - p2 jump lower left', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 3, y: 3, king: false, owner: 'p2' });
      testGame.pieces.push({ x: 2, y: 2, king: false, owner: 'p1' });
      testGame.turn = 'p2';
      const err = testGame.move({ startx: 3, starty: 3, tox: 1, toy: 1 });
      expect(err).to.be.undefined;
      expect(testGame.pieces).to.have.length(1);
      expect(testGame.pieces[0].x).to.equal(1);
      expect(testGame.pieces[0].y).to.equal(1);
    });
    it('should jump the piece to the specified coordinate - p2 jump lower right', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 3, y: 3, king: false, owner: 'p2' });
      testGame.pieces.push({ x: 4, y: 2, king: false, owner: 'p1' });
      testGame.turn = 'p2';
      const err = testGame.move({ startx: 3, starty: 3, tox: 5, toy: 1 });
      expect(err).to.be.undefined;
      expect(testGame.pieces).to.have.length(1);
      expect(testGame.pieces[0].x).to.equal(5);
      expect(testGame.pieces[0].y).to.equal(1);
    });
    it('should NOT jump the piece to the specified coordinate - owned piece', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 0, y: 0, king: false, owner: 'p1' });
      testGame.pieces.push({ x: 1, y: 1, king: false, owner: 'p1' });
      const err = testGame.move({ startx: 0, starty: 0, tox: 2, toy: 2 });
      expect(err.message).to.equal('Invalid jump - cannot jump own piece');
      expect(testGame.pieces).to.have.length(2);
      expect(testGame.pieces[0].x).to.equal(0);
      expect(testGame.pieces[0].y).to.equal(0);
    });
    it('should NOT jump the piece to the specified coordinate - no target', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 0, y: 0, king: false, owner: 'p1' });
      testGame.pieces.push({ x: 5, y: 5, king: false, owner: 'p1' });
      const err = testGame.move({ startx: 0, starty: 0, tox: 2, toy: 2 });
      expect(err.message).to.equal('Invalid jump - no target piece present');
      expect(testGame.pieces).to.have.length(2);
      expect(testGame.pieces[0].x).to.equal(0);
      expect(testGame.pieces[0].y).to.equal(0);
    });
    it('should become a king - p1', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 1, y: 6, king: false, owner: 'p1' });
      testGame.pieces.push({ x: 5, y: 5, king: false, owner: 'p2' });
      const err = testGame.move({ startx: 1, starty: 6, tox: 0, toy: 7 });
      expect(err).to.be.undefined;
      expect(testGame.pieces[0].x).to.equal(0);
      expect(testGame.pieces[0].y).to.equal(7);
      expect(testGame.pieces[0].king).to.be.true;
    });
    it('should NOT become a king - p1', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 0, y: 0, king: false, owner: 'p1' });
      testGame.pieces.push({ x: 5, y: 5, king: false, owner: 'p2' });
      const err = testGame.move({ startx: 0, starty: 0, tox: 1, toy: 1 });
      expect(err).to.be.undefined;
      expect(testGame.pieces[0].x).to.equal(1);
      expect(testGame.pieces[0].y).to.equal(1);
      expect(testGame.pieces[0].king).to.be.false;
    });
    it('should become a king - p2', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 1, y: 6, king: false, owner: 'p1' });
      testGame.pieces.push({ x: 1, y: 1, king: false, owner: 'p2' });
      testGame.turn = 'p2';
      const err = testGame.move({ startx: 1, starty: 1, tox: 0, toy: 0 });
      expect(err).to.be.undefined;
      expect(testGame.pieces[1].x).to.equal(0);
      expect(testGame.pieces[1].y).to.equal(0);
      expect(testGame.pieces[1].king).to.be.true;
    });
    it('should NOT become a king - p2', () => {
      const testGame = new Game({ player1: '111111111111111111111111', player2: '111111111111111111111112' });
      testGame.pieces.push({ x: 0, y: 0, king: false, owner: 'p1' });
      testGame.pieces.push({ x: 5, y: 5, king: false, owner: 'p2' });
      testGame.turn = 'p2';
      const err = testGame.move({ startx: 5, starty: 5, tox: 6, toy: 4 });
      expect(err).to.be.undefined;
      expect(testGame.pieces[1].x).to.equal(6);
      expect(testGame.pieces[1].y).to.equal(4);
      expect(testGame.pieces[1].king).to.be.false;
    });
  });
});
