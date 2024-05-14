import PropTypes from "prop-types";
// import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import {withStyles} from "@material-ui/core/styles";
import ADDRESS_QUERY from "../../../../graphql/queries/vendor_address_search.gql";

import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const AddressDropdown = ({
  vendor_id,
  value,
  classes = {},
  onChange = function() {},
  disabled = false,
  errors = {},
  touched = {},
  ...rest
}) => {
  const {loading = true, data: {addressSearch = []} = {}} = useQuery(
    ADDRESS_QUERY,
    {
      variables: {vendor_id},
      fetchPolicy: "network-only",
    }
  );

  if (loading) {
    return null;
  }

  return (
    <TextField
      id="address-id"
      select
      fullWidth
      label="Address"
      disabled={disabled}
      value={value || ""}
      onChange={onChange}
      className={classes.select}
      error={!!errors.addressId && !!touched.addressId}
      helperText={touched.addressId && errors.addressId}
      SelectProps={{
        inputProps: {
          name: "addressId",
        },
      }}
      {...rest}
    >
      {addressSearch.map(({id, name, line1, line2, city, state, zip}) => {
        return (
          <MenuItem value={id} key={id} className={classes.item}>
            <div className={classes.name + " name"}>{name}</div>
            <div className={classes.number + " number"}>{line1}</div>
            <div className={classes.number + " number"}>{line2}</div>
            <div className={classes.number + " number"}>
              {city}, {state} {zip}
            </div>
          </MenuItem>
        );
      })}
    </TextField>
  );
};

AddressDropdown.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  touched: PropTypes.object,
  vendor_id: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  item: {
    flexDirection: "column",
    height: "auto",
    minHeight: "72px",
    maxHeight: "96px",
  },
  name: {
    color: "#333",
    fontWeight: "500",
  },
  number: {
    color: "#666",
  },
  select: {
    "& .number": {
      display: "none",
    },
    "& .name": {
      fontWeight: "500",
    },
  },
});

export default withStyles(styles)(AddressDropdown);
