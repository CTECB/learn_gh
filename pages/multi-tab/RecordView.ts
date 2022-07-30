import BasePage from '@pages/common/BasePage';
import { fileUtil } from '@utils/FileUtil';
import { pageUtil } from '@utils/PageUtil';
import fs from 'fs/promises';
import path from 'path';
import { sprintf } from 'sprintf-js';

const RECORD_BODY = '#record-gaia';
const TAB_BTN = '(//div[@class="tab-wrapped"])[%d]/button[text()="%s"]';

class RecordView extends BasePage {
  public async getRecordBodyHtml(regex: RegExp[], isSaveResult = true) {
    await pageUtil.waitForPageReady();
    await browser.pause(3000);
    let recordBody = await $(RECORD_BODY).getHTML();
    regex.forEach(value => {
      recordBody = recordBody.replace(value, '%replaced%');
    });
    // workaround for the case this class is added after updating form layout via API
    recordBody = recordBody.replace(/control-horizon-gaia /g, '');

    if (isSaveResult) {
      await fs.writeFile('GetHtmlResult.html', recordBody, { encoding: 'utf8' });
    }

    return recordBody;
  }

  public async verifyIsSelectedTab(section: number, tabName: string) {
    const selector = sprintf(TAB_BTN, section, tabName);
    await expect($(selector)).toHaveElementClass('submit');
  }

  public async verifyHTLMContent(expectedContentFileName: string) {
    const specificIdRegex = /for="\d+"|id="\d+"|(?<=id=")\S*(?=html5)/g;
    const generalDynamicStringRegex = /(\S+\d+.\d+.(:((\d+)|(\w+)).\w+)?)/g;
    const specificWidthRegex = /(?<=border-box; width: )\d+/g;
    const specificHeightRegex = /(?<=tabindex="\d" style="height: )\d+/g;
    const regex = [specificIdRegex, generalDynamicStringRegex, specificWidthRegex, specificHeightRegex];

    const actualContent = await this.getRecordBodyHtml(regex);
    const expectedFilePath = path.join(process.cwd(), '/resources/multi-tab/', expectedContentFileName);
    const expectedContent = await fileUtil.getFileContent(expectedFilePath, regex);
    expect(actualContent).toEqual(expectedContent);
  }
}

export const RecordViewPage = new RecordView();
