export const testingSiteDomain = 'https://sdd-demo.cybozu.com';

export const credentials = {
  username: 'hau',
  password: 'qasd',
};

export const testingApps = {
  multiTab: process.env.MULTI_TAB_APP || 1280,
  plugin2: process.env.PLUGIN_2 || 9999,
};

export const plugins = {
  multiTab: {
    name: 'Multi Tab Plugin',
    id: 'hjimeoiicpfillgjebafbijognopkcfn',
    version: '3.1.1',
    testingAppId: process.env.MULTI_TAB_APP || 1280,
    testingAppToken: 'z6pEwH0QHHukfl0FFtQ9axdHhnRPU5gE6LbDugEK'
  },
};

export const acceptedMismatchPercent = 0.03;
