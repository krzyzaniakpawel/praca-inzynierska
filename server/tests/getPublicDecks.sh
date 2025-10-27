#!/usr/bin/env bash

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "andrzej", "password": "12345678"}' \
  -c cookies.txt

curl -X GET http://localhost:3000/api/decks/public -b cookies.txt | jq