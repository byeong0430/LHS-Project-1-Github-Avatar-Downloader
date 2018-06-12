// require request and fs(file system) modules
const request = require('request');
const fs = require('fs');
// require github token from secrets.js
const token = require('./secrets').GITHUB_TOKEN;

console.log('Welcome to the GitHub Avatar Downloader!');

// Callback function to download image using url
function downloadImageByURL(url, filePath){
  request.get(url)
          .on('error', function(err){
            if (err) throw err;
          })
          .on('response', function(response){
            console.log('Response Status Code:', response.statusCode, response.statusMessage);
            console.log('Downloading Github Avatar...');
          })
          .pipe(
            fs.createWriteStream(filePath)
              .on('finish', function(){
              console.log('Download complete!');
              console.log(`Target Avatar URL: ${url} --> ${filePath}`);
              console.log('=================================');
            })     
          );
}

// Callback function to receive a response and filter data to get user name and avatar_url
function filterData(err, result){
  if (err) {
    console.log('Errors:', err);
  }

  let saveDir = './avatars/';
  
  // Get user id and avatar_url
  let urlUserName = result.map(obj => {
    return [obj.avatar_url, `${saveDir}${obj.login}.jpg`];
  })
  
  // downloadImageByURL(urlUserName[0][0], urlUserName[0][1]);
  urlUserName.forEach(item => downloadImageByURL(item[0], item[1]));
}


// cb: callback function
function getRepoContributors(repoOwner, repoName, cb){
  // Request options
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


// Assign command-line variables
let repositoryOwner = process.argv.slice(2)[0];
let repositoryName = process.argv.slice(2)[1];

if(typeof repositoryOwner === 'undefined' && typeof repositoryName === 'undefined'){
  console.log('Please enter valid repo owner and name');
  console.log('i.e.) node download_avatars.js <repoOwner> <repoName>');
}else{
  getRepoContributors(repositoryOwner, repositoryName, filterData);
}