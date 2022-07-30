export const createAppFromJsonObject = async (kintoneClient, appName, spaceId, formFieldsJson, formLayoutJson) => {
  const addAppRsp = await addApp(kintoneClient, appName, spaceId);

  const properties = formFieldsJson.properties;
  await kintoneClient.app.addFormFields({ app: addAppRsp.app, properties });
  await kintoneClient.app.updateFormLayout({ app: addAppRsp.app, layout: formLayoutJson.layout });
  await kintoneClient.app.deployApp({ apps: [{ app: addAppRsp.app }] });

  return addAppRsp;
};

export const addApp = async (kintoneClient, appName, spaceId) => {
  const addAppRsp = await kintoneClient.app.addApp({
    name: appName,
    space: spaceId
  });
  await kintoneClient.app.deployApp({ apps: [{ app: addAppRsp.app }] });

  return addAppRsp;
};

// // Use in case creating from specified Json file
// export const createAppFromJsonFile = async (kintoneClient, appName, spaceId, formFieldsJsonFile, formLayoutJsonFile) => {
//   const addAppRsp = await kintoneClient.app.addApp({
//     name: appName,
//     space: spaceId
//   });
//   await kintoneClient.app.deployApp({ apps: [{ app: addAppRsp.app }] });
//   await browser.pause(5000);
//
//   const formFieldsJson = JSON.parse(await fs.readFile(formFieldsJsonFile, 'utf8'));
//   const properties = formFieldsJson.properties;
//   const formLayoutJson = JSON.parse(await fs.readFile(formLayoutJsonFile, 'utf8'));
//   await kintoneClient.app.addFormFields({ app: addAppRsp.app, properties });
//   await kintoneClient.app.updateFormLayout({ app: addAppRsp.app, layout: formLayoutJson.layout });
//   await kintoneClient.app.deployApp({ apps: [{ app: addAppRsp.app }] });
//   await browser.pause(5000);
//
//   return addAppRsp;
// };
