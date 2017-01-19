#!/bin/bash
set -e

if [ "$#" -ne 5 ] ; then
	echo "Usage: $0 <server name> <port> </url_suffix> <path to settings file> <service_name>"
	echo ""
	echo "Examples:"
	echo "  $0 myserver.ics.hawaii.edu 5001 / ../config/settings.json meteor_myapp"
	echo "  $0 myserver.ics.hawaii.edu 5001 /my_app ../config/settings.json meteor_myapp"
	exit 1
fi

SERVER_NAME=$1
PORT=$2
URL_SUFFIX=$3
SETTINGS_FILE=$4
SERVICE_NAME=$5

if [ ! -e $SETTING_FILE ]; then
	echo "Can't find file '$SETTINGS_FILE'"
	exit 1
fi

if [ ! -r $SETTING_FILE ]; then
	echo "File '$SETTINGS_FILE' is not readable"
	exit 1
fi

SETTINGS_FILE="$(cd "$(dirname $SETTINGS_FILE)"; pwd)/$(basename $SETTINGS_FILE))"

MAIN_DIR=`cd ..; pwd`



cat ./init.d_script.in \
	| sed "s|@SERVICE_NAME@|$SERVICE_NAME|"  \
	| sed "s|@SERVER_NAME@|$SERVER_NAME|"  \
	| sed "s|@PORT@|$PORT|"  \
	| sed "s|@URL_SUFFIX@|$URL_SUFFIX|"  \
	| sed "s|@SETTINGS_FILE@|$SETTINGS_FILE|"  \
	| sed "s|@MAIN_DIR@|$MAIN_DIR|"  \
     	> ./$SERVICE_NAME



echo "Script generated in ./$SERVICE_NAME"
echo "To install it: sudo cp ./$SERVICE_NAME /etc/init.d/$SERVICE_NAME"
echo "Make sure that there is a $SERVICE_NAME user and a $SERVICE_NAME group"
