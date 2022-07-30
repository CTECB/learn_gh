const core = require('@actions/core');
const xml2js = require('xml2js');
const path = require('path');
const glob = require('glob');
const fs = require('fs/promises');

(async() => {
  try {
    const xmlReportFile = glob.sync(
      path.join(process.cwd(), 'allure-results', '*.xml')
    );

    const failures = [];
    for (const file of xmlReportFile) {
      const xmlString = await fs.readFile(file, 'utf8');
      const parser = new xml2js.Parser({ trim: true, ignoreAttrs: true });
      const report = await parser.parseStringPromise(xmlString);
      const testCases = report['ns2:test-suite']['test-cases'][0]['test-case'];
      for (const testCase of testCases) {
        let failure = '';
        if (testCase['failure']) {
          const replacedString = `${process.cwd()}/`;
          let stackStrace = testCase['failure'][0]['stack-trace'][0].replace(new RegExp(replacedString, 'g'), '').replace(/\s{2}/g, '');
          if (stackStrace.length > 500) {
            const truncatedStackStrace1 = stackStrace.slice(0, 200);
            const truncatedStackStrace2 = stackStrace.slice(stackStrace.length - 400, stackStrace.length);
            stackStrace = `${truncatedStackStrace1} [... truncated string ...] ${truncatedStackStrace2}`;
          }
          // @ts-ignore
          failure =
            `❌ [Test name] ${testCase['name'][0]}<br>
             [Stacktrace] ${stackStrace}`;
          failures.push(failure);
        }
      }
    }
    core.setOutput("allureResultFailure", failures.join('<br>----------------------------------------------<br>'));
    console.log(`allureResultFailure: ${failures}`);
  } catch (error) {
    core.setFailed(error.message);
  }
})();
