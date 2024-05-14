import PropTypes from "prop-types";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Address from "../../../shared/address";

import AddressQuery from "../../../../graphql/queries/address_search.gql";
import {useQuery} from "@apollo/react-hooks";
import {withStyles} from "@material-ui/core/styles";

const AddressSelector = ({
  value = "",
  name = "addressId",
  disabled = false,
  readOnly = false,
  addressableIds,
  addressableType,
  onChange = function() {},
  classes = {},
}) => {
  const filteredIds = addressableIds.filter(Boolean);
  const {data: {address, addressSearch = []} = {}} = useQuery(AddressQuery, {
    variables: {addressableIds: filteredIds, addressableType, value},
    fetchPolicy: "network-only",
  });

  return (
    <div className={classes.root}>
      <TextField
        id="address_id"
        select
        fullWidth
        label="Address"
        disabled={disabled}
        value={value || ""}
        onChange={onChange}
        SelectProps={{
          readOnly,
          classes: {root: classes.menu, disabled: classes.selectDisabled},
          inputProps: {
            name: name,
          },
        }}
      >
        {addressSearch.map(address => (
          <MenuItem
            key={address.id}
            value={address.id}
            className={classes.menuItem}
          >
            <Address {...address} />
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

AddressSelector.propTypes = {
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  readOnly: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  addressableIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  addressableType: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    display: "flex",
    width: "100%",
  },
  menu: {
    width: "100%",
    maxWidth: "100%",
  },
  menuItem: {
    display: "grid",
    gridTemplateColumns: "1fr",
    height: "auto",
    width: "15rem",
    maxWidth: "15rem",
    paddingBottom: ".75rem",

    "& .line-3 .state": {
      display: "inline-block",
      margin: "0 .35rem",
      textTransform: "uppercase",
    },
  },
  selectDisabled: {color: "#333"},
});
export default withStyles(styles)(AddressSelector);
