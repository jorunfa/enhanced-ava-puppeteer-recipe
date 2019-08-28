'use strict';

import test from 'ava';
import withPage from './helpers/_withPage';

test('Example.com contains Example Domain heading using ts', withPage, async (t, page) => {
    await page.goto('http://example.com');
    t.is(await page.$eval('h1', el => el.textContent), 'Example Domain');
});
