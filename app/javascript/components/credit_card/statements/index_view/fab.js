import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";

import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";

const FabLink = ({account_id}) => {
  const cl = useStyles();
  return (
    <Fab
      className={cl.fab}
      data-cy="cc-FabLink"
      aria-label="add"
      href={`/credit_cards/${account_id}/reconciliations/new`}
    >
      <AddIcon />
    </Fab>
  );
};

FabLink.propTypes = {
  account_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const useStyles = makeStyles((theme) => ({
  fab: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    backgroundColor: "#7BB872",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#9ccc65",
    },
  },
}));

export default FabLink;
