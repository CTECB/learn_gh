export default class ElementUtil {
  async getTextFieldValue(textFieldSelector: string): Promise<string> {
    return browser.execute(
      `return arguments[0].value;`,
      await $(textFieldSelector)
    );
  }
}

export const elementUtil = new ElementUtil();
