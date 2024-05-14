/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import {DataGrid} from "@material-ui/data-grid";

// components
import EmptyMessage from "./empty_message";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import IconButton from "@material-ui/core/IconButton";

import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ShowIcon from "@material-ui/icons/FindInPage";

const Statements = ({statements = [], newPath = "", classes = {}}) => {
  const columns = [
    {
      field: "startedAt",
      headerName: "Period",
      width: 175,
      disableClickEventBubbling: true,
      valueGetter: ({row: {startedAt, endedAt} = {}}) => {
        return `${startedAt} - ${endedAt}`;
      },
    },
    {
      field: "endingBalance",
      headerName: "Balance",
      align: "right",
      width: 100,
      disableClickEventBubbling: true,
    },
    {
      field: "creatorName",
      headerName: "Preparer",
      align: "center",
      flex: 1,
      disableClickEventBubbling: true,
    },
    {
      field: "approverName",
      headerName: "Approver",
      align: "center",
      flex: 1,
      disableClickEventBubbling: true,
    },
    {
      field: "approved",
      headerName: "Approved",
      align: "center",
      width: 108,
      renderCell: ApprovedColumn,
      disableClickEventBubbling: true,
      renderHeader: CenteredHeader,
    },
    {
      field: "path",
      renderHeader: () => (
        <Button startIcon={<AddIcon />} href={newPath} target="_blank">
          Reconciliation
        </Button>
      ),
      width: 185,
      filterable: false,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: DefaultLinkRenderer,
    },
  ];

  return (
    <Paper elevation={1} component="section" className={classes.root}>
      <DataGrid
        rows={statements}
        columns={columns}
        rowhHeight={36}
        density="dense"
        hideFooter={statements.length < 25}
        components={{
          NoRowsOverlay: EmptyMessage(newPath),
        }}
        classes={{
          columnSeparator: classes.columnSeparator,
        }}
      />
    </Paper>
  );
};

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "calc(100vh - 270px - 1rem)",
    marginTop: theme.spacing(2),
  },
  columnSeparator: {
    display: "none",
  },
});

Statements.propTypes = {
  newPath: PropTypes.string,
  slug: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  classes: PropTypes.object.isRequired,
  statements: PropTypes.arrayOf(PropTypes.object),
};

export default withStyles(styles)(Statements);

// TABLE CELLS
//------------------------------------------------------------------------------

const ApprovedColumn = ({value: approved}) => {
  const style = {fill: "#8bc34a"};
  return approved ? <CheckCircleIcon style={style} /> : <div />;
};

ApprovedColumn.propTypes = {
  value: PropTypes.bool,
};

const DefaultLinkRenderer = ({
  row: {
    path,
    editPath,
    permissions: {show: canView, edit: canEdit, delete: canDelete} = {},
  } = {},
}) => {
  const styles = {
    show: {
      color: "#00BCD4",
      height: "auto",
      width: "auto",
      borderRadius: "5px",
      padding: "3px",
    },
    edit: {
      color: "#8BC34A",
      height: "auto",
      width: "auto",
      borderRadius: "5px",
      padding: "3px",
    },
    delete: {
      color: "#E53935",
      height: "auto",
      width: "auto",
      borderRadius: "5px",
      padding: "3px",
    },
    spacer: {
      width: 27,
      height: 27,
      display: "block",
    },
  };

  return (
    <div
      className="btn-group"
      style={{
        aligntItems: "center",
        justifyContent: "flex-end",
        flexGrow: 1,
      }}
    >
      {canView && (
        <IconButton
          component="a"
          href={path}
          rel="nofollow"
          style={styles.show}
          target="_blank"
        >
          <ShowIcon />
        </IconButton>
      )}
      {canEdit && (
        <IconButton
          component="a"
          href={editPath}
          target="_blank"
          rel="nofollow"
          style={styles.edit}
        >
          <EditIcon />
        </IconButton>
      )}
      {canDelete && (
        <IconButton
          component="a"
          href={path}
          color="secondary"
          data-confirm="Are you sure?"
          data-method="delete"
          rel="nofollow"
          style={styles.delete}
          target="_blank"
        >
          <DeleteIcon />
        </IconButton>
      )}
      {!canDelete && <span style={styles.spacer}>&nbsp;</span>}
    </div>
  );
};

DefaultLinkRenderer.propTypes = {
  row: PropTypes.shape({
    path: PropTypes.string,
    editPath: PropTypes.string,
    permissions: PropTypes.shape({
      view: PropTypes.bool,
      edit: PropTypes.bool,
      delete: PropTypes.bool,
    }),
  }),
};

const CenteredHeader = ({colDef: {headerName} = {}}) => {
  const styles = {
    textAlign: "center",
    width: "100%",
    display: "block",
    fontWeight: 500,
  };
  return <b style={styles}>{headerName}</b>;
};

CenteredHeader.propTypes = {
  colDef: PropTypes.shape({
    headerName: PropTypes.string,
  }),
};
