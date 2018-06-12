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
  // Get object value of key avatar_url
  let avatarUrl = result.map(obj => {
    return obj.avatar_url;
  })
  console.log('Result:', avatarUrl);
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
    // Convert JSON string to an array objects
    let bodyArr = JSON.parse(body);
    cb(err, bodyArr);
  });
}

let repoOwner = 'jquery';
let repoName = 'jquery';

getRepoContributors(repoOwner, repoName, showStatus);