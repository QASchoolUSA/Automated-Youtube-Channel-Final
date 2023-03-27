const puppeteer = require("puppeteer");
const ttdl = require("tiktok-video-downloader");
require("dotenv").config();

// Prototype function to return random value from array
Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

// Getting Username List from .env
const arr = process.env.USERNAME_LIST.split(",");
const user = arr.random();

async function getVideoLinks() {
  // Launch Browser sesssion
  const browser = await puppeteer.launch({ headless: false });

  // Navigate to User's TikTok Profile Page
  const page = await browser.newPage();
  const urlPath = `https://www.tiktok.com/@${user}`;
  await page.goto(urlPath);

  // Scrolling to get more links from USER's profile
  // for (let i = 0; i <= 2; i++) {
  //   await page.keyboard.down("End");
  //   await page.waitForTimeout(3000);
  // }

  // Executing JQuery to get the video links from user's TikTok profile
  const videoLinks = await page.evaluate(() => {
    const arrayOfLinks = Array.from(document.querySelectorAll('[href*="/video/"]'));
//    const links = elements.map((element) => {
//      return element.href;
//    });
    return arrayOfLinks.map(element => element.href)
  });

  // Closing browser session
  await browser.close();
  console.log(videoLinks)
  return videoLinks;
}

module.exports = async function getDownloadLinks() {
  const arrLinks = [];
  const links = await getVideoLinks();
  for (let i = 0; i < links.length; i++) {
    let oneLink = await ttdl.getInfo(links[i]);
    arrLinks.push(oneLink.video.url.no_wm);
  }
  console.log(`[${arrLinks.length} - VIDEO LINKS TO DOWNLOAD]`);
  console.log(arrLinks);

  return arrLinks;
}