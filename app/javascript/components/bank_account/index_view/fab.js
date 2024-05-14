// import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import {makeStyles} from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

const FabComponent = () => {
  const cl = useStyles();
  return (
    <Fab
      className={cl.root}
      color="secondary"
      aria-label="edit"
      href="/bank_accounts/new"
      data-cy="add-btn"
    >
      <AddIcon />
    </Fab>
  );
};

const useStyles = makeStyles(() => ({
  root: {
    position: "fixed",
    bottom: "4vh",
    right: "1.25vw",
    color: "white",
  },
}));

export default FabComponent;
