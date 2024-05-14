import PropTypes from "prop-types";
import UploadBtn from "@components/vendors/show_view/file_upload_btn/btn";

export default function StepOne({
  setCurrentStep = function () {},
  setBatchFiles = function () {},
}) {
  const onFileUploaded = (response) => {
    setBatchFiles(response);
    setCurrentStep(1);
  };

  return <UploadBtn onFileUploaded={onFileUploaded} />;
}

StepOne.propTypes = {
  setCurrentStep: PropTypes.func,
  setBatchFiles: PropTypes.func,
};
