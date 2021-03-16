const { remote } = require('webdriverio');

(async () => {
  const browser = await remote({
    capabilities: {
      browserName: 'chrome',
      'goog:chromeOptions': {
        binary: `/Applications/Electron Fiddle.app/Contents/MacOS/electron-fiddle`,
      },
    },
  })
  const apiLink = await browser.$(`span=I'll figure it out`);
  apiLink.click();
  await browser.debug();
  await browser.deleteSession()
})()
