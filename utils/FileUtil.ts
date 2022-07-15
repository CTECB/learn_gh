import fs from 'fs/promises';

class FileUtil {
  getFileContent = async (filePath: string, regex: RegExp[]) => {
    let contents = await fs.readFile(filePath, { encoding: 'utf8' });
    regex.forEach(value => {
      contents = contents.replace(value, '%replaced%');
    });
    // workaround for the case this class is added after updating form layout via API
    contents = contents.replace(/control-horizon-gaia /g, '');
    await fs.writeFile('GetExpResultFile_replaced.html', contents, { encoding: 'utf8' });

    return contents;
  };
}

export const fileUtil = new FileUtil();