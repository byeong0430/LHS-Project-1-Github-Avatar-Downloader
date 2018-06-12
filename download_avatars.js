// require request module
const request = require('request');
// require github token from secrets.js
const token = require('./secrets').GITHUB_TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');

// error handler
function showStatus(err, result){
  if (err) {
    console.log('Errors:', err);
  }
  console.log('Result:', result);
}

// cb: callback function
function getRepoContributors(repoOwner, repoName, cb){
  const options = {
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'Authorization': `token ${token}`
    }
  };
  
  request(options, function(err, res, body){
    cb(err, body);
  });
}

let repoOwner = 'jquery';
let repoName = 'jquery';

getRepoContributors(repoOwner, repoName, showStatus);