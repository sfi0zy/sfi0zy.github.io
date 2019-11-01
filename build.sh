#!/usr/bin/env bash

npm ci

node generate-placeholders.js

bundle exec jekyll clean
bundle exec jekyll build

./hot-fixes.sh
