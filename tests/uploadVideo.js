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
  const videos = fs.readdirSync(path.join(__dirname, "..", "videos/"));

  if (videos.length === 0) {
    log(chalk.green(`Video Files not found...`))
    await downloadVideos();
    const downloadedVideos = fs.readdirSync(
      path.join(__dirname, "..", "videos/")
    );

    return downloadedVideos[0];

  } else {

    log(chalk.green(`Video Files Found - ${videos.length} files`))
    
    return videos[0];

  }
}

async function uploadVideo() {
  const pass = process.env.PASS;
  const email = process.env.EMAIL;
  log(chalk.green("Running script..."));

  //const videoToUpload = await downloadingVideos();
  // Opening Browser
  const browser = await puppeteer.launch({ headless: false,
    args: [
      `--user-data-dir=${'/Users/kedrovnick/Library/Application Support/Google/Chrome'}`,
      '--profile-directory=Default'
    ], });

  // Opening a New tab
  const page = await browser.newPage();

  // Navigate to Page
  await page.goto("https://www.youtube.com/account/");

  // Timeout
  await page.waitForNavigation()
  await page.waitForTimeout(30000);

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
  await page.waitForTimeout(3000);
  const notForKidsRadioBtn = await page.waitForXPath(
    '//*[@name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]'
  );
  await page.waitForTimeout(3000);
  await notForKidsRadioBtn.click();
  const nextButton = await page.waitForSelector("#next-button");
  await nextButton.click();
  await page.waitForTimeout(5000);
  await nextButton.click();
  await page.waitForTimeout(5000);
  await nextButton.click();
  await page.waitForTimeout(5000);
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

uploadVideo();