/* eslint-disable react/display-name */
import PropTypes from "prop-types";

import BatchUploadIcon from "@shared/icons/batch_upload_icon";
import DefaultEmptyMessage from "@shared/empty_message";

const EmptyMessage = () => {
  const newPath = "/batch_uploads/new";
  return (
    <DefaultEmptyMessage
      newPath={newPath}
      itemName="Upload"
      icon={BatchUploadIcon}
    />
  );
};

EmptyMessage.propTypes = {
  newPath: PropTypes.string,
};

export default EmptyMessage;
