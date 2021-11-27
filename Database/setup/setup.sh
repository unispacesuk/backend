#!/usr/bin/env bash

#set -e
#set -x

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
    echo "It appears you have used an invalid flag... 🤔"
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
  echo "Running the initial Database Setup...."
  export PGPASSWORD="$password"
  psql -U "$username" -d "$database" <"MainSchema.sql"
fi
