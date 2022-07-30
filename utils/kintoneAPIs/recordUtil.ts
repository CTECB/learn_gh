import _ from 'lodash';

export const getRecord = async (kintoneClient, appId, recordId) => {
  try {
    console.log(`[get record ${recordId}] getRecord`);
    return kintoneClient.record.getRecord({
      app: appId,
      id: recordId,
    });
  } catch (error) {
    console.log('[get record] error: --- ', error);
  }
};

/**
 * Get json object of form fields and form layout from "Form layout and form field JSON file" field of "kintone-plugin Acceptance Test Management" app
 */
export const getFormFieldsAndLayoutJsonObject = async (kintoneClient, appId, recordId) => {
  const { record } = await kintoneClient.record.getRecord({
    app: appId,
    id: recordId,
  });
  const jsonFileValue = record['appFormJsonFile'].value;
  if (jsonFileValue.length < 2) {
    throw new Error('There is no field or form layout json file!');
  }

  const formFieldsJsonFileItem = _.filter(jsonFileValue, ['name', 'formFields.json'])[0];
  const formLayoutJsonFileItem = _.filter(jsonFileValue, ['name', 'formLayout.json'])[0];
  const formFieldsJsonFileKey = formFieldsJsonFileItem['fileKey'];
  const formLayoutJsonFileKey = formLayoutJsonFileItem['fileKey'];
  const formFieldsArrayBuffer = await kintoneClient.file.downloadFile({
    fileKey: formFieldsJsonFileKey,
  });
  const formLayoutArrayBuffer = await kintoneClient.file.downloadFile({
    fileKey: formLayoutJsonFileKey,
  });

  const textDecoder = new TextDecoder('utf-8');
  const formFieldsJsonObject = JSON.parse(textDecoder.decode(formFieldsArrayBuffer));
  const formLayoutJsonObject = JSON.parse(textDecoder.decode(formLayoutArrayBuffer));

  return {
    formFieldsJsonObject: formFieldsJsonObject,
    formLayoutJsonObject: formLayoutJsonObject
  };
};

/**
 * Get testing app url from "Testing app URL" field of "kintone-plugin Acceptance Test Management" app
 */
export const getTestingAppURL = async (kintoneClient, appId, recordId) => {
  let getRecordRsp = {};
  try {
    getRecordRsp = await kintoneClient.record.getRecord({
      app: appId,
      id: recordId,
    });
  } catch (error) {
    console.log('[getTestingAppURL: get record] error: --- ', error);
  }
  // @ts-ignore
  return getRecordRsp.record['txtTestingAppUrl'].value;
};
