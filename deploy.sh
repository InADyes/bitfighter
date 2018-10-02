#!/usr/bin/env bash
ENVIRONMENT=$1
if [ "$1" != "" ]; then
 echo "Deploying: $ENVIRONMENT"

 #Set correct bucket
 if [ "$ENVIRONMENT" = "production" ]; then
   BUCKET="cof.questmode.io"
 elif [ "$ENVIRONMENT" = "staging" ]; then
   BUCKET="staging-cof.questmode.io"
 fi

 echo "Sending to Bucket: $BUCKET"

 #Deploy all files except index with caching for a year
 aws s3 sync build/ s3://$BUCKET \
 --exclude "index.html" \
 --acl "public-read" \
 --cache-control "public,max-age=2592000" \
 --region "us-west-2"

 #Deploy index file with no-cache
 aws s3 sync build/ s3://$BUCKET \
 --exclude "*" \
 --include "index.html" \
 --acl "public-read" \
 --cache-control "no-cache" \
 --region "us-west-2"

else
 echo "no env set"
fi
