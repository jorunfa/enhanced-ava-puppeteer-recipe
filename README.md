# Enhanced AVA puppeteer recipe

![Example](example.gif)

## Run the tests
```bash
$ npm install
$ npm test
$ npm run demo # gives you a demo, like the one in the gif (non-headlesss and a bit of slowMo)
$ npm test test/hello.ts # runs a specific test
$ npm run demo test/hello.ts # runs a specific demo
```

## Features
* Supports both TypeScript and JavaScript tests
* Demo mode
* AVA runs tests in parallell
* Produces screenshots of failing tests (saved to OS' temp folder)

## Creds
The original AVA recipes:
* https://github.com/avajs/ava/blob/master/docs/recipes/puppeteer.md
* https://github.com/avajs/ava/blob/master/docs/recipes/typescript.md

## Known issues
* The browser windows do not stack nicely and are instead placed randomly.
  * NPM packages `screenres` and `screen-info` have been tried but these do not work with node 12.
