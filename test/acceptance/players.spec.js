/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */
//
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
// const cp = require('child_process');
//
describe('players', () => {
  describe('post /players', () => {
    it('should create a new player', (done) => {
      request(app)
      .post('/players')
      .send({ name: 'tiny' })
      .end((err, rsp) => {
        expect(rsp.body.player.__v).to.not.be.null;
        expect(rsp.body.player._id).to.not.be.null;
        expect(rsp.body.player.name).to.equal('tiny');
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        done();
      });
    });
  });
});
