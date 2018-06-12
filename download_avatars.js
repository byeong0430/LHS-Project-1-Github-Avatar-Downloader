// require request-functions.js module
const requestFunctions = require('./libs/request-functions');
const getRepoContributors = requestFunctions.getRepoContributors;
const downloadImageByURL = requestFunctions.downloadImageByURL;

// Callback function to receive a response and filter data to get user name and avatar_url
function filterData(err, result){
  if (err) throw err;
  let saveDir = './avatars/';
  // Get user id and avatar_url
  let urlUserName = result.map(obj => {
    return [obj.avatar_url, `${saveDir}${obj.login}.jpg`];
  })
  
  // downloadImageByURL(urlUserName[0][0], urlUserName[0][1]);
  urlUserName.forEach(item => downloadImageByURL(item[0], item[1]));
}


console.log('Welcome to the GitHub Avatar Downloader!');

// Assign command-line variables
let repositoryOwner = process.argv.slice(2)[0];
let repositoryName = process.argv.slice(2)[1];

if(typeof repositoryOwner === 'undefined' && typeof repositoryName === 'undefined'){
  console.log('Please enter valid repo owner and name');
  console.log('i.e.) node download_avatars.js <repoOwner> <repoName>');
}else{
  getRepoContributors(repositoryOwner, repositoryName, filterData);
}