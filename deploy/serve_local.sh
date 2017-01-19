#!/bin/sh 

#
# This is the script to run the app in development mode,
# as a meteor application
#

# For the non-local running of node
#export METEOR_SETTINGS=$(cat ../config/settings.real.json)
#echo METEOR_SETTINGS=$METEOR_SETTINGS

PORT=1234
SETTINGS_FILE=../config/settings.development.json

cd ../app && ROOT_URL=http://localhost:$PORT/databet meteor --settings=$SETTINGS_FILE  --port $PORT --no-release-check


