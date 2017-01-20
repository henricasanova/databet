#!/bin/bash
set -e

if [ "$#" -ne 2 ] ; then
	echo "Usage: $0 <service name> <port>"
	exit 1
fi

SERVICE_NAME=$1
PORT=$2

ORIGINAL_CONFIG_FILE=$HOME/mongod.conf
CONFIG_FILE=/etc/mongo_$SERVICE_NAME.conf


echo "Creating $CONFIG_FILE..."
cat $ORIGINAL_CONFIG_FILE | \
	sed "s|/var/log/mongodb/mongod.log|/var/log/mongodb/mongod_$SERVICE_NAME.log|" | \
	sed "s|dbPath: /var/lib/mongo|dbPath: /var/lib/mongo_$SERVICE_NAME|" | \
	sed "s|pidFilePath: /var/run/mongodb/mongod.pid|pidFilePath: /var/run/mongodb/mongod_$SERVICE_NAME.pid|" | \
	sed "s|port:.*|port: $PORT|" > /tmp/mongod.conf
sudo mv -f /tmp/mongod.conf $CONFIG_FILE

echo "Creating /var/lib/mongo_$SERVICE_NAME directory..."
sudo mkdir -p /var/lib/mongo_$SERVICE_NAME


