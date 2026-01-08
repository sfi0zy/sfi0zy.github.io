#!/bin/bash

set -e

npm run build

git branch -D master || true
git checkout --orphan master
rm -r `find . | grep -v "dist" | grep -v ".git"` || true
cp -r dist/* .
git add .
git commit -m "Rebuild website"
git push origin master -f

git checkout source
