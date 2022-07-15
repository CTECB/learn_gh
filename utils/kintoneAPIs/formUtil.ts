import path from 'path';
import fs from 'fs/promises';

export const addFormField = async (kintoneClient, appId, field) => {
  try {
    console.log('[add form field] addFormFields');
    await kintoneClient.app.addFormFields({
      app: appId,
      properties: field,
    });
    console.log('[add form field] deployApp');
    await kintoneClient.app.deployApp({ apps: [{ app: appId }] });
    await browser.pause(5000);
  } catch (error) {
    console.log('[add form field] error: --- ', error);
  }
};

export const moveField = async (kintoneClient, appId, toIndex: number, fromIndex: undefined | number = undefined) => {
  // get and update form layout
  const formLayoutRsp = await kintoneClient.app.getFormLayout({
    app: appId,
  });
  const layout = formLayoutRsp.layout;
  if (fromIndex === undefined) {
    fromIndex = layout.length - 1;
  }
  const element = layout.splice(fromIndex, 1)[0];
  layout.splice(toIndex, 0, element);
  try {
    console.log('[move field] updateFormLayout');
    await kintoneClient.app.updateFormLayout({ app: appId, layout: layout });
    console.log('[move field] deployApp');
    await kintoneClient.app.deployApp({ apps: [{ app: appId }] });
    await browser.pause(5000);
  } catch (error) {
    console.log('[move field] error: --- ', error);
  }
};

export const removeFormField = async (kintoneClient, appId, fields) => {
  try {
    console.log('[remove form field] deleteFormFields');
    await kintoneClient.app.deleteFormFields({ app: appId, fields: fields });
    console.log('[remove form field] deployApp');
    await kintoneClient.app.deployApp({ apps: [{ app: appId }] });
    await browser.pause(5000);
  } catch (error) {
    console.log('[remove form field] error: --- ', error);
  }
};

export const saveFormLayoutJson = async (kintoneClient, appInfo) => {
  const formLayoutRsp = await kintoneClient.app.getFormLayout({
    app: appInfo.testingAppId,
  });
  const formLayoutJson = JSON.stringify(formLayoutRsp);
  const expectedFilePath = path.join(process.cwd(), '/resources/multi-tab/form', 'formLayout.json');
  await fs.writeFile(expectedFilePath, formLayoutJson, { encoding: 'utf8' });
};

export const saveFormFieldsJson = async (kintoneClient, appInfo) => {
  const formFieldsRsp = await kintoneClient.app.getFormFields({
    app: appInfo.testingAppId,
  });
  const formFieldsJson = JSON.stringify(formFieldsRsp);
  const expectedFilePath = path.join(process.cwd(), '/resources/multi-tab/form', 'formFields.json');
  await fs.writeFile(expectedFilePath, formFieldsJson, { encoding: 'utf8' });
};
