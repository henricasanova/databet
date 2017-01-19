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

echo -ne "\e[32m"
echo "To run this script you need to:"
echo "  1) Be logged in to your deployment ITS VM"
echo "  2) Have sudo access"
echo "  3) Have edited the variables at the top of this script so as to"
echo "     configure your setup parameters"
echo "  4) Likely have done a git pull to get your latest app software"
echo ""
echo -ne "\e[32m\e[1mDo you want to continue?\e[0m "
read -p "" -n 1 -r
echo -e "\e[0m"
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
	exit 0
fi

echo -ne "\e[32m\e[1mShould we create/install the app bundle?\e[0m "
read -p "" -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
	./create_and_install_bundle.sh 
fi

echo -e "\e[32m\e[1mGenerating the init.d script...\e[0m"
./generate_init.d_script.sh $SERVER_NAME $PORT $URL_SUFFIX $SETTINGS_FILE $SERVICE_NAME

echo -e "\e[32m\e[1mCopying the init.d script in /etc/init.d...\e[0m"
sudo cp ./$SERVICE_NAME /etc/init.d/$SERVICE_NAME
echo -e "\e[32m\e[1mMaking it executable...\e[0m"
sudo chmod +x /etc/init.d/$SERVICE_NAME
/bin/rm -f ./$SERVICE_NAME

echo ""
echo -e "\e[32m\e[1mNext steps:\e[0m"
echo -e "\e[33m"
echo -e "\e[1m* Make sure that /etc/httpd/conf/httpd.conf contains:\e[0m\e[33m"
echo "  <VirtualHost *:80>"
echo "      ServerName $SERVER_NAME"
echo "      ProxyPreserveHost On"
echo "      ProxyRequests     Off Order deny,allow Allow from all"
echo "      ProxyPass $URL_SUFFIX http://localhost:$PORT/"
echo "      ProxyPassReverse $URL_SUFFIX http://localhost:$PORT/"
echo "  </VirtualHost>"
echo ""

echo -e "\e[1m* To start the services:\e[0m\e[33m"
echo "  sudo service $SERVICE_NAME restart"
echo "  sudo service httpd restart"
echo ""
echo -e "\e[0m"


