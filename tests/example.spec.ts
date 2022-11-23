import { test, expect } from '@playwright/test';
import fs from "fs";
import path, { dirname } from "path";
import * as dotenv from 'dotenv';
dotenv.config();

const files = fs.readdirSync(path.join(__dirname, '..', 'videos/'));
const pass:any = process.env.PASS;
const email:any = process.env.EMAIL;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


test.describe('Youtube Upload Scripts', () => {
  test('Youtube Auto Upload Videos', async ({ page }) => {
    await page.goto('https://www.youtube.com/account/');
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
    await page.locator('input[name="Filedata"]').setInputFiles(files);
    await page.getByText('Загрузка завершена').waitFor();
    await delay(30000);
  });

  test.afterAll(async () => {
    console.warn("Starting to delete uploaded videos...")
    for (let i = 0; i < files.length; i++) {
      fs.unlinkSync(files[i]);
    }
  });
})