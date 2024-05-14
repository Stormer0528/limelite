import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {withStyles} from "@material-ui/core/styles";
import {createFilterOptions} from "@material-ui/lab/Autocomplete";

const filterOptions = createFilterOptions({
  matchFrom: "any",
  stringify: (option) => option.displayName,
});

const VendorSelector = ({
  value,
  vendors = [],
  loading = false,
  disabled = false,
  readOnly = false,

  /* Callbacks */
  onChange = function () {},
  name = "vendor_id",
  id = "vendor_id",
}) => {
  const currentValue = vendors.find(
    ({id} = {}) => id === value || id === String(value)
  );

  // Keep list from rendering with no options while fetching vendors
  if (loading) {
    return null;
  }

  return disabled && readOnly ? (
    <TextField
      label="Vendor"
      className="react-inputs"
      size="small"
      margin="none"
      hiddenLabel
      fullWidth
      {...{
        name,
        id,
        value: currentValue && currentValue.displayName,
        disabled,
        readOnly,
      }}
      InputLabelProps={{
        shrink: true,
        style: {
          transform: "translate(0, 8.5px) scale(0.75)",
        },
      }}
    />
  ) : (
    <Autocomplete
      {...{name, id, value, readOnly}}
      autoComplete
      autoHighlight
      blurOnSelect
      options={vendors}
      onChange={onChange}
      getOptionLabel={(option) => {
        const vendor = vendors.find(
          ({id} = {}) => String(id) === String(option)
        );
        return (vendor && vendor.displayName) || "";
      }}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label="Vendor"
            className="react-inputs"
            size="small"
            margin="none"
            hiddenLabel
            fullWidth
          />
        );
      }}
      renderOption={(option) => {
        return option.displayName;
      }}
      filterOptions={filterOptions}
      getOptionSelected={(option, currentId) => {
        return `${option.id}` === `${currentId}`;
      }}
    />
  );
};

VendorSelector.propTypes = {
  name: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  onChange: PropTypes.func.isRequired,
};

const styles = (theme) => ({});

export default withStyles(styles)(VendorSelector);
