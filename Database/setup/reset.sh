#!/usr/bin/env bash

# This file only runs a drop script to clean the database and drop all tables.
# Only run if you want to start a clean database setup.
# TESTING ENVIRONMENT ONLY!!!

set -e
#set -x # this line prints all lines that are executed

username=""
password=""
database=""

while getopts "u:p:d:" flag; do
  case $flag in
  u)
    username=$OPTARG
    ;;
  p)
    password=$OPTARG
    ;;
  d)
    database=$OPTARG
    ;;
  *)
    echo "It appears you have used an invalid flag... :thinking:"
    echo "Try again with only the correct flags."
    echo "script -u <username> -p <password> -d <database>"
    exit
    ;;
  esac
done

if [[ $username == "" || $password == "" || $database == "" ]]; then
  echo "Make sure you set all the flags."
  echo "script -u <username> -p <password> -d <database>"
else

  echo "Dropping all tables. Continue? (yes)"
  read -r -p ">> " option

  if [[ $option =~ ([Yy]es)|([Yy]) ]]; then
    export PGPASSWORD="$password"
    psql -U "$username" -d "$database" <"DropAll.sql"
  else
    echo "Cancelling..."
  fi

fi
