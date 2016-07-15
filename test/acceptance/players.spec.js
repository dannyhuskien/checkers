/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */
//
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
//
describe('players', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      done();
    });
  });
  describe('post /players', () => {
    it('should create a new player', (done) => {
      request(app)
      .post('/players')
      .send({ name: 'Some Random Person' })
      .end((err, rsp) => {
        expect(rsp.body.player.__v).to.not.be.null;
        expect(rsp.body.player._id).to.not.be.null;
        expect(rsp.body.player.name).to.equal('Some Random Person');
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        done();
      });
    });
  });
  describe('get /players', () => {
    it('should get a list of all players', (done) => {
      request(app)
      .get('/players')
      .send()
      .end((err, rsp) => {
        expect(rsp.body.players).to.have.length(2);
        expect(rsp.body.players[0].name).to.not.be.null;
        expect(rsp.body.players[1].name).to.not.be.null;
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        done();
      });
    });
  });
});
