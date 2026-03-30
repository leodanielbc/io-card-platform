#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE card_issuer;
  CREATE DATABASE card_processor;
EOSQL
