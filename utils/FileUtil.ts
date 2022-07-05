import fs from 'fs/promises';

class FileUtil {
  getFileContent = async (filePath: string, regex: RegExp[]) => {
    let contents = await fs.readFile(filePath, { encoding: 'utf8' });
    regex.forEach(value => {
      contents = contents.replace(value, '%replaced%');
    });
    // await fs.writeFile('GetExpResultFile_replaced.html', contents, { encoding: 'utf8' });

    return contents;
  };
}

export const fileUtil = new FileUtil();