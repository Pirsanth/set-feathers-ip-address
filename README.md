## Automate setting featherJS's ip address connection string for React Native

### Introduction
Uses regex to **change the ip address in the io call in feathers.js files**. For **React Native** projects because we
can just use localhost for the Web. Run this in the base of React Native projects. Base meaning where the package.json file resides. Don't worry the error's are quite robust. This is a pet project for the company I work for. :))

## Installation
1. **Git clone** into a folder in your compoter
2. Use Terninal to **cd** inside the folder
3. Run **npm install**
4. Run **npm link**

## Usage
 At the base of a react native project just type **io** in the command line to update the ip address used in the feathers.js file.

## Uninstallation
1. Use the commannd line to navigate to where you git cloned the repo
2. Run **npm unlink**
3. Delete the repository from your computer


## Implementation Notes
* It aims to match this line in the feathers.js file for out company's React Native projects:
```javascript
const socket = io('http://192.168.222.777:1234/');
```

* It ignores lines that are commented out like this:
```javascript
//const socket = io('http://192.168.222.777:1234');
```
* if multiple socket connections are active (**not** commented out) like below, the script errors out:
```javascript
const socket = io('http://192.168.222.777:1234');
const socket = io('http://192.168.222.777:1234/');
```
*  If the active connection string is not a local connection (points to live or staged, not
a local ip connection) the script error's out. (Dont wanna risk overwriting live or staged strings)
