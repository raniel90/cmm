#!/bin/bash

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color
printf "${YELLOW} (Step 1/6) ng build --prod\n"
ng build --prod
printf "I ${GREEN}Ionic Build Successful!\n"

printf "${YELLOW} (Step 2/6) Remove Cache\n"
rm -rf public

printf "${YELLOW} (Step 3/6) Create Public Folder\n"
mkdir public

printf "${YELLOW} (Step 4/6) Copy Source code\n"
cp -R www/ public/

printf "${YELLOW} (Step 5/6) Copy assets\n"
cp src/assets/icon/favicon.png public

printf "${YELLOW} (Step 6/6) Deploy To Firebase Hosting\n"
firebase deploy --only hosting
printf "${GREEN} (Step 6/6) Deploy Finished!\n"