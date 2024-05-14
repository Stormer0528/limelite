import {useState, useCallback} from "react";
import {makeStyles} from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import UserIcon from "@material-ui/icons/PersonAdd";
import UserGroupIcon from "../shared/icons/user_group_icon";
import {connect} from "react-redux";

function Fab({ onAddGroup, groups }) {
  const [open, setIsOpen] = useState(false);
  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, [setIsOpen]);
  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const addGroup = () => {
    onAddGroup();
    handleClose();
  };

  const classes = useStyles();
  return (
    <SpeedDial
      ariaLabel="Add User"
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      className={classes.speedDial}
    >
      <SpeedDialAction
        icon={<UserIcon />}
        onClick={handleClose}
        component="a"
        href="/admin/users/new"
        tooltipTitle="Add User"
      />
      <SpeedDialAction
        icon={<UserGroupIcon />}
        tooltipTitle="Add Group"
        onClick={addGroup}
        disabled={!!groups}
        component="a"
      />
    </SpeedDial>
  );
}

const mapStateToProps = (state) => {
  const {groups: { groups = {}} = {}} = state;
  return {
    groups
  };
};

export default connect(mapStateToProps)(Fab);

const useStyles = makeStyles((theme) => ({
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1,
  },
  speedDial: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));
