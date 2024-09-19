#!/bin/sh

# For each folder, execute npm install
for d in */ ; do
    echo "Installing dependencies for $d"
    cd $d
    npm install
    cd ..
done