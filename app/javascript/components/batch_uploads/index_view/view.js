/* eslint-disable react/display-name */
import PropTypes from "prop-types";
import {titleCase} from "humanize-plus";
import {DataGrid} from "@material-ui/data-grid";

// components
import EmptyMessage from "./empty_message";
import DefaultLinkRenderer from "./default_link_renderer";
import Breadcrumb from "../breadcrumb";
import Toolbar from "./toolbar";

import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import {withStyles} from "@material-ui/core/styles";
import BatchUploadIcon from "@shared/icons/batch_upload_icon";

import {stateColor} from "@columns/state_cell_renderer";
import StateIcon from "@shared/state_icon";
import AddIcon from "@material-ui/icons/Add";

function IndexTableView({
  batchUploads = [],
  refetch = function () {},
  classes = {},
}) {
  const columns = [
    {
      field: "creatorName",
      headerName: "Creator",
      disableClickEventBubbling: true,
      flex: 1,
    },
    {
      field: "userGroupName",
      headerName: "Group",
      disableClickEventBubbling: true,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Created On",
      width: 125,
      type: "date",
      align: "center",
      disableClickEventBubbling: true,
    },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      width: 135,
      type: "date",
      align: "center",
      disableClickEventBubbling: true,
    },
    {
      field: "totalFiles",
      headerName: "Approved",
      description: "Total files approved",
      headerAlign: "center",
      align: "center",
      type: "number",
      width: 115,
      valueFormatter: ({row: {totalFiles, approvedFiles}}) =>
        `${approvedFiles} / ${totalFiles}`,
    },
    {
      field: "aasmState",
      headerName: "Status",
      renderCell: ({value}) => {
        const color = stateColor(value);
        return (
          <div style={{display: "flex", alignItems: "center", color}}>
            <StateIcon aasmState={value} style={{marginRight: ".5rem"}} />
            <b style={{color}}>{titleize(value)}</b>
          </div>
        );
      },
      width: 150,
    },
    {
      field: "path",
      renderHeader: () => <span />,
      align: "center",
      filterable: false,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (props) => (
        <DefaultLinkRenderer {...props} refetch={refetch} />
      ),
      width: 75,
    },
  ];

  return (
    <div className={classes.root}>
      <Breadcrumb />
      <h3 className={classes.title}>
        <BatchUploadIcon />
        Batch Uploads
        <Toolbar />
      </h3>

      <Paper elevation={1} component="section" className={classes.paper}>
        <DataGrid
          rows={batchUploads}
          columns={columns}
          rowHeight={40}
          headerHeight={40}
          density="dense"
          hideFooter={batchUploads.length < 25}
          classes={{
            columnSeparator: classes.columnSeparator,
          }}
          components={{
            NoRowsOverlay: EmptyMessage,
          }}
          disableColumnMenu
          disableColumnResize
        />
        <Fab
          color="secondary"
          aria-label="add"
          href="/batch_uploads/new"
          className={classes.fab}
        >
          <AddIcon />
        </Fab>
      </Paper>
    </div>
  );
}

const styles = (theme) => ({
  root: {},
  title: {
    display: "flex",
    alignItems: "center",

    "& > svg": {
      height: 42,
      width: 42,
      marginRight: 8,
    },
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    height: "calc(100vh - 270px - 1rem)",
    marginTop: theme.spacing(2),
  },
  columnSeparator: {
    display: "none",
  },
  fab: {
    position: "fixed",
    bottom: "16px",
    right: "16px",
    color: "#fff",
  },
});

IndexTableView.propTypes = {
  refetch: PropTypes.func.isRequired,
  classes: PropTypes.object,
  batchUploads: PropTypes.array,
};

export default withStyles(styles)(IndexTableView);

const titleize = (str = "") => titleCase(str.replace(/[-_]/g, " "));
