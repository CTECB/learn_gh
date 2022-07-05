class ActionUtil {
  async scrollToElement(
    element: string | WebdriverIO.Element,
    pauseInMsAfter: number = 500
  ) {
    const elTarget =
      typeof element === 'string' ? await $(element) : await element;
    await elTarget.scrollIntoView({
      block: 'center',
      inline: 'nearest',
    });
    await browser.pause(pauseInMsAfter);
  }

  async scrollAndClickElement(element) {
    await this.scrollToElement(element);
    await this.clickElement(element);
  }

  async scrollAndInputIntoElement(
    element: string | WebdriverIO.Element,
    value: string
  ) {
    await this.scrollToElement(element);
    typeof element === 'string'
      ? await $(element).setValue(value)
      : await element.setValue(value);
  }

  async focusElementByJS(selector: string) {
    // const elm = await $(selector);
    await browser.execute('arguments[0].focus();', await $(selector));
  }

  async clickElementByJS(element: string | WebdriverIO.Element) {
    typeof element === 'string'
      ? await browser.execute('arguments[0].click();', await $(element))
      : await browser.execute('arguments[0].click();', await element);
  }

  async clickElement(element: string | WebdriverIO.Element) {
    // @ts-ignore
    const elTarget: WebdriverIO.Element =
      typeof element === 'string' ? await $(element) : await element;
    await elTarget.waitForClickable();
    await elTarget.click();
  }

  // Keep this comment-out method for further reference
  // Safari 14 can't click on element if the browser window is not activated or focused.
  // So element will be click by JS until Safari updated
  // Ref: https://developer.apple.com/forums/thread/665334
  // clickElement(
  //   el: string | WebdriverIO.Element,
  //   forceSafariClickByJS: boolean = true
  // ) {
  //   const elTarget: WebdriverIO.Element = typeof el === "string" ? $(el) : el;
  //   elTarget.waitForClickable();
  //   if (pageUtil.isBrowser("safari") && forceSafariClickByJS) {
  //     this.clickElementByJS(elTarget);
  //   } else {
  //     elTarget.click();
  //   }
  // }

  async getAttributeElementByJS(
    element: string | WebdriverIO.Element,
    attribute: string
  ): Promise<string> {
    if (typeof element === 'string') {
      return browser.execute(
        `return arguments[0].getAttribute("${attribute}");`,
        await $(element)
      );
    }
    return browser.execute(
      `return arguments[0].getAttribute("${attribute}");`,
      await element
    );
  }

  async getHtmlLangByJS(): Promise<string> {
    return browser.execute('document.documentElement.lang');
  }

  async getUserLanguage(): Promise<string> {
    const lang = (await this.getHtmlLangByJS())
      ? await this.getHtmlLangByJS()
      : 'en';
    return ['en', 'zh', 'ja'].includes(lang) ? lang : 'en';
  }
}

export const actionUtil = new ActionUtil();
