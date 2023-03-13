const axios = require("axios");
const fs = require("fs");
const downloadLinks = require("./getVideoLinksFromUser");
const { faker } = require("@faker-js/faker");


/*
* Function to download video 
* {params - url, fileName} - URL - URL to Video, fileName - Name for the downloaded file.
*/
const downloadVideo = (url, fileName) => {
  axios({
    url: url,
    method: "GET",
    responseType: "stream",
  }).then((response) => {
    response.data.pipe(fs.createWriteStream(fileName));
  });
};

/*
* Used for Downloading Videos from Downloaded Links.
*/
module.exports = async function downloadVideos() {
  const URLs = await downloadLinks();
  URLs.forEach((url) => {
    downloadVideo(url, "./videos/" + faker.random.word() + ".mp4");
  });
}