class PageUtil {
  loadingSpinner() {
    return browser.isMobile
      ? 'div[class*="viewpanel-viewpanelcontainer"] .cybozu-ui-loading-inner'
      : '.cybozu-ui-loading-canvas';
  }

  async goToUrl(path: string, timeout: number = 30000, interval: number = 500) {
    await browser.url(path);
    await browser.waitUntil(
      async () => (await browser.getUrl()).includes(path),
      {
        timeout: timeout,
        timeoutMsg: `[${timeout}ms] Expected: ${path} - Actual: ${browser.getUrl()}`,
        interval: interval,
      }
    );

    await this.waitForPageReady(this.loadingSpinner(), false);
  }

  async waitForPageInteractive(timeout = 30000, interval = 10) {
    await browser.waitUntil(
      async () => (await this._getDocumentState()) === 'interactive',
      {
        timeout: timeout,
        interval: interval,
      }
    );
  }

  async waitForPageReady(
    targetElement: string | undefined = undefined,
    isExisting: boolean = true,
    sleepInMillisecond: number = 0,
    timeout = 30000,
    interval = 500
  ) {
    await browser.waitUntil(
      async () => (await this._getDocumentState()) === 'complete',
      {
        timeout: timeout,
        timeoutMsg: `State of page is not complete after ${timeout}ms`,
        interval: interval,
      }
    );

    if (targetElement !== undefined) {
      if (isExisting) {
        await browser.waitUntil(async () => $(targetElement).isExisting(), {
          timeout: timeout,
          timeoutMsg: `Specific element ${targetElement} is not existing after ${timeout}ms`,
          interval: interval,
        });
      } else {
        await browser.waitUntil(
          async () => !(await $(targetElement).isExisting()),
          {
            timeout: timeout,
            timeoutMsg: `Specific element ${targetElement} is still existing after ${timeout}ms`,
            interval: interval,
          }
        );
      }
    }
    if (sleepInMillisecond > 0) await browser.pause(sleepInMillisecond);
  }

  isBrowser(browserName: string) {
    return (
      // @ts-ignore
      browser.capabilities.browserName.toLowerCase() ===
      browserName.toLowerCase()
    );
  }

  isPlatform(platformName: string) {
    return (
      // @ts-ignore
      browser.capabilities.platformName
        .toLowerCase()
        .indexOf(platformName.toLowerCase()) !== -1
    );
  }

  getPlatformName() {
    // @ts-ignore
    return browser.capabilities.platformName.toLowerCase();
  }

  getBrowserName() {
    // @ts-ignore
    return browser.capabilities.browserName.toLowerCase();
  }

  async _getDocumentState() {
    return browser.execute(() => {
      return document.readyState;
    });
  }
}

export const pageUtil = new PageUtil();
