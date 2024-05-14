import PropTypes from "prop-types";

import ValidHeader from "./valid_header";
import InvalidHeader from "./invalid_header";

export const AccountHeader = ({
  id,
  name,
  valid,
  className,
  readOnly,
  ...rest
}) => {
  if (name && valid) {
    // Valid Account
    return <ValidHeader {...{name, readOnly, className}} />;
  } else if (valid === false) {
    // Invalid Account
    return <InvalidHeader {...{id, className, ...rest}} />;
  }

  // Empty Account
  return null;
};

AccountHeader.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  className: PropTypes.string,
  readOnly: PropTypes.bool,
  valid: PropTypes.bool,
};

export default AccountHeader;
