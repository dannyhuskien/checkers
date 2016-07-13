/* eslint-disable new-cap */

import express from 'express';
import Game from '../models/game';
import moveBody from '../validators/moveBody';
const router = module.exports = express.Router();

// create
router.post('/', (req, res) => {
  Game.create(req.body, (err, game) => {
    game.setupBoard();
    game.save(() => {
      res.send({ game });
    });
  });
});

// move
router.put('/:id/move', moveBody, (req, res) => {
  Game.findById(req.params.id, (err, game) => {
    const moveErr = game.move(res.locals);
    if (moveErr) {
      res.status(400).send({ messages: [moveErr.message] });
      return;
    }
    game.save(() => {
      res.send({ game });
    });
  });
});
