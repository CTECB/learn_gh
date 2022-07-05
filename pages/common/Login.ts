import { pageUtil } from '@utils/PageUtil';

class Login {
  public get usernameTxb() { return $('input[name=\'username\']'); }

  public get passwordTxb() { return $('input[name=\'password\']'); }

  public get loginBtn() { return $('input.login-button'); }

  public async login(username, password) {
    await this.usernameTxb.setValue(username);
    await this.passwordTxb.setValue(password);
    await this.loginBtn.click();
    await browser.pause(1000);
    await pageUtil.waitForPageReady('input.login-button', false);
  }
}

export const LoginPage = new Login();
