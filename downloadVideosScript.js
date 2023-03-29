// It's not used for Automated Youtube Channel
// This is just script to download videos using the links provided by user.

// const downloadVideos = require("./utils/videoDownloader");
const getDownloadLinks = require("./utils/getVideoLinksFromUser");
const ttdl = require("tiktok-video-downloader");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function getAllVideoLinks(user) {
  // Launch Browser sesssion
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1920, // Set viewport width to 1920 pixels
      height: 1080 // Set viewport height to 1080 pixels
    },
  });

  // Navigate to User's TikTok Profile Page
  const page = await browser.newPage();

  const urlPath = `https://www.tiktok.com/@${user}`;
  await page.goto(urlPath);
  await page.waitForTimeout(3000);
  // Scrolling to get more links from USER's profile
  for (let i = 0; i <= 10; i++) {
    await page.keyboard.down("End");
    await page.waitForTimeout(5000);
  }

  // Executing JQuery to get the video links from user's TikTok profile
    const videoLinks = await page.evaluate(() => {
      const elements = Array.from(
        document.querySelectorAll('[href*="/video/"]')
      );
      const links = elements.map((element) => {
        return element.href;
      });
      return links.join("\n");
    });
    fs.writeFile(`links/${user}.txt`, videoLinks);

  // Closing browser session
  await browser.close();
  console.log("Searching for links is done...");
}

async function downloadVideos(links) {
  for (let i = 0; i < links.length; i++) {
    let oneLink = await ttdl.getInfo(links[i]);
    arrLinks.push(oneLink.video.url.no_wm);
  }
  return arrLinks;
}
const arr = ["watchme895", "movies.com53", "movieclips__1", "movies.netflix.shows"]

arr.forEach(async (user) => {
  await getAllVideoLinks(user);
})