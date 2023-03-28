# Automated-Youtube-Channel-Final

The repo is created to set up Automated Youtube Channel, you take videos from TikTok, and then upload videos to Youtube as a Youtube Shorts.

# Dependencies
- Axios
- Puppeteer
- Puppeteer-extra
- Puppeteer-extra-plugin-stealth - to get throguh login with Google. NOTE: Login with Gmail will not work with NOT headless Chrome/Chromium/Firefox.
- Chalk
- Dotenv
- Node-cron - No need for this, if you have CI tool setup.
- TikTok-Video-Downloader - Try to not download more than 25 videos per time, or the service might become unavailable for some time.


# Instructions on how to get started
- Install Node.JS, clone repo and execute `npm i`
- Create .env file on you machine in root directory - add there EMAIL, PASS and USERNAME_LIST.
- Execute the script using `node tests/uploadVideo.js`.
