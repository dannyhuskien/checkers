/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');

describe('games', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });

  describe('post /games', () => {
    it('should create a new game with two players', (done) => {
      request(app)
        .post('/games')
        .send({ player1: '111111111111111111111111', player2: '111111111111111111111112' })
        .end((err, rsp) => {
          expect(rsp.body.game.__v).to.not.be.null;
          expect(rsp.body.game._id).to.not.be.null;
          expect(rsp.body.game.player1).to.equal('111111111111111111111111');
          expect(rsp.body.game.player2).to.equal('111111111111111111111112');
          expect(rsp.body.game.turn).to.equal('p1');
          expect(rsp.body.game.pieces).to.have.length(24);
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          done();
        });
    });
  });
  describe('put /games/:id/move', () => {
    it('should move a piece from 0,2 to 1,3', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba4c4b7/move')
        .send({ startx: 0, starty: 2, tox: 1, toy: 3 })
        .end((err, rsp) => {
          expect(rsp.body.game.turn).to.equal('p2');
          expect(rsp.body.game.pieces[8].x).to.equal(1);
          expect(rsp.body.game.pieces[8].y).to.equal(3);
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          done();
        });
    });
    it('should NOT move a piece off of the board (x)', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba4c4b7/move')
        .send({ startx: 0, starty: 2, tox: -1, toy: 4 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - out of board range');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
    it('should NOT move a piece off of the board (y)', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba4c4b7/move')
        .send({ startx: 0, starty: 2, tox: 0, toy: 9 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - out of board range');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
    it('should NOT move a piece onto another piece', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba4c4b7/move')
        .send({ startx: 0, starty: 0, tox: 2, toy: 2 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - some piece already exist');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
  });
});
