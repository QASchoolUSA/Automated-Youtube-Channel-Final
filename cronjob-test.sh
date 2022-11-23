#!/bin/sh
npm i
npm install -D @playwright/test
node videoDownloader.js
npx playwright test example.spec.ts