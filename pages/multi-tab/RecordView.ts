import BasePage from '@pages/common/BasePage';
import { fileUtil } from '@utils/FileUtil';
import fs from 'fs/promises';
import path from 'path';

const RECORD_BODY = '#record-gaia';

class RecordView extends BasePage {
  public getRecordBodyHtml = async (regex: RegExp[], isSaveResult = false) => {
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
    const specificIdRegex = /for="\d+"|id="\d+"|(?<=id=")\S*(?=html5)/g;
    const generalDynamicStringRegex = /(\S+\d+.\d+.(:((\d+)|(\w+)).\w+)?)/g;
    const specificWidthRegex = /(?<=border-box; width: )\d+/g;
    const specificHeightRegex = /(?<=tabindex="\d" style="height: )\d+/g;
    const regex = [specificIdRegex, generalDynamicStringRegex, specificWidthRegex, specificHeightRegex];

    const actualContent = await this.getRecordBodyHtml(regex);
    const expectedFilePath = path.join(process.cwd(), '/resources/multi-tab/', expectedContentFileName);
    const expectedContent = await fileUtil.getFileContent(expectedFilePath, regex);
    expect(actualContent).toEqual(expectedContent);
  };
}

export const RecordViewPage = new RecordView();
