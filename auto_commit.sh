#!/bin/bash

cd "$(dirname "$0")"

echo "Auto update: $(date)" >> auto.log

git add .
git commit -m "Daily auto commit"
git push

