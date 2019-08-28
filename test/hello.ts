'use strict';

import test, { ExecutionContext } from 'ava';
import withPage from './helpers/_withPage';
import { Page } from 'puppeteer';

test('Example.com contains Example Domain heading', withPage, async (t: ExecutionContext, page: Page) => {
    await page.goto('http://example.com');
    t.is(await page.$eval('h1', el => el.textContent), 'Example Domain');
});
