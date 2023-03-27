let cron = require('node-cron');
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs");
const path = require("path");
const chalk = require("chalk");
const downloadVideos = require("../utils/videoDownloader");
const log = console.log;
puppeteer.use(StealthPlugin());
const dotenv = require("dotenv");
dotenv.config();

async function downloadingVideos() {
  const videos = fs.readdirSync(path.join(__dirname, "..", "videos/"), {
    withFileTypes: true
  });
  console.log(videos);
  if (videos.length === 0) {
    await downloadVideos();
    const downloadedVideos = fs.readdirSync(
      path.join(__dirname, "..", "videos/")
    );
    return downloadedVideos[0];
  } else {
    return videos[0];
  }
}

async function uploadVideo() {
  const pass = process.env.PASS;
  const email = process.env.EMAIL;
  log(chalk.green("Running script..."));

  const videoToUpload = await downloadingVideos();
  // Opening Browser
  const browser = await puppeteer.launch({ headless: false });

  // Opening a New tab
  const page = await browser.newPage();

  // Navigate to Page
  await page.goto("https://www.youtube.com/account/");

  // Timeout
  await page.waitForTimeout(3000);

  // Email Input
  const emailInput = await page.waitForSelector("input[type=email]");
  await emailInput.type(email);

  // Clicking Enter
  await emailInput.press("Enter");

  // Timeout
  await page.waitForTimeout(5000);

  // Password Input
  const passwordInput = await page.waitForSelector("input[name=Passwd]");
  await passwordInput.type(pass);

  // Clicking Enter
  await passwordInput.press("Enter");

  // Timeout
  await page.waitForTimeout(5000);

  // Picking specific channel from Channel List
  const channelLink = await page.waitForXPath(
    '//*[@id="channel-title"and text()="TikTok Trends"]'
  );
  await channelLink.click();

  await page.goto("https://www.youtube.com/upload");
  await page.waitForTimeout(3000);

  const fileUpload = await page.waitForSelector('input[name="Filedata"]');
  await fileUpload.uploadFile("videos/" + videoToUpload);

  const notForKidsRadioBtn = await page.waitForXPath(
    '//*[@name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]'
  );
  await notForKidsRadioBtn.click();
  const nextButton = await page.waitForSelector("#next-button");
  await nextButton.click();
  await page.waitForTimeout(2000);
  await nextButton.click();
  await page.waitForTimeout(2000);
  await nextButton.click();
  await page.waitForTimeout(2000);
  const publicRadioBtn = await page.waitForXPath('//*[@name="PUBLIC"]');
  await publicRadioBtn.click();
  const publishBtn = await page.waitForSelector("#done-button");
  await publishBtn.click();
  await browser.close();

  fs.unlink("videos/" + videoToUpload, (err) => {
    if (err) throw err;
    console.log("File deleted successfully!");
  });

  log(chalk.green("Done..."));
}



// var task = cron.schedule('* * * * *', async () => {
//   await uploadVideo();
// });

// task.start()

uploadVideo();