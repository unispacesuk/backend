#!/usr/bin/env bash

# This will populate users and questions table with some dummy test data

set -e
#set -x # this line prints all lines that are executed

export PGPASSWORD=p

psql -U u -d db < "Populate.sql"