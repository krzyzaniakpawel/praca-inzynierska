#!/usr/bin/env bash

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "andrzej", "password": "12345678"}' \
  -c cookies.txt

curl -X PATCH http://localhost:3000/api/flashcards/12/reviews \
  -H "Content-Type: application/json" \
  -d '{"quality": 5}' \
  -b cookies.txt | jq