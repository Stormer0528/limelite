import {useEffect} from "react";
import PropTypes from "prop-types";
import {useFormikContext} from "formik";
import {withStyles} from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import BankIcon from "../../shared/icons/bank_account_icon";
import CreditIcon from "../../shared/icons/credit_card_icon";

import CurrencyColumn from "../../searchable_table/components/defaults/currency_column";
import ViewLinksRenderer from "../../searchable_table/components/defaults/view_links_renderer";
import SearchableTable from "../../searchable_table/searchable_table";

const Statements = ({
  refetch = function () {},
  reconciliations = [],
  loading = false,
}) => {
  const {
    values: {statementableId, statementableType} = {},
  } = useFormikContext();
  useEffect(() => {
    refetch({variables: {statementableId, statementableType}});
  }, [statementableId, statementableType, refetch]);

  const reconciliationsWithPath = reconciliations.map((rec) => ({
    ...rec,
    path: `/reconciliations/${rec.id}`,
  }));

  return (
    <Fade in={!loading}>
      <SearchableTable
        data={reconciliationsWithPath}
        listLength={reconciliationsWithPath.length}
        headers={[
          "Account",
          "Period",
          "Balance",
          "Preparer",
          "Approver",
          "Approved",
          "",
        ]}
        cells={[
          AccountCell,
          PreparerCell,
          CurrencyColumn("endingBalance"),
          "creatorName",
          "approverName",
          ApprovedColumn,
          ViewLinksRenderer({
            showView: true,
            showDelete: false,
            showEdit: false,
            columnWidth: 35,
            flexGrow: 0,
          }),
        ]}
      />
    </Fade>
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
    marginTop: "1rem",
  },
});

Statements.propTypes = {
  reconciliations: PropTypes.array,
  loading: PropTypes.bool,
  refetch: PropTypes.func.isRequired,
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

const AccountCell = ({
  rowData: {statementable: {name, __typename: accountType} = {}} = {},
}) => {
  const Icon = accountType === "CreditCard" ? CreditIcon : BankIcon;
  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <Icon />
      <span style={{display: "inline-block", marginLeft: ".5rem"}}>{name}</span>
    </div>
  );
};

AccountCell.propTypes = {
  rowData: PropTypes.shape({
    statementable: PropTypes.shape({
      name: PropTypes.string,
      __typename: PropTypes.string,
    }),
  }),
};
