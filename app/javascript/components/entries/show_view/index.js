import {Fragment} from "react";
import {makeStyles} from "@material-ui/core/styles";
import PropTypes from "prop-types";
import {useQuery} from "react-apollo";
import clsx from "clsx";

import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import EditIcon from "@material-ui/icons/Edit";

import EntryIcon from "../../shared/icons/entry_icon";
import DuplicateIcon from "@material-ui/icons/FileCopyOutlined";

import Entry from "../../shared/entry_modal/entry";
import ChecksTable from "./checks_table";
import InvoiceCard from "./invoice_card";
import CreditCardItemsTable from "./credit_card_items_table";
import PaymentsTable from "./payments_table";
import ApprovalFooter from "../../shared/approval_footer";

import ENTRY_QUERY from "../../../graphql/queries/entry_show.gql";

const ShowView = () => {
  const classes = useStyles();
  const entry_id = window.location.pathname.split("/")[2];
  const {
    loading,
    data: {entry = {}, entry: {permissions: {edit: canEdit} = {}} = {}} = {},
  } = useQuery(ENTRY_QUERY, {
    fetchPolicy: "network-only",
    variables: {entry_id},
  });

  if (loading) {
    return null;
  }

  return (
    <Fragment>
      <Paper className={classes.root}>
        <Typography variant="h3" className={classes.header}>
          <EntryIcon />
          <div className="text">Entry</div>
          <Button
            href={`${window.location.pathname}/duplicate`}
            startIcon={<DuplicateIcon />}
          >
            Duplicate
          </Button>
        </Typography>

        <Entry entry={entry} />

        <ApprovalFooter
          className={classes.approvalFooter}
          modelType="Entry"
          {...entry}
        />
      </Paper>

      {entry.bankAccountItems.length > 0 && (
        <ChecksTable checks={entry.bankAccountItems} />
      )}

      {entry.creditCardItems.length > 0 && (
        <CreditCardItemsTable checks={entry.creditCardItems} />
      )}

      {entry.payments.length > 0 && <PaymentsTable payments={entry.payments} />}

      {entry.invoice && <InvoiceCard invoice={entry.invoice} />}

      {canEdit && (
        <Fab
          className={classes.fab}
          color="secondary"
          aria-label="edit"
          id="editBtn"
          href={entry.editPath}
        >
          <EditIcon />
        </Fab>
      )}
    </Fragment>
  );
};

ShowView.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

const useStyles = makeStyles((theme) => ({
  root: {},
  header: {
    display: "flex",
    fontSize: 24,
    alignItems: "center",
    lineHeight: "32px",
    borderBottom: "1px solid #ECEFF1",
    padding: "8px 16px",

    "& svg": {
      marginRight: ".5rem",
    },

    "& > div.text": {
      flexGrow: 1,
      marginRight: "1rem",
    },
  },
  approvalFooter: {
    padding: "8px 0 8px 8px",
    width: "100%",
  },
  fab: {
    position: "fixed",
    right: 23,
    bottom: 23,
    zIndex: 997,
  },
}));

export default ShowView;
