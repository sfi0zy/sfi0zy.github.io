#!/bin/bash

set -e

npm run build

git checkout master

rm -rf `find ./* | grep -v "dist" | grep -v ".git"` || true
cp -r dist/* .
git add .
git commit --amend -m "Rebuild website"
git push origin master -f

git checkout source
