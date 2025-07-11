#!/bin/bash

npm --prefix Frontend/vue-frontend run build

git add .

git add frontend/vue-frontend/dist -f

MYVAR=$(date +"%Y-%d-%m %I:%M%p")

git commit -m "$MYVAR"

git subtree push --prefix Frontend/vue-frontend/dist origin gh-page