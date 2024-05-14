// Memo and Vendor/Customer fields for EntryItem
//------------------------------------------------------------------------------
import PropTypes from "prop-types";
import {FastField} from "formik";
import {TextField} from "formik-material-ui";

import VendorCustomerInput from "../../../shared/vendor_customer_input";

const MemoRow = ({
  current,
  handleBlur,
  handleVendorChange,
  name,
  payableId,
  payableType,
  disabled,
  readOnly,
  ...rest
}) => {
  return (
    <div {...rest}>
      <FastField
        component={TextField}
        name={`${name}.memo`}
        placeholder="Memo"
        fullWidth
        disabled={disabled}
        readOnly={readOnly}
      />

      <VendorCustomerInput
        {...{
          payableId: payableId || "",
          payableType,
          current,
          disabled,
          readOnly,
          handleChange: handleVendorChange,
          handleBlur,
        }}
      />
    </div>
  );
};

MemoRow.propTypes = {
  current: PropTypes.bool,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  handleVendorChange: PropTypes.func,
  name: PropTypes.string,
  payableId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  payableType: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
};

export default MemoRow;
