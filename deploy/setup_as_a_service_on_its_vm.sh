#!/bin/bash
set -e

###############################
####   EDIT THIS SECTION   ####
###############################

SERVER_NAME=databet.ics.hawaii.edu
PORT=5001
URL_SUFFIX=/
SETTINGS_FILE=../../settings.production.json
SERVICE_NAME=meteor_databet

###############################
#### END EDIT THIS SECTION ####
###############################

echo "To run this script you need to:"
echo "  1) Be logged in to your deployment ITS VM"
echo "  2) Have sudo access"
echo "  3) Have edited the variables at the top of this script so as to"
echo "     configure your setup parameters"
echo "  4) Likely have done a git pull to get your latest app software"
echo ""
read -p "Do you want to continue? " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	exit 0
fi

read -p "Should we create/install the app bundle?" -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
	./create_and_install_bundle.sh 
fi

echo "Generating the init.d script..."
./generate_init.d_script.sh $SERVICE_NAME $PORT $URL_SUFFIX $SETTINGS_FILE $SERVICE_NAME

echo "Copying the init.d script in /etc/init.d..."
sudo cp ./$SERVICE_NAME /etc/init.d/
/bin/rm -f ./$SERICE_NAME

echo ""
echo "Make sure that /etc/httpd/cond/httpd.conf contains:"
echo "<VirtualHost *:80>"
echo "    ServerName $SERVER_NAME"
echo "    ProxyPreserveHost On"
echo "    ProxyRequests     Off Order deny,allow Allow from all"
echo "    ProxyPass $URL_SUFFIX http://localhost:$PORT/"
echo "    ProxyPassReverse $URL_SUFFIX http://localhost:$PORT/"
echo "</VirtualHost>"
echo ""

echo "Next steps:"
echo "  sudo service $SERVICE_NAME restart"
echo "  sudo service httpd restart"


