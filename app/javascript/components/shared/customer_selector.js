import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

const CustomerSelector = ({
  value,
  customers = [],
  disabled = false,
  loading = false,
  readOnly = false,

  /* Callbacks */
  onChange = function () {},
  name = "customer_id",
  id = "customer_id",
}) => {
  const currentValue = customers.find(({id} = {}) => id === value);

  // Keep list from rendering with no options while fetching options
  if (loading) {
    return null;
  }

  return disabled && readOnly ? (
    <TextField
      label="Customer"
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
      options={customers}
      autoHighlight
      onChange={onChange}
      {...{name, id, value}}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            label="Customer"
            className="react-inputs"
            size="small"
            margin="none"
            hiddenLabel
            fullWidth
          />
        );
      }}
      getOptionLabel={(option) => {
        const customer = customers.find(({id} = {}) => id === option);
        return (customer && customer.displayName) || "";
      }}
      renderOption={(option) => option.displayName}
    />
  );
};

CustomerSelector.propTypes = {
  name: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,

  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  onChange: PropTypes.func.isRequired,
  paperStyles: PropTypes.object,
};

export default CustomerSelector;
