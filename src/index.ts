import { Browser, remote } from 'webdriverio';
export class FiddleBot {
  private constructor(
    public readonly browser: Browser<"async">
  ) {
  }
  public static CreateAsync = async () => {
    const browser = await remote({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          binary: `/Applications/Electron Fiddle.app/Contents/MacOS/electron-fiddle`,
        },
      },
    })
    return new FiddleBot(browser);
  }

  public async close() {
    return this.browser.deleteSession()
  }
}

(async () => {
  const fb = await FiddleBot.CreateAsync();
  const apiLink = await fb.browser.$(`span=I'll figure it out`);
  await apiLink.click();
  await fb.close();
})()
