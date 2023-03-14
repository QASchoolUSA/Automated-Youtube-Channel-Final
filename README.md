# Automated-Youtube-Channel-Final

The repo is created to set up Automated Youtube Channel, you take videos from TikTok, and then upload videos to Youtube as a Youtube Shorts.

# Dependencies
- Axios
- Puppeteer
- Puppeteer-extra
- Puppeteer-extra-plugin-stealth - to get throguh login with Google
- Chalk
- Dotenv
- Node-cron
- TikTok-Video-Downloader


# Instructions on how to get started
- Install Node.JS, clone repoa and execute `npm i`
- Create .env file on you machine in root directory - add there EMAIL, PASS and USERNAME_LIST.
- Execute the script using `node tests/uploadVideo.js`.
