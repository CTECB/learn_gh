export const testingSiteDomain = 'haula.kintone.com';

export const credentials = {
  username: 'hau-la@cybozu.vn',
  password: 'haula2907',
};

export const testingApps = {
  multiTab: process.env.MULTI_TAB_APP || 258,
  plugin2: process.env.PLUGIN_2 || 9999,
};

export const plugins = {
  multiTab: {
    name: 'Multi Tab Plugin',
    id: 'hjimeoiicpfillgjebafbijognopkcfn',
    version: '3.1.1',
    testingAppId: process.env.MULTI_TAB_APP || 258,
    testingAppToken: '06DlB7VVx3m16eNNbHUpiFIg2O2IfEKz30TtcENK'
  },
};

export const acceptedMismatchPercent = 0.03;
