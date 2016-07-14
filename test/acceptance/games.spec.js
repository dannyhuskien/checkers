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
        .send({ startx: 0, starty: 0, tox: 1, toy: 1 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - some piece already exist');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
    it('should NOT move a piece backwards at an angle (for p1)', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41111/move')
        .send({ startx: 2, starty: 3, tox: 3, toy: 2 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - cannot move backwards');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
    it('should NOT move a piece backwards at an angle (for p2)', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41112/move')
        .send({ startx: 3, starty: 5, tox: 4, toy: 6 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - cannot move backwards');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
    it('should NOT move a piece in any direction other than angles', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41111/move')
        .send({ startx: 2, starty: 3, tox: 2, toy: 4 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - cannot move in any direction other than angels');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
    it('should NOT move a piece more than one space (unless jump)', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41111/move')
        .send({ startx: 2, starty: 3, tox: 5, toy: 6 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - cannot move more than one space');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
    it('should NOT move a piece - player can only move own pieces', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41111/move')
        .send({ startx: 3, starty: 5, tox: 4, toy: 6 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.body.messages).to.be.ok;
          expect(rsp.body.messages[0]).to.contain('Invalid move - player can only move own piece');
          expect(rsp.status).to.equal(400);
          done();
        });
    });
    it('should jump a piece', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41113/move')
        .send({ startx: 3, starty: 3, tox: 5, toy: 5 })
        .end((err, rsp) => {
          expect(rsp.status).to.equal(200);
          expect(err).to.be.null;
          expect(rsp.body.game.turn).to.equal('p2');
          expect(rsp.body.game.pieces[0].x).to.equal(5);
          expect(rsp.body.game.pieces[0].y).to.equal(5);
          expect(rsp.body.game.pieces[0].owner).to.equal('p1');
          expect(rsp.body.game.pieces).to.have.length(1);
          done();
        });
    });
    it('should NOT jump a piece - attempted to jump own piece', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41114/move')
        .send({ startx: 3, starty: 3, tox: 5, toy: 5 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages[0]).to.contain('Invalid jump - cannot jump own piece');
          done();
        });
    });
    it('should NOT jump a piece - attempted to jump blank space', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41114/move')
        .send({ startx: 3, starty: 3, tox: 1, toy: 5 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages[0]).to.contain('Invalid jump - no target piece present');
          done();
        });
    });
    it('Player 1 should become king', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41115/move')
        .send({ startx: 1, starty: 6, tox: 0, toy: 7 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.pieces[0].x).to.equal(0);
          expect(rsp.body.game.pieces[0].y).to.equal(7);
          expect(rsp.body.game.pieces[0].king).to.be.true;
          expect(rsp.body.game.pieces[0].owner).to.equal('p1');
          done();
        });
    });
    it('Player 1 should NOT become king', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41115/move')
        .send({ startx: 3, starty: 5, tox: 4, toy: 6 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.pieces[1].x).to.equal(4);
          expect(rsp.body.game.pieces[1].y).to.equal(6);
          expect(rsp.body.game.pieces[1].king).to.be.false;
          done();
        });
    });
    it('Player 2 should NOT become king', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41116/move')
        .send({ startx: 3, starty: 2, tox: 2, toy: 1 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.pieces[3].x).to.equal(2);
          expect(rsp.body.game.pieces[3].y).to.equal(1);
          expect(rsp.body.game.pieces[3].king).to.be.false;
          done();
        });
    });
    it('Player 2 should become king', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41116/move')
        .send({ startx: 1, starty: 1, tox: 0, toy: 0 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.pieces[2].x).to.equal(0);
          expect(rsp.body.game.pieces[2].y).to.equal(0);
          expect(rsp.body.game.pieces[2].king).to.be.true;
          expect(rsp.body.game.pieces[2].owner).to.equal('p2');
          done();
        });
    });
    it('Player 1 king should move backwards', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41117/move')
        .send({ startx: 1, starty: 6, tox: 0, toy: 5 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.pieces[0].x).to.equal(0);
          expect(rsp.body.game.pieces[0].y).to.equal(5);
          expect(rsp.body.game.pieces[0].king).to.be.true;
          expect(rsp.body.game.pieces[0].owner).to.equal('p1');
          done();
        });
    });
    it('Player 2 king should move backwards', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41118/move')
        .send({ startx: 1, starty: 1, tox: 0, toy: 2 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.game.pieces[2].x).to.equal(0);
          expect(rsp.body.game.pieces[2].y).to.equal(2);
          expect(rsp.body.game.pieces[2].king).to.be.true;
          expect(rsp.body.game.pieces[2].owner).to.equal('p2');
          done();
        });
    });
    it('Player 1 should win the game', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41119/move')
        .send({ startx: 4, starty: 3, tox: 2, toy: 5 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.winner.name).to.equal('tiny');
          expect(rsp.body.winner.wins).to.equal(1);
          done();
        });
    });
    it('Player 2 should win the game', (done) => {
      request(app)
        .put('/games/5786a64b1534ee866ba41120/move')
        .send({ startx: 3, starty: 4, tox: 5, toy: 2 })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.winner.name).to.equal('biggy');
          expect(rsp.body.winner.wins).to.equal(1);
          done();
        });
    });
  });
});
