#!/bin/bash

mongoimport --jsonArray --drop --db $DB --collection games --file ../data/gameData.json
mongoimport --jsonArray --drop --db $DB --collection players --file ../data/playerData.json
