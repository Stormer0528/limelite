import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import LinearProgress from "../linear_progress";
import ConfirmationBtn from "../confirmation_btn";

import {titleCase} from "humanize-plus";
import decamelize from "decamelize";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import StateIcon from "../state_icon";
import StateBtns from "../state_btn";

// Icons
import DeleteIcon from "@material-ui/icons/DeleteForever";

const SubmissionBar = ({
  handleSubmit = function () {},
  handleDelete = function () {},
  isOwner = false,
  isSubmitting = false,
  aasmState = "draft",
  hideDraft = false,
  hideDelete = false,
  disabled: isDisabled = false,
  check = false,
  permissions = {},
}) => {
  const classes = useStyles({aasmState});
  const disabled = isDisabled || isSubmitting;
  const submitHandler = (stateAction, reason) => (e) => {
    e && e.persist();
    handleSubmit({stateAction, reason, event: e});
  };

  return (
    <AppBar className={classes.root} component="footer">
      {isSubmitting && <LinearProgress />}
      <Toolbar className={classes.toolbar}>
        <h5 className={classes.currentState}>
          <b>Status:&nbsp;</b>
          <StateIcon aasmState={aasmState} />
          <span className={clsx(["state", aasmState])}>
            <span className="status">&nbsp;{formatState(aasmState)}</span>
          </span>
        </h5>
        <div className={classes.stateBtns}>
          <StateBtns
            isOwner={isOwner}
            createSubmitHandler={submitHandler}
            permissions={permissions}
            disabled={disabled}
            aasmState={aasmState}
            hideDraft={hideDraft}
            check={check}
          />
        </div>
        {!hideDelete && permissions.delete && (
          <ConfirmationBtn
            variant="outlined"
            onClick={handleDelete}
            disabled={disabled}
            className={classes.deleteBtn}
            message={"Are you sure you want to delete this record?"}
          >
            <DeleteIcon className={classes.icon} />
            Delete
          </ConfirmationBtn>
        )}
      </Toolbar>
    </AppBar>
  );
};

SubmissionBar.propTypes = {
  isOwner: PropTypes.bool,
  aasmState: PropTypes.string,
  check: PropTypes.bool,
  disabled: PropTypes.bool,
  hideDraft: PropTypes.bool,
  hideDelete: PropTypes.bool,
  isValidating: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  permissions: PropTypes.shape({
    delete: PropTypes.bool,
  }),
  handleSubmit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

const useStyles = makeStyles((theme) => {
  return {
    root: {
      top: "auto",
      bottom: 0,
      backgroundColor: "#cfd8dc",
    },
    toolbar: {
      minHeight: "48px",
      display: "flex",
      justifyContent: "flex-end",
    },
    progress: {
      height: "2px",
    },
    progressBar: {
      background: "#43A047",
    },
    stateBtns: {
      display: "flex",
    },
    currentState: {
      flexGrow: 1,
      margin: 0,
      fontSize: "16px",
      position: "relative",
      top: "0.125em",
      color: ({aasmState}) => theme.states[aasmState],
      display: "flex",
      justifyContent: "flex-start",
      paddingLeft: 8,
      alignItems: "center",

      "&.draft": {
        color: "#2196f3",
      },
      "&.approved": {
        color: "#4caf50",
      },
      "&.needs_revision": {
        color: "#ffb300",
      },

      "&.reversed": {
        color: "#f44336",
      },
      "& > b": {
        color: "black",
        display: "inline-block",
        marginRight: ".5rem",
      },
    },
    deleteBtn: {
      border: "1px solid #F44336",
      color: "#F44336",
      padding: "5px 8px 5px 4px",
      marginLeft: "1rem",

      "&:hover, &:focus": {
        color: "white",
        background: "#F44336",
      },
    },
    icon: {
      marginRight: theme.spacing(1),
    },
    printBtn: {
      maxWidth: "12.5em",
      color: "#008000",
      backgroundColor: "#E8F5E9",

      "&:focus": {
        backgroundColor: "#008000",
        color: "#dcedc8",
      },
      "&:hover": {
        color: "#E8F5E9",
        backgroundColor: "#008000",
      },
    },
    voidBtn: {
      color: "#D84315",
      border: "1px solid #D84315",
      background: "#f1e6e3",

      "&:hover": {
        color: "white",
        background: "#D84315",
      },
    },
    ...theme.approvalBtns,
  };
});

export default SubmissionBar;

function formatState(state) {
  return titleCase(decamelize(state, " ").replace(/_/, " "));
}
