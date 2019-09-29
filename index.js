#!/usr/bin/env node
require('colors')
var path = require('path')
const fs = require('fs-extra')
const {URL} = require('url')
const isIp = require('isip')
var address = require('address');
const modifyUrl = require("modify-url");

//includes capture groups on the right and left to replace the argument to io
const regexToExtractIoArgument = /(^[^\/\n]*?=.*?io\()(.*?)(\).*)$/gm;
const regexToRemoveQuotes = /^["'](.*)["']$/;
const pathToFeathersFile = path.join(process.cwd(), 'src', 'feathers.js');


(function main() {
  var fileContents;
  var oldConnectionString;
  var newConnectionString;

  getFileContents();
  extractTheActiveConnectionString();
  verifyThatActiveConnectionStringIsAnIpAddress();
  makeNewConnectionString();
  replaceConnectionStringAndOverwriteFile();
  printSuccessLog('Changed'.green + ` ${oldConnectionString.yellow} ${"to".green} ${newConnectionString.yellow}`);

  function getFileContents() {
    try{
       fileContents = fs.readFileSync(pathToFeathersFile, 'utf8');
    }
    catch(err){
      //I want to handle the file does not exist error specifically
      if(err.code === "ENOENT"){
        logErrorAndExit('The feathers.js file could not be found. Are you sure you are in the base of a React Native project?'.red)
      }
    }
  }
  function extractTheActiveConnectionString(){
    var resultsArr = [];
    var matchResult;

    while ( (matchResult = regexToExtractIoArgument.exec(fileContents)) != null){
      resultsArr.push(matchResult)
    }

    const moreThanOneConnectionStringWasMatched = resultsArr.length > 1
    if(moreThanOneConnectionStringWasMatched){
      logErrorAndExit('More than one active connection string was found. This is either a regex error or more than one socket connection is declared in the feathers.js file'.red);
    }
    else {
      //remove the surrounding quotes
      const extractedString = resultsArr[0][2];
      [,oldConnectionString] = extractedString.match(regexToRemoveQuotes);
    }
  }

  function verifyThatActiveConnectionStringIsAnIpAddress(){
    var url = new URL(oldConnectionString);
    const isALocalIpAddress = isIp(url.hostname);

    if(isALocalIpAddress){
      return;
    }
    else{
      logErrorAndExit('The active connection string is '.red + oldConnectionString.yellow + '. Since this is not a local ip connection, the script will abort.'.red)
    }
  }

  function makeNewConnectionString(){
    var newIp = address.ip();
    newConnectionString = modifyUrl(oldConnectionString,{hostname: newIp});
  }

  function replaceConnectionStringAndOverwriteFile(){
    if(oldConnectionString === newConnectionString){
        printSuccessLog('No change required, the connection string was correct'.green)
    }
    var newFileContents = fileContents.replace(regexToExtractIoArgument, `$1'${newConnectionString}'$3`);
    fs.writeFileSync(pathToFeathersFile, newFileContents);
  }

  function printSuccessLog(message){
    process.stdout.write('Success\n'.green);
    process.stdout.write(message + '\n');
    process.exit(0);
  }

})();

function logErrorAndExit(message){
  process.stdout.write('Error:\n'.red)
  process.stdout.write(message + '\n');
  process.exit(0)
}
