#!/bin/bash

read -p "Enter commit message: " msg
if [ -z "$msg" ]; then
    echo "Commit message cannot be empty."
    exit 1
fi

git add .
git commit -m "$msg"
git push origin caps-b
