/* eslint-disable react/display-name */
import PropTypes from "prop-types";

import StatementIcon from "@shared/icons/statement_icon";
import DefaultEmptyMessage from "@shared/empty_message";

const EmptyMessage = (newPath) => () => {
  return (
    <DefaultEmptyMessage
      newPath={newPath}
      itemName="Reconciliation"
      icon={StatementIcon}
    />
  );
};

EmptyMessage.propTypes = {
  newPath: PropTypes.string,
};

export default EmptyMessage;
