import _ from "lodash";

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

export const getFormFieldsAndLayoutJsonObject = async (kintoneClient, appId, recordId) => {
  const { record } = await kintoneClient.record.getRecord({
    app: appId,
    id: recordId,
  });
  const jsonFileValue = record['appFormJsonFile'].value;

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

  const textDecoder = new TextDecoder("utf-8");
  const formFieldsJsonObject = JSON.parse(textDecoder.decode(formFieldsArrayBuffer));
  const formLayoutJsonObject = JSON.parse(textDecoder.decode(formLayoutArrayBuffer));

  return {
    formFieldsJsonObject: formFieldsJsonObject,
    formLayoutJsonObject: formLayoutJsonObject
  };
};
