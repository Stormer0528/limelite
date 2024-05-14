import {useState, useCallback} from "react";
import PropTypes from "prop-types";
import {withStyles, makeStyles} from "@material-ui/core/styles";
import {format} from "date-fns/esm";
import isString from "lodash/isString";

import TextField from "../form/styled_textfield";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Avatar from "@material-ui/core/Avatar";

import UserIcon from "../../../shared/icons/user_icon";

const UserDropdown = ({
  options = [],
  loading = false,
  value,
  disabled,
  readOnly,
  label = "User",
  id = "users",
  onChange = function () {},
  name = "",
  classes = {},
  error,
  ...rest
}) => {
  const isDisabled = disabled || (loading && options.length === 0);
  const [selectedItem, setSelectedItem] = useState(
    options.find((options) => `${options.id}` === `${value}`)
  );

  const handleChange = useCallback(
    (_e, option) => {
      // Note: option can be null when value is cleared
      const {id = null} = option || {};
      setSelectedItem(options.find((user) => `${user.id}` === `${id}`));
      onChange({target: {value: id, name}});
    },
    [name, onChange, options]
  );

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  return (
    <Autocomplete
      {...rest}
      id={id}
      options={options}
      value={selectedItem || {}}
      loading={loading}
      disabled={isDisabled}
      readOnly={readOnly}
      onChange={handleChange}
      getOptionLabel={(option) => option.fullName || ""}
      renderInput={(params) => (
        <TextField {...params} label={label} fullWidth />
      )}
      getOptionSelected={(option, currentId) => {
        `${option.id}` === `${currentId}`;
      }}
    />
  );
};

const styles = () => ({
  option: {
    borderTop: "1px solid #eee",
    padding: "8px",
  },
  readonlyAvatar: {},
  readonlyTitle: {
    fontSize: "1.15REM",
    margin: ".75rem 0 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    "& b": {
      color: "#546E7A",
    },

    "& svg": {
      marginRight: ".35rem",
      color: "#607D8B",
    },
  },
});

UserDropdown.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  loading: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userPath: PropTypes.string,
  vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  classes: PropTypes.object.isRequired,
  options: PropTypes.array,
  label: PropTypes.string,
  id: PropTypes.string,
};

export default withStyles(styles)(UserDropdown);

const Option = ({number, amount, date, dueDate}) => {
  const classes = useOptionStyles();

  return (
    <div className={classes.root}>
      <div className={classes.row1}>
        <Avatar className={classes.avatar}>
          <UserIcon />
        </Avatar>
        <div className={classes.cell}>&nbsp;{number}</div>
        <div className={classes.cell}>
          <b>Amount:</b>
          &nbsp;{amount}
        </div>
      </div>
      <div className={classes.row2}>
        <div className={classes.cell}>
          <b>Date:&nbsp;</b>
          {date ? format(date, "MM/dd/yyyy") : ""}
        </div>
        {dueDate && (
          <div className={classes.cell}>
            <b>Due:</b>
            &nbsp;{dueDate ? format(dueDate, "MM/dd/yyyy") : ""}
          </div>
        )}
      </div>
    </div>
  );
};

const useOptionStyles = makeStyles({
  root: {
    display: "grid",
    gridRowGap: "4px",
    gridTemplateRows: "25px 2em",
    width: "100%",
  },
  avatar: {
    height: "25px !important",
    width: "25px !important",

    "& > svg": {
      height: "15px !important",
      width: "15px !important",
    },
  },
  row1: {
    display: "grid",
    gridTemplateColumns: "25px max-content 1fr",
    gridColumnGap: "8px",
    width: "100%",

    "& b": {
      color: "#455A64",
    },
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    width: "100%",
    color: "#616161",

    "& b": {
      color: "#455A64",
    },
    "& > div": {
      display: "flex",
      justifyContent: "space-between",
    },
  },
  cell: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    alignContent: "center",

    "&:last-of-type": {
      justifyContent: "flex-end",
    },
  },
});

Option.propTypes = {
  number: PropTypes.string,
  amount: PropTypes.string,
  date: PropTypes.string,
  dueDate: PropTypes.string,
  error: PropTypes.any,
  classes: PropTypes.object,
};

// HELPER FUNCTIONS
//-------------------------------------------------------------------------
const getOptionLabel = (option) => {
  if (isString(option)) {
    return option;
  }

  return option.number || "";
};
