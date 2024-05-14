import {client as filestack} from "filestack-react";
import React, {useEffect} from "react";

const usePicker = (_ref) => {
  const {apikey} = _ref;
  const _ref$pickerOptions = _ref.pickerOptions;
  const pickerOptions =
    _ref$pickerOptions === undefined ? {} : _ref$pickerOptions;
  const _ref$clientOptions = _ref.clientOptions;
  const clientOptions =
    _ref$clientOptions === undefined ? {} : _ref$clientOptions;
  const _ref$onSuccess = _ref.onSuccess;
  // eslint-disable-next-line no-console
  const onSuccess = _ref$onSuccess === undefined ? console.log : _ref$onSuccess;
  const _ref$onError = _ref.onError;
  // eslint-disable-next-line no-console
  const onError = _ref$onError === undefined ? console.error : _ref$onError;

  const _onError = (error) => {
    onError(error);
  };
  const _onSuccess = (result) => {
    onSuccess(result);
  };
  const rootId = "asset-root";
  const containerId = "asset-container";
  const picker = filestack.Filestack(apikey, clientOptions).picker({
    ...pickerOptions,
    rootId,
    container: `#${containerId}`,
    onUploadDone: _onSuccess,
  });

  useEffect(() => {
    picker.open().then().catch(_onError);
    return () => {
      if (picker) {
        picker.close();
      }
    };
  }, []);
  return {
    containerId,
  };
};

const FilestackPicker = (_ref) => {
  const {apikey, pickerOptions, clientOptions, onSuccess, onError} = _ref;

  const _usePicker = usePicker({
    apikey,
    pickerOptions: {
      ...pickerOptions,
      displayMode: filestack.PickerDisplayMode.inline,
    },
    clientOptions,
    onSuccess,
    onError,
  });
  const {containerId} = _usePicker;
  return <div id={containerId} style={{height: "500px"}} />;
};

export default FilestackPicker;
