#!/bin/bash
#
# This script updates the DataBET app. You will need to restart
# the service to make the update effective
#
set -e

# Get the github 
echo "Grabbing the latest software..."
cd .. && git pull

# Create the bundle
echo "Building the Meteor bundle..."
cd ../app && meteor build --directory ..

# NMP install
echo "NPM-install..."
cd ../bundle/programs/server && npm install

