#!/bin/bash
#
# This script runs the app
# the service to make the update effective
#
set -e

export MONGO_URL=mongodb://localhost:27017

export ROOT_URL=http://localhost:$PORT/
export PORT=5001

export METEOR_SETTINGS=`cat ../config/settings.real.json`

cd $BUNDLE_DIR/bundle/ && node main.js 

