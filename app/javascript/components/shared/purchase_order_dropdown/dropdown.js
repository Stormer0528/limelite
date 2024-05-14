import {useState, useCallback, Fragment, useEffect} from "react";
import PropTypes from "prop-types";
import {withStyles, makeStyles} from "@material-ui/core/styles";
import {format} from "date-fns/esm";

import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Avatar from "@material-ui/core/Avatar";

import POIcon from "@material-ui/icons/FeaturedVideo";

const PurchaseOrderDropdown = ({
  purchaseOrders = [],
  loading = false,
  disabled,
  readOnly,
  value,
  onChange = function () {},
  name = "purchaseOrderId",
  purchaseOrderPath,
  classes = {},
}) => {
  const isDisabled = disabled || (loading && purchaseOrders.length === 0);
  const [selectedItem, setSelectedItem] = useState(
    purchaseOrders.find(
      (purchaseOrder) => `${purchaseOrder.id}` === `${value}`
    ) || {}
  );

  /* needed to update value after gql query returns */
  useEffect(() => {
    setSelectedItem(
      purchaseOrders.find(
        (purchaseOrder) => `${purchaseOrder.id}` === `${value}`
      ) || {}
    );
  }, [purchaseOrders]);

  const handleChange = useCallback(
    (_e, option) => {
      // Note: option can be null when value is cleared
      const {id = null} = option || {};
      setSelectedItem(
        purchaseOrders.find(
          (purchaseOrder) => `${purchaseOrder.id}` === `${id}`
        )
      );
      onChange({target: {value: id, name}});
    },
    [name, onChange, purchaseOrders]
  );

  return (
    <Fragment>
      {!readOnly && (
        <Autocomplete
          id="purchaseOrders"
          options={purchaseOrders}
          value={selectedItem || {}}
          loading={loading}
          disabled={isDisabled}
          readOnly={readOnly}
          onChange={handleChange}
          classes={{
            option: classes.option,
          }}
          getOptionLabel={(option) => {
            switch (typeof option) {
              case "string":
                return option;
              case "object":
                return option.number || "";
              default:
                return "";
            }
          }}
          renderInput={(params) => (
            <Fragment>
              <TextField
                {...params}
                label="Purchase Order"
                variant="outlined"
                fullWidth
                helperText={`${
                  (selectedItem &&
                    selectedItem.total &&
                    ["Amount: ", selectedItem.total].join("")) ||
                  ""
                }`}
              />
              <input
                type="hidden"
                name={name}
                value={(selectedItem && selectedItem.id) || ""}
              />
            </Fragment>
          )}
          renderOption={(option) => <Option {...option} />}
          getOptionSelected={(option, currentId) => {
            `${option.id}` === `${currentId}`;
          }}
        />
      )}
      {readOnly && selectedItem && (
        <h4 className={classes.readonlyTitle}>
          <POIcon />
          <b>Invoice:</b>
          &nbsp;
          <a href={purchaseOrderPath}>{selectedItem.number}</a>
        </h4>
      )}
    </Fragment>
  );
};

const styles = (theme) => ({
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

PurchaseOrderDropdown.propTypes = {
  purchaseOrders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  loading: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  purchaseOrderPath: PropTypes.string,
  vendorId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PurchaseOrderDropdown);

const Option = ({number, total: amount, date, dateNeeded}) => {
  const classes = useOptionStyles();

  return (
    <div className={classes.root}>
      <div className={classes.row1}>
        <Avatar className={classes.avatar}>
          <POIcon />
        </Avatar>
        <div className={classes.cell}>&nbsp;{number}</div>
        <div className={classes.cell}>
          <b>Amount:</b>
          &nbsp;{amount}
        </div>
      </div>
      <div className={classes.row2}>
        {date && (
          <div className={classes.cell}>
            <b>Date:&nbsp;</b>
            {date ? format(date, "MM/dd/yyyy") : ""}
          </div>
        )}
        {dateNeeded && (
          <div className={classes.cell}>
            <b>Needed:</b>
            &nbsp;{dateNeeded ? format(dateNeeded, "MM/dd/yyyy") : ""}
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
  total: PropTypes.string,
  date: PropTypes.string,
  dateNeeded: PropTypes.string,
  classes: PropTypes.object,
};
