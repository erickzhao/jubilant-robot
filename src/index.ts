import { Browser, remote } from 'webdriverio';
export class FiddleBot {
  private constructor(
    /**
     * The underlying WebDriver.IO browser driving Electron Fiddle
     */
    public readonly browser: Browser<'async'>
  ) {}
  /**
   * Asynchronous static constructor for FiddleBot
   * @param binaryPath Path to the Electron Fiddle binary
   * @returns An instance of FiddleBot
   */
  public static CreateAsync = async (binaryPath: string) => {
    const browser = await remote({
      capabilities: {
        browserName: 'chrome',
        'goog:chromeOptions': {
          binary: binaryPath,
        },
      },
    });

    // remove initial popup box
    const apiLink = await browser.$(`span=I'll figure it out`);
    await apiLink.click();

    return new FiddleBot(browser);
  };

  /**
   * Loads a gist into Electron Fiddle
   * @param gistUrl The URL of the gist to load
   */
  public async loadGist(gistUrl: string) {
    const input = await this.browser.$(
      `[placeholder='https://gist.github.com/...']`
    );
    await input.setValue(gistUrl);

    await this.browser.pause(1000);

    const button = await this.browser.$('span=Load Fiddle');
    await button.click();
  }

  /**
   * Sets the first version
   * @param version The filt
   */
  public async selectVersion(version: string) {
    const button = await this.browser.$(`button.version-chooser`);
    await button.click();
    await this.browser.pause(1000);
    const input = await this.browser.$(`[placeholder='Filter...']`);
    await input.setValue(version);
    await this.browser.keys(['Enter']);
  }

  /**
   * Executes the current Fiddle
   */
  public async runFiddle() {
    const button = await this.browser.$('.button-run');
    await button.waitForClickable();
    await button.click();
  }

  /**
   * Closes Electron Fiddle
   */
  public async close() {
    this.browser.deleteSession();
  }
}

// Remove this tester code
(async () => {
  const fb = await FiddleBot.CreateAsync(
    `/Applications/Electron Fiddle.app/Contents/MacOS/electron-fiddle`
  );
  await fb.loadGist(
    `https://gist.github.com/ckerr/af3e1a018f5dcce4a2ff40004ef5bab5`
  );
  await fb.selectVersion('11.0.0');
  await fb.runFiddle();

  browser.pause(10000);

  await fb.close();
})();
