#!/bin/bash
echo "connvm2.sh first!";
pubname=xbapp03
echo "Publish to $pubname?"

read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
	echo "Publishing..."
	scp -r -P 2203 build/* rcg1e15@127.0.0.1:/home/nginx/$pubname/
else
	echo "Cancelled"
fi
