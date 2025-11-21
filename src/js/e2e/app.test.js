import puppeteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000);

describe('button test', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:8080';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
      ],
      timeout: 60000,
    });
    });

    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });

  test('should check button`s work', async () => {
    await page.goto(baseUrl);
    const btn = await page.$('[class=toggle-btn]');
    btn.click();
    await page.waitForSelector('[class=popover]');
  });
});
