/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */

const expect = require('chai').expect;
const Player = require('../../dst/models/player');
// const sinon = require('sinon');

describe('Player', () => {
  describe('constructor', () => {
    it('should create a new player object', (done) => {
      const testPlayer = new Player({ name: 'David Bowie' });
      testPlayer.validate(err => {
        expect(err).to.be.undefined;
        expect(testPlayer.name).to.equal('David Bowie');
        expect(testPlayer._id).to.be.ok;
        done();
      });
    });
    it('should NOT create a new player object - name to short', (done) => {
      const testPlayer = new Player({ name: 'D' });
      testPlayer.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
  });
});
