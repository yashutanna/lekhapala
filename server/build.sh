#!/bin/bash

mkdir ./temp
cp ./dist/*.json ./temp
cp ./dist/.env ./temp

yarn build

cp ./temp/** ./dist
cp ./temp/.env ./dist

rm -rf ./temp