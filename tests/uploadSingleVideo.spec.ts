import { test, expect } from '@playwright/test';
import fs from "fs";
import path from "path";
import * as dotenv from 'dotenv';
import { downloadVideos } from '../videoDownloader';
dotenv.config();


// returns array of string containing filenames
const pass:any = process.env.PASS;
const email:any = process.env.EMAIL;
const videoDesc = "#travel #nature #trending #view #photography #likeforlikes #likeforlikes #follow #tiktok #explore #likeforlikes #followforfollowback #trend"
let videoObjects:any = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


test.describe('Youtube Upload Videos', () => {
    test.beforeAll(async () => {
        videoObjects = await downloadVideos();
    })
  test('Youtube Upload - Single Video with entering video information.', async ({ page }) => {
    await page.goto('https://www.youtube.com/account/');
    const files = fs.readdirSync(path.join(__dirname, '..', 'videos/'));
    files.forEach((element, index) => {
      files[index] = path.join(__dirname, '..', 'videos/') + element;
    });
    const emailInput = page.locator("input[type=email]");
    await expect(emailInput).toBeVisible();
    await emailInput.fill(email);
    await emailInput.press('Enter');
    const passwordInput = page.locator("input[name=Passwd]");
    await expect(passwordInput).toBeVisible();
    await passwordInput.fill(pass);
    await passwordInput.press("Enter");

    const channelLink = page.locator('text=TikTok Trends')
    await expect(channelLink).toContainText("TikTok Trends")
    await channelLink.click();
    await page.goto('https://www.youtube.com/upload');
    await delay(10000);
    await page.locator('input[name="Filedata"]').setInputFiles(files);
    const title = page.locator('(//ytcp-social-suggestion-input)[1]/div')
    await title.waitFor();
    if (videoObjects[0].desc.includes(">")) {
        let newStr = videoObjects[0].desc.replace(">", " ");
        await title.fill(newStr);
    } else {
        await title.fill(videoObjects[0].desc)
    }
    const description = page.locator('(//ytcp-social-suggestion-input)[2]/div')
    description.fill(videoDesc);
    const notForKidsRadioBtn = page.locator('//*[@name="VIDEO_MADE_FOR_KIDS_NOT_MFK"]');
    notForKidsRadioBtn.dispatchEvent('click');
    const nextButton = page.locator('#next-button');
    nextButton.click();
    await delay(1000);
    nextButton.click();
    await delay(1000);
    nextButton.click();
    await delay(1000);
    const publicRadioBtn = page.locator('//*[@name="PUBLIC"]');
    publicRadioBtn.dispatchEvent('click');
    const publishBtn = page.locator('#done-button');
    publishBtn.click();
    await delay(5000);
  });

//   test.afterAll(async () => {
//     console.warn("Starting to delete uploaded videos...")
//     for (let i = 0; i < files.length; i++) {
//       fs.unlinkSync(files[i]);
//     }
//   });
})