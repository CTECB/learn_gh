import BasePage from '@pages/common/BasePage';
import { fileUtil } from '@utils/FileUtil';
import { pageUtil } from '@utils/PageUtil';
import { sprintf } from 'sprintf-js';
import fs from 'fs/promises';
import path from 'path';

const RECORD_BODY = '#record-gaia';
const TAB_BTN = '//div[@class="tab-wrapped"]/button[text()="%s"]';
const CANCEL_BTN = '.gaia-ui-actionmenu-cancel';
const SAVE_BTN = '.gaia-ui-actionmenu-save';
const TAB1_TEXT1_FIELD = '//span[@class="control-label-text-gaia" and text()="[Tab1] Text1"]/../../div[contains(@class,"control-value-gaia")]/div/input';

class RecordAdd extends BasePage {
  public clickTab = async (tabName: string) => {
    await $(sprintf(TAB_BTN, tabName)).click();
    await browser.pause(2000);
  };

  public clickCancelBtn = async () => {
    await $(CANCEL_BTN).click();
  };

  public clickSaveBtn = async () => {
    await $(SAVE_BTN).click();
    await pageUtil.waitForPageReady(pageUtil.loadingSpinner(), false);
    await browser.pause(4000);
  };

  public verifyIsSelectedTab = async (tabName: string) => {
    const selector = sprintf(TAB_BTN, tabName);
    await expect($(selector)).toHaveElementClass('submit');
  };

  public getRecordBodyHtml = async (regex: RegExp[], isSaveResult = true) => {
    await pageUtil.waitForPageReady();
    await browser.pause(1000);
    let recordBody = await $(RECORD_BODY).getHTML();
    regex.forEach(value => {
      recordBody = recordBody.replace(value, '%replaced%');
    });

    if (isSaveResult) {
      await fs.writeFile('GetHtmlResult.html', recordBody, { encoding: 'utf8' });
    }

    return recordBody;
  };

  public verifyHTLMContent = async (expectedContentFileName: string) => {
    const specificIdRegex = /for="\d+"|id="\d+"|(?<=id=")\S*(?=html5)|((?<==":)(?:\S+)(?="))/g;
    const generalDynamicStringRegex = /(\S+\d+.\d+.(:((\d+)|(\w+)).\w+)?)/g;
    const specificWidthRegex = /(?<=border-box; width: )\d+/g;
    const specificHeightRegex = /(?<=tabindex="\d" style="height: )\d+/g;
    const regex = [specificIdRegex, generalDynamicStringRegex, specificWidthRegex, specificHeightRegex];

    const actualContent = await this.getRecordBodyHtml(regex);
    const expectedFilePath = path.join(process.cwd(), '/resources/multi-tab/', expectedContentFileName);
    const expectedContent = await fileUtil.getFileContent(expectedFilePath, regex);
    expect(actualContent).toEqual(expectedContent);
  };

  public inputTab1Data = async () => {
    await $(TAB1_TEXT1_FIELD).setValue('Tab1 Text1 Value');
  };
}

export const RecordAddPage = new RecordAdd();
