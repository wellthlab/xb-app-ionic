#!/bin/sh
echo "connvm2.sh first!";
scp -r -P 2204 build/* rcg1e15@127.0.0.1:/home/nginx/www/
