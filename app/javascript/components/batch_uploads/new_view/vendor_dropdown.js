import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function VendorDropdown({
  vendors = [],
  TextFieldProps = {},
  ...props
}) {
  return (
    <Autocomplete
      options={vendors.map((option) => option.displayName)}
      {...props}
      renderInput={(params) => {
        params.className = clsx(params.className, "browser-default");
        return (
          <TextField
            {...params}
            label="Vendor"
            margin="normal"
            {...TextFieldProps}
          />
        );
      }}
    />
  );
}

VendorDropdown.propTypes = {
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      displayName: PropTypes.string,
    })
  ),
};
