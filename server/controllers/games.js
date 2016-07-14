/* eslint-disable new-cap, no-underscore-dangle*/

import express from 'express';
import Game from '../models/game';

import moveBody from '../validators/moveBody';
const router = module.exports = express.Router();

// create
router.post('/', (req, res) => {
  Game.create(req.body, (createGameError, game) => {
    game.setupBoard();
    game.save((saveGameError, savedGame) => {
      res.send({ game: savedGame });
    });
  });
});

// move
router.put('/:id/move', moveBody, (req, res) => {
  Game.findById(req.params.id, (findGameError, game) => {
    const moveErr = game.move(res.locals);
    if (moveErr) {
      res.status(400).send({ messages: [moveErr.message] });
      return;
    }

    game.checkWin((winner) => {
      if (winner) {
        res.send({ winner });
        return;
      }
      game.markModified('pieces');
      game.save((saveGameError, modifiedGame) => {
        res.send({ game: modifiedGame });
      });
    });
  });
});
