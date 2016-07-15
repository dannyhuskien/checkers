/* eslint-disable new-cap */

import express from 'express';
import Player from '../models/player';
const router = module.exports = express.Router();

// create
router.post('/', (req, res) => {
  Player.create(req.body, (err, player) => {
    res.send({ player });
  });
});

router.get('/', (req, res) => {
  Player.find((err, players) => res.send({ players }));
});
