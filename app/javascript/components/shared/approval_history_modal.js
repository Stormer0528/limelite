import PropTypes from "prop-types";
import {useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import SearchableTable from "../searchable_table/searchable_table";
import DateColumn from "../searchable_table/components/defaults/date_column";
import {makeStyles} from "@material-ui/styles";

import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import HistoryIcon from "@material-ui/icons/History";

const ApprovalHistoryModal = ({stateChangeLogs: logs = []}) => {
  const [open, setOpenValue] = useState(false);
  const handleClose = () => {
    setOpenValue(false);
  };

  const handleOpen = () => {
    setOpenValue(true);
  };
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Tooltip title="Approval History" placement="top">
        <IconButton onClick={handleOpen}>
          <HistoryIcon />{" "}
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="approval-history-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="approval-history-dialog-title">
          <div className={classes.header}>
            <HistoryIcon /> &nbsp;&nbsp;Approval History
          </div>
        </DialogTitle>
        <SearchableTable
          style={{width: "850px"}}
          data={logs}
          headers={["Date", "Action", "Reason"]}
          cells={[
            DateColumn("createdAt", {columnWidth: 100, flexGrow: 0}),
            ReasonRow,
            "reason",
          ]}
        />
      </Dialog>
    </div>
  );
};

ApprovalHistoryModal.propTypes = {
  stateChangeLogs: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string,
      fromState: PropTypes.string,
      toState: PropTypes.string,
    })
  ),
};

const useStyles = makeStyles(() => ({
  header: {
    display: "flex",
    alignItems: "center",
  },
}));

export default ApprovalHistoryModal;

// TABLE CELLS
const ReasonRow = ({
  rowData: {
    user: {fullName = "Unknown user"} = {},
    loggableType,
    fromState,
    toState,
  },
}) => {
  return (
    <div>
      {`${fullName} updated ${loggableType} from `}
      <b>{fromState}</b>
      <span>&nbsp;to&nbsp;</span>
      <b>{toState}</b>
    </div>
  );
};

ReasonRow.propTypes = {
  rowData: PropTypes.shape({
    loggableType: PropTypes.string,
    fromState: PropTypes.string,
    toState: PropTypes.string,
    user: PropTypes.shape({
      fullName: PropTypes.string,
    }),
  }),
};

ReasonRow.disableSort = false;
