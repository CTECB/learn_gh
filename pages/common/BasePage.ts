import { LoginPage } from './Login';
import { pageUtil } from '@utils/PageUtil';

export default class BasePage {
  public async open(path: string = '', waitForTargetElement: string | undefined = undefined) {
    await browser.url(`${browser.config.baseUrl}/${path}`);
    await pageUtil.waitForPageReady(waitForTargetElement);
  }

  public async login(credentials: {username: string, password: string}): Promise<void> {
    if (await LoginPage.usernameTxb.isDisplayed()) {
      await LoginPage.usernameTxb.setValue(credentials.username);
      await LoginPage.passwordTxb.setValue(credentials.password);
      await LoginPage.loginBtn.click();
      await LoginPage.loginBtn.waitForDisplayed({ reverse: true });
      await browser.pause(1000);
    }
  }
}
