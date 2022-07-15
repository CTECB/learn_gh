class Login {
  public get usernameTxb() { return $('input[name="username"]'); }
  public get passwordTxb() { return $('input[name="password"]'); }
  public get loginBtn() { return $('input.login-button'); }
}

export const LoginPage = new Login();
