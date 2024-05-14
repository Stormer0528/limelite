import PropTypes from "prop-types";
import {useQuery} from "@apollo/react-hooks";

import MenuItem from "@material-ui/core/MenuItem";
import {withStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import CASH_ACCOUNTS_QUERY from "../../../../graphql/queries/cash_accounts_query.gql";
const AccountDropdown = ({
  classes = {},
  value,
  onChange = function() {},
  disabled = false,
  errors = {},
  touched = {},
  ...rest
}) => {
  const {loading = true, data: {cashAccounts = []} = {}} = useQuery(
    CASH_ACCOUNTS_QUERY,
    {
      fetchPolicy: "network-only",
    }
  );

  if (loading) {
    return null;
  }

  return (
    <TextField
      id="cash-account-id"
      select
      fullWidth
      label="Cash Account"
      required
      disabled={disabled}
      value={value || ""}
      onChange={onChange}
      className={classes.select}
      error={!!errors.cashAccountId && !!touched.cashAccountId}
      helperText={touched.cashAccountId && errors.cashAccountId}
      SelectProps={{
        inputProps: {
          name: "cashAccountId",
        },
      }}
      {...rest}
    >
      {cashAccounts.map(({id, name, code}) => {
        return (
          <MenuItem value={id} key={id} className={classes.item}>
            <div className={classes.name + " name"}>{name}</div>
            <div className={classes.number + " number"}>{code}</div>
          </MenuItem>
        );
      })}
    </TextField>
  );
};

AccountDropdown.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    height: "48px",
  },
  name: {
    color: "#333",
    fontWeight: "500",
  },
  number: {
    color: "#999",
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

export default withStyles(styles)(AccountDropdown);
