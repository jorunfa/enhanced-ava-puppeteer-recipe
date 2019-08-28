'use strict';

import { ExecutionContext } from 'ava';
import puppeteer, { Page, Browser } from 'puppeteer';
import devices from 'puppeteer/DeviceDescriptors';
import { unlink as _unlink } from 'fs';
import { promisify } from 'util';
import { tmpdir } from 'os';
import { join } from 'path';

const unlink = promisify(_unlink);

const device: devices.Device = process.env.device ? devices[process.env.device] : devices['iPhone 8'];
const headless = process.env.headless ? (process.env.headless === "true") : true;
const slowMo: number = +process.env.slowMo || (headless ? 0 : 65);

function getBrowserConfig() {
    const randomX = getRandomInt(0, 1200 - device.viewport.width);
    const randomY = getRandomInt(0, 1000 - device.viewport.height);
    const result = {
        headless,
        slowMo,
        args: [
            `--window-size=${device.viewport.width},${device.viewport.height}`,
            `--window-position=${randomX},${randomY}`
        ],
    };

    return result;
}

export default async function runTest(t: ExecutionContext, run: (arg0: ExecutionContext<unknown>, arg1: Page) => void) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.emulate(device);

    let screenshots = [];

    page.on('load', async () => {
        const path = getScreenshotPath(browser, t.title);
        try {
            await page.screenshot({ path });
        } catch (error) {
            return;
        }
        screenshots = [...screenshots, path];
    });

    try {
        await run(t, page);

        const deleteScreenShots = screenshots.map(path => {
            try {
                unlink(path);
            } catch (_ignore) {
            }
        });
        await Promise.all(deleteScreenShots);
    } catch (error) {
        const path = getScreenshotPath(browser, t.title, true);
        await page.screenshot({ path });
        console.error(path);
        throw error;
    } finally {
        await page.close();
        await browser.close();
    }
}

function getScreenshotPath(browser: Browser, testName: String, error = false) {
    const folder = tmpdir();
    let fileName = `${browser.process().pid}-${testName}-${new Date().toISOString()}${error ? "-error" : ""}.png`;
    fileName = fileName.replace(/[\s:]/g, '_');
    return join(folder, fileName);
}

async function getBrowser() {
    return await puppeteer.launch(getBrowserConfig());
}

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
