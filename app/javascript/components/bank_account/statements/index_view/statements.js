import PropTypes from "prop-types";

// components
import EmptyMessage from "./empty_message";

import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";

import CurrencyColumn from "../../../searchable_table/components/defaults/currency_column";
import ViewLinksRenderer from "../../../searchable_table/components/defaults/view_links_renderer";
import SearchableTable from "../../../searchable_table/searchable_table";

const Statements = (props) => {
  const {
    account_id,
    loading = false,
    statements = [],
    classes = {},
    ...rest
  } = props;

  const new_path = `/bank_accounts/${account_id}/reconciliations/new`;

  return (
    <section className={`Statements ${classes.sectionContainer}`} {...rest}>
      {!loading && statements.length > 0 && (
        <Fade in={!loading}>
          <Paper style={{position: "relative"}}>
            <Button href={new_path} className={classes.link} variant="outlined">
              + Reconciliation
            </Button>
            <SearchableTable
              data={statements}
              listLength={statements.length}
              headers={[
                "Period",
                "Balance",
                "Preparer",
                "Approver",
                "Approved",
                "",
              ]}
              cells={[
                PreparerCell,
                CurrencyColumn("endingBalance"),
                "creatorName",
                "approverName",
                ApprovedColumn,
                ViewLinksRenderer({
                  editPathProperty: "editPath",
                  showView: true,
                  showDelete: true,
                  columnWidth: 75,
                  flexGrow: 0,
                }),
              ]}
            />
          </Paper>
        </Fade>
      )}

      {/*  EMPTY  MESSAGE */}
      {!loading && statements.length < 1 && (
        <Fade in={!loading}>
          <EmptyMessage {...{new_path}} />
        </Fade>
      )}
    </section>
  );
};

const styles = (theme) => ({
  link: {
    position: "absolute",
    top: "0.4em",
    zIndex: 99,
    right: ".5em",
  },
  sectionContainer: {
    position: "relative",
  },
});

Statements.propTypes = {
  account_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  loading: PropTypes.bool,
  statements: PropTypes.array,
  numSelected: PropTypes.number,
  rowCount: PropTypes.number,
  onSelectAllClick: PropTypes.func,
  column: PropTypes.string,
  direction: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Statements);

// TABLE CELLS
//------------------------------------------------------------------------------

const PreparerCell = ({rowData: {startedAt, endedAt} = {}}) => (
  <div>{`${startedAt} – ${endedAt}`}</div>
);
PreparerCell.columnWidth = 85;
PreparerCell.disableSort = false;

PreparerCell.propTypes = {
  rowData: PropTypes.shape({
    startedAt: PropTypes.string,
    endedAt: PropTypes.string,
  }),
};

// APPROVED COLUMN
//------------------------------------------------------------------------------
const ApprovedColumn = ({rowData: {approved}}) => {
  return approved ? (
    <div className="green-text" style={{marginLeft: "2.75em"}}>
      <CheckCircleIcon />
    </div>
  ) : null;
};

ApprovedColumn.columnWidth = 85;

ApprovedColumn.propTypes = {
  rowData: PropTypes.shape({
    approved: PropTypes.bool,
  }),
};
