import _ from 'lodash';

export const getTestSpecs = (testSuites) => {
  let testSuitesOjb: any = Object.assign(testSuites);
  if (
    process.env.PLUGIN_SUITES !== undefined &&
    process.env.PLUGIN_SUITES !== 'ALL'
  ) {
    const inputSuites = process.env.PLUGIN_SUITES.split(',');
    testSuitesOjb = _.pick(testSuites, inputSuites);
  }
  const suites = Object.values(testSuitesOjb);
  return suites.map((value: any) => {
    return value[0];
  });
};
