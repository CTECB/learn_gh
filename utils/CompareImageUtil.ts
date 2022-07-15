import { join } from 'path';
import { acceptedMismatchPercent } from '@configs/test-conf';

class CompareImageUtil {
  runType: string;
  defaultOptions = {
    formatImageName: '{tag}-{width}x{height}',
    baselineFolder: '',
    actualFolder: '',
    diffFolder: '',
    hideElements: [] as any,
    hideAfterFirstScroll: [] as any,
    removeElements: [] as any,
  };
  constructor() {
    // @ts-ignore
    const platformName = browser.capabilities.platformName;
    if (process.env.HOST === undefined) {
      this.runType = 'local';
    } else if (platformName.indexOf('mac') !== -1) {
      this.runType = 'mac';
    } else {
      // @ts-ignore
      this.runType = platformName;
    }
    this.defaultOptions.baselineFolder = join(
      process.cwd(),
      'resources',
      'baseline_images',
      this.runType
    );
    this.defaultOptions.actualFolder = join(
      process.cwd(),
      '.tmp',
      'actual',
      this.runType
    );
    this.defaultOptions.diffFolder = join(
      process.cwd(),
      '.tmp',
      'diff',
      this.runType
    );
  }

  async verifyAcceptedFullPage(
    pageName: string,
    hideElements: any[] = [],
    mismatchPercent: number = acceptedMismatchPercent,
    isRemoveElements: boolean = false
  ) {
    if (hideElements !== [] && !isRemoveElements) {
      this.defaultOptions.hideElements = hideElements;
    } else if (hideElements !== [] && isRemoveElements) {
      this.defaultOptions.removeElements = hideElements;
    }

    // @ts-ignore
    const actDiff = await browser.checkFullPageScreen(
      `page-${pageName}`,
      this.defaultOptions
    );
    await expect(actDiff).toBeLessThanOrEqual(mismatchPercent);
  }

  async verifyAcceptedScreen(
    screenName: string,
    hideElements: any[] = [],
    mismatchPercent: number = acceptedMismatchPercent,
    isRemoveElements: boolean = false
  ) {
    if (hideElements !== [] && !isRemoveElements) {
      this.defaultOptions.hideElements = hideElements;
    } else if (hideElements !== [] && isRemoveElements) {
      this.defaultOptions.removeElements = hideElements;
    }

    // @ts-ignore
    const actDiff = await browser.checkScreen(
      `screen-${screenName}`,
      this.defaultOptions
    );
    await expect(actDiff).toBeLessThanOrEqual(mismatchPercent);
  }

  async verifyAcceptedScreenWithScroll(
    screenName: string,
    scrollNumber: number = 1,
    scrollElement: string = '//body',
    hideElements: any[] = [],
    mismatchPercent: number = acceptedMismatchPercent,
    isRemoveElements: boolean = false
  ) {
    await browser.pause(1000);
    let i = 1;
    while (i <= scrollNumber) {
      await this.verifyAcceptedScreen(
        `${screenName}-${i}`,
        hideElements,
        mismatchPercent,
        isRemoveElements
      );
      await $(scrollElement).scrollIntoView(false);
      await browser.pause(500);
      i++;
    }
  }
}

export const compareImageUtil = new CompareImageUtil();
