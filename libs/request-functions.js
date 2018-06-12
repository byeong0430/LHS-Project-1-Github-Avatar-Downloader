// require request and fs(file system) modules
const request = require('request');
const fs = require('fs');
// require github token from secrets.js
const token = require('./secrets').GITHUB_TOKEN;

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

// cb: callback function
function getRepoContributors(repoOwner, repoName, cb){
  // Check if repoOwner and repoName were correctly entered from command line. If not, console.log an error message and end the function
  if(typeof repoOwner === 'undefined' || typeof repoName === 'undefined'){
    console.log('Please enter valid repo owner and name');
    console.log('i.e.) node download_avatars.js <repoOwner> <repoName>');

    return;
  }

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


// Export the functions
module.exports = {
  getRepoContributors: getRepoContributors,
  downloadImageByURL: downloadImageByURL
};