import PropTypes from "prop-types";
import {useState} from "react";
import {withStyles} from "@material-ui/core/styles";

import SearchableTable from "../../searchable_table/searchable_table";
import TextColumn from "../../searchable_table/components/defaults/text_column";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

import HistoryIcon from "@material-ui/icons/History";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import NegativeIcon from "@material-ui/icons/HighlightOff";
import FileIcon from "@material-ui/icons/AssignmentReturned";

// Components
import Address from "../../shared/address";

const Ten99HistoryModal = ({
  security,
  tenNinetyNines = [],
  classes = {},
  ...rest
}) => {
  const [open, setOpenValue] = useState(false);
  const handleClose = () => {
    setOpenValue(false);
  };

  const handleOpen = () => {
    setOpenValue(true);
  };

  return (
    <div {...rest}>
      <Tooltip title="1099 History" placement="top">
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
          <div style={{display: "flex"}}>
            <HistoryIcon style={{position: "relative", top: "-.1em"}} />
            &nbsp;&nbsp;1099 History
          </div>
        </DialogTitle>
        <DialogContent>
          <div className={classes.table}>
            <SearchableTable
              rowHeight={90}
              style={{width: "850px"}}
              data={tenNinetyNines}
              headers={[
                "Year",
                "Required",
                "EIN",
                "EIN Type",
                "File",
                "Address",
              ]}
              cells={[
                TextColumn("year", {
                  align: "center",
                  columnWidth: 57,
                  flexGrow: 0,
                }),
                RequiredColumn,
                TextColumn("ein", {
                  columnWidth: 95,
                  flexGrow: 0,
                }),
                TextColumn("einType", {
                  columnWidth: 150,
                  flexGrow: 1,
                }),
                FileBtnColumn(security),
                AddressRow,
              ]}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

Ten99HistoryModal.propTypes = {
  tenNinetyNines: PropTypes.arrayOf(
    PropTypes.shape({
      createdAt: PropTypes.string,
      fromState: PropTypes.string,
      toState: PropTypes.string,
    })
  ),
  security: PropTypes.object,
  classes: PropTypes.object,
};

const styles = theme => ({
  root: {
    display: "flex",
    placeContent: "center",
  },
});

export default withStyles(styles)(Ten99HistoryModal);

// TABLE CELLS
const AddressRow = ({rowData: {address}}) => {
  return address ? <Address {...address} /> : null;
};

AddressRow.propTypes = {
  rowData: PropTypes.shape({
    address: PropTypes.object,
  }),
};

AddressRow.disableSort = true;
AddressRow.flexGrow = 2;

// RECONCILED COLUMN
//------------------------------------------------------------------------------
const RequiredColumn = ({rowData: {required}}) =>
  required ? (
    <div className="green-text center-align">
      <CheckCircleIcon />
    </div>
  ) : (
    <div className="red-text center-align">
      <NegativeIcon />
    </div>
  );

RequiredColumn.columnWidth = 100;
RequiredColumn.flexGrow = 0;

RequiredColumn.propTypes = {
  rowData: PropTypes.shape({
    required: PropTypes.bool,
  }),
};

const FileBtnColumn = ({policy, signature}) => ({rowData: {fileUrl}}) =>
  fileUrl ? (
    <IconButton href={fileUrl + `?policy=${policy}&signature=${signature}`}>
      <FileIcon />
    </IconButton>
  ) : null;

FileBtnColumn.columnWidth = 100;
FileBtnColumn.flexGrow = 0;

FileBtnColumn.propTypes = {
  rowData: PropTypes.shape({
    fileUrl: PropTypes.string,
  }),
};
