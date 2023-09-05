#!/bin/bash

sudo service postgresql start
export PGPASSWORD="Louise"

psql -U tgrabham wordleversusdb
