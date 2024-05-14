import PropTypes from "prop-types";
import {useState} from "react";
import {compose} from "redux";
import {withStyles} from "@material-ui/core/styles";
import {withHandlers, withStateHandlers} from "recompose";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import EditIcon from "@material-ui/icons/Edit";
import PaymentIcon from "@material-ui/icons/LocalAtm";
import ChargeIcon from "@material-ui/icons/CreditCard";

const Fab = ({hidden = false, account_id, classes = {}}) => {
  const [open, setOpenValue] = useState(false);
  let isTouch;
  if (typeof document !== "undefined") {
    isTouch = "ontouchstart" in document.documentElement;
  }

  const handleClose = () => {
    setOpenValue(false);
  };

  const handleClick = path => e => {
    e.stopPropagation();
    window.location = path;
  };

  const handleOpen = () => {
    setOpenValue(true);
  };

  return (
    <SpeedDial
      ariaLabel="Edit Credit Card"
      className={classes.speedDial}
      classes={{fab: classes.speedDialBtn}}
      hidden={hidden}
      icon={<SpeedDialIcon openIcon={<EditIcon />} />}
      onBlur={handleClose}
      onClick={handleClick(`/credit_cards/${account_id}/edit`)}
      onClose={handleClose}
      onFocus={handleOpen}
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      open={open}
      direction="up"
    >
      <SpeedDialAction
        key={1}
        icon={<PaymentIcon />}
        tooltipTitle="+ Charge"
        onClick={handleClick(`/credit_cards/${account_id}/charges/new`)}
      />
      <SpeedDialAction
        key={2}
        icon={<ChargeIcon />}
        tooltipTitle="+ Payment"
        onClick={handleClick(`/credit_cards/${account_id}/payments/new`)}
      />
    </SpeedDial>
  );
};

Fab.propTypes = {
  account_id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  hidden: PropTypes.bool,
  open: PropTypes.bool,
  handleOpen: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  speedDial: {
    position: "fixed",
    right: "23px",
    bottom: "23px",
    paddingTop: "15px",
    marginBottom: "0",
    zIndex: "997",

    "&  > button": {
      backgroundColor: "#4CAF50",

      "& + div > button:first-child": {
        color: "white",
        backgroundColor: "#2196F3",
        marginTop: "1em",
      },

      "& + div > button:last-child": {
        color: "white",
        backgroundColor: "#FFCA28",
      },
    },
  },

  speedDialBtn: {
    backgroundColor: "#4CAF50",

    "&:hover": {
      backgroundColor: "#43A047",
    },
  },
});

export default compose(
  withStyles(styles),
  withStateHandlers(
    ({initialOpen = false}) => ({
      open: initialOpen,
    }),
    {
      handleClose: () => () => {
        return {open: false};
      },
      handleOpen: () => () => {
        return {open: true};
      },
    }
  ),
  withHandlers({
    handleClick: _props => path => _e => {
      window.location = path;
    },
  })
)(Fab);
