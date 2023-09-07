#!/bin/bash

DB_NAME="wordleversusdb"
export PGPASSWORD="Louise"

echo "Configuring $DB_NAME"

#drop the old db
echo "Dropping old contents of $DB_NAME"

dropdb -U tgrabham "$DB_NAME"
createdb -U tgrabham "$DB_NAME"

psql -U tgrabham "$DB_NAME" < ./bin/sql/player.sql
psql -U tgrabham "$DB_NAME" < ./bin/sql/game.sql
psql -U tgrabham "$DB_NAME" < ./bin/sql/gamestat.sql

echo "$DB_NAME configured"