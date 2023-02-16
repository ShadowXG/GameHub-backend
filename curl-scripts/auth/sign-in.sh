#!/bin/bash

API="http://localhost:8000"
URL_PATH="/sign-in"

curl "${API}${URL_PATH}" \
  --include \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{
    "credentials": {
      "username": "'"${username}"'",
      "password": "'"${PASSWORD}"'"
    }
  }'

echo
