import puppeteer from 'puppeteer';
import { fork } from 'child_process';
import path from 'path';

jest.setTimeout(60000);

describe('button test', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:8080';

  beforeAll(async () => {
    // Запуск сервера
    const serverPath = path.resolve(__dirname, '../../e2e.server.js');
    server = fork(serverPath);

    // Ожидание сигнала от сервера (с таймаутом)
    await new Promise((resolve, reject) => {
      server.on('error', (err) => {
        console.error('Сервер упал:', err);
        reject(err);
      });

      server.on('message', (message) => {
        if (message === 'ok') {
          console.log('✅ Сервер готов');
          resolve();
        }
      });

      // Таймаут ожидания сервера — 15 секунд
      setTimeout(() => {
        reject(new Error('Сервер не ответил за 15 сек'));
      }, 15000);
    });

    // Запуск браузера с флагами для CI
    browser = await puppeteer.launch({
      headless: true, // Обязательно для CI
      args: [
        '--no-sandbox',          // Отключаем sandbox
        '--disable-setuid-sandbox', // Дополнительная безопасность
        '--disable-dev-shm-usage', // Используем файловую систему вместо /dev/shm
        '--disable-accelerated-2d-canvas', // Отключаем аппаратное ускорение
        '--disable-gpu',        // Отключаем GPU
        '--window-size=1920,1080', // Размер окна
        '--single-process',      // Уменьшает потребление памяти
      ],
      timeout: 60000, // Таймаут запуска браузера
    });

    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
  });

  afterAll(async () => {
    // Корректное завершение
    if (browser) {
      await browser.close();
    }
    if (server) {
      server.kill();
    }
  });

  test('should check button`s work', async () => {
    console.log('🔗 Переход на:', baseUrl);
    
    await page.goto(baseUrl, {
      waitUntil: 'networkidle2', // Ждём завершения сетевых запросов
      timeout: 30000,       // Таймаут загрузки страницы
    });

    console.log('📄 Страница загружена:', page.url());

    // Поиск кнопки
    const btn = await page.$('.toggle-btn');
    if (!btn) {
      const html = await page.content();
      throw new Error(
        'Кнопка .toggle-btn не найдена!\n' +
        'Текущий HTML:\n' + html.substring(0, 1000) // Первые 1000 символов
      );
    }

    console.log('✅ Кнопка найдена, кликаем');
    await btn.click();

    // Ожидание попапа
    await page.waitForSelector('.popover', {
      visible: true,
      timeout: 10000,

});
