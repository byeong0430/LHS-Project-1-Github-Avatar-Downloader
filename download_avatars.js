// require fs and request-functions.js module
const requestFunctions = require('./libs/request-functions');
const getRepoContributors = requestFunctions.getRepoContributors;
const downloadImageByURL = requestFunctions.downloadImageByURL;
const checkDirExist = requestFunctions.checkDirExist;

// Callback function to receive a response and filter data to get user name and avatar_url
function filterData(err, result){
  if (err) throw err;
  let saveDir = './avatars/';

  // Check if saveDir exists. IF not, print the error message and stop the script
  if (checkDirExist(saveDir)){
    return false;
  }
  
  // Get user id and avatar_url
  let urlUserName = result.map(obj => {
    return [obj.avatar_url, `${saveDir}${obj.login}.jpg`];
  })
  
  // downloadImageByURL(urlUserName[0][0], urlUserName[0][1]);
  urlUserName.forEach(item => downloadImageByURL(item[0], item[1]));
}


console.log('Welcome to the GitHub Avatar Downloader!');

if(process.argv.slice(2).length !== 2){
  console.log('Error: Please enter only 2 arguments  on command line!');
  console.log('i.e.) node download_avatars.js <repoOwner> <repoName>');
}else{
  // Assign command-line variables
  let repositoryOwner = process.argv.slice(2)[0];
  let repositoryName = process.argv.slice(2)[1];

  getRepoContributors(repositoryOwner, repositoryName, filterData);
}

