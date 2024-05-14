import PropTypes from "prop-types";
import {withStyles} from "@material-ui/core/styles";
import {useCallback} from "react";
import {useHistory} from "react-router-dom";

import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import CreditCardIcon from "@material-ui/icons/CreditCard";

const AccountStatus = ({
  accounts = [],
  account: {
    slug,
    number,
    description,
    started_at,
    ended_at,
    edp_number,
    state_account_number,
    pseudo,
    objectCode,
    objectId,
    objectName,
  } = {},
  classes = {},
}) => {
  const history = useHistory();
  const updateCurrent = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const {
        target: {value: slug},
      } = e;
      history.push("/" + encodeURIComponent(slug));
    },
    [history]
  );

  const catchEvent = (e) => {
    e.stopPropagation();
  };

  return (
    <Accordion
      square
      elevation={0}
      classes={{
        root: classes.Accordion,
        expanded: classes.AccordionExpanded,
      }}
      className={classes.Accordion}
    >
      <AccordionSummary
        classes={{
          root: classes.AccordionSummary,
          expanded: classes.AccordionSummaryExpanded,
          content: classes.AccordionSummaryContent,
        }}
      >
        <CreditCardIcon />
        <Select
          value={slug || 0}
          autoWidth={true}
          style={{width: "100%", textAlign: "center"}}
          onChange={updateCurrent}
          onClick={catchEvent}
        >
          {accounts.map(({slug: id, name}) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <div className={classes.accountCell}>
          <b> Account # </b>
          <span className="muted">XXXX</span>
          &ndash;
          <span className="muted">XXXX</span>
          &ndash;
          {number}
        </div>
      </AccordionSummary>
      <AccordionDetails style={{display: "block"}}>
        <Grid
          container
          justify="space-between"
          className={classes.subContainer}
        >
          {pseudo && (
            <Grid item>
              <strong>Pseudo:</strong>
              {pseudo}
            </Grid>
          )}
          {edp_number && (
            <Grid item>
              <strong>EDP #:</strong>
              {edp_number}
            </Grid>
          )}
          {state_account_number && (
            <Grid item>
              <strong>State Acct #:</strong>
              {state_account_number}
            </Grid>
          )}
          {objectId && (
            <Grid item>
              <strong>Object: </strong>[{objectCode}
              ]&nbsp;
              {objectName}
            </Grid>
          )}
        </Grid>
        <Grid
          container
          justify="space-between"
          className={classes.subContainer}
        >
          {description && (
            <Grid item>
              <strong>Description: </strong>
              {description}
            </Grid>
          )}
          {started_at && (
            <Grid item>
              <strong>Start Date: </strong>
              {started_at}
            </Grid>
          )}
          {ended_at && (
            <Grid item>
              <strong>End Date: </strong>
              {ended_at}
            </Grid>
          )}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

AccountStatus.propTypes = {
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.string,
      path: PropTypes.string,
    })
  ),
  account: PropTypes.shape({
    name: PropTypes.string,
    number: PropTypes.string,
    started_at: PropTypes.string,
    ended_at: PropTypes.string,
    path: PropTypes.string,
    edit_path: PropTypes.string,
    delete_path: PropTypes.string,
  }),
  bank_account: PropTypes.shape({
    name: PropTypes.string,
    slug: PropTypes.string,
    number: PropTypes.string,
    started_at: PropTypes.string,
    ended_at: PropTypes.string,
    path: PropTypes.string,
    edit_path: PropTypes.string,
    delete_path: PropTypes.string,
    objectCode: PropTypes.string,
    objectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    objectName: PropTypes.string,
  }),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  accountRow: {
    fontSize: "1.15rem",
    backgroundColor: "#F5F5F5",
    padding: "0 16px",
  },
  accountCell: {
    flexGrow: 1,
    textAlign: "right",
  },
  subContainer: {
    width: "100%",
    textAlign: "right",
  },

  /* Expansion Panel */
  Accordion: {
    padding: "0",
    borderRadius: 3,

    "&:before": {
      display: "none",
    },
  },
  AccordionExpanded: {
    margin: 0,
    border: "1px solid #F5F5F5",
    borderRadius: 3,
    borderBottomColor: "#eee",
  },

  /* -- Expansion Panel */
  AccordionSummary: {
    fontSize: "1.15rem",
    backgroundColor: "#F5F5F5",
    padding: `0px ${theme.spacing(1)}px !important`,
    width: "100%",
  },
  AccordionSummaryExpanded: {
    margin: "0px !important",
    minHeight: "48px !important",
  },
  AccordionSummaryContent: {
    padding: 0,
    margin: 0,
    display: "grid",
    gridTemplateColumns: "35px minmax(min-content, max-content) 1fr",
    alignItems: "center",
  },

  /* -- Expansion Panel Details*/
  AccordionDetails: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },

  /* Select Box */
  selectRoot: {
    width: "100%",
    textAlign: "center",
    display: "flex",
    justifyContent: "stretch",
    paddingLeft: ".5em",
  },
  selectMenu: {
    width: "100%",
  },
});

export default withStyles(styles)(AccountStatus);
