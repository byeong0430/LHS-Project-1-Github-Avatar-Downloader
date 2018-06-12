
// require request and fs(file system) modules
const request = require('request');
const fs = require('fs');

// require dotenv module and configure the path to .env file
let dotEnvDir = `${__dirname}/.env`;
if(checkDirExist(dotEnvDir)){
  return false;
}else{
  require('dotenv').config({path: dotEnvDir});
}

// Github token is saved in .env file
const token = process.env.GITHUB_TOKEN;

// Check if a directory exists. If not, return true.
// if (checkDirExist(dir)) return false; -> stop the whole script
function checkDirExist(dir){
  if(!fs.existsSync(dir)){
    console.log(`Error: ${dir} doesn't exist!`);
    return true;
  }
}

// Callback function to download image using url
function downloadImageByURL(url, filePath){
  request.get(url)
          .on('error', function(err){
            if (err) throw err;
          })
          .on('response', function(response){
            console.log('Response Status Code:', response.statusCode, response.statusMessage);
          })
          .pipe(
            fs.createWriteStream(filePath)
              .on('finish', function(){
              console.log('Download complete!');
              console.log(`Target Avatar URL: ${url}  --(saved as)-->  ${filePath}`);
              console.log('=================================');
            })     
          );
}

// cb: callback function
function getRepoContributors(repoOwner, repoName, cb){
  // Check if repoOwner and repoName were entered from command line. If not, console.log an error message and end the function
  if(typeof repoOwner === 'undefined' || typeof repoName === 'undefined'){
    console.log('Error: Please enter valid repo owner and name');
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
    // Check if the HTTP status code is 200 (OK). If not, print the status code and message
    if(res.statusCode !== 200){
      console.log(`Error Code ${res.statusCode}, ${res.statusMessage}`);
      return;
    }

    // Convert JSON string to an array objects
    let bodyArr = JSON.parse(body);
    cb(err, bodyArr);
  });
}


// Export the functions
module.exports = {
  getRepoContributors: getRepoContributors,
  downloadImageByURL: downloadImageByURL,
  checkDirExist: checkDirExist
};