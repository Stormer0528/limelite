// Account Finder
import PropTypes from "prop-types";
import {useState} from "react";
import {createUpdateQuery} from "../../../utils";
import {useQuery} from "@apollo/react-hooks";

import ACCOUNT_QUERY from "../../../graphql/queries/account_search_connection.gql";

import {withStyles} from "@material-ui/core/styles";
import {compose} from "redux";

import {withFormik, useFormikContext} from "formik";

import Searchbar from "./searchbar";
import AccountsTable from "./table";
import EmptyMessage from "./empty_message";

// Material UI
import LinearProgress from "@material-ui/core/LinearProgress";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

// Icons
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";

const AccountFinder = ({
  minimized = true,
  AccountsTableComponent = AccountsTable,
  QUERY = ACCOUNT_QUERY,
  HeaderBtns = null,
  SearchbarProps = {},
  setCurrentEntryItemCode = function () {},
  // onAccountCreated = function () {},
  // onAccountFinderUpdate = function () {},
  classes = {},
}) => {
  // State
  //--------------------------------------------------------------------------------------
  const [expanded, setExpanded] = useState(!minimized);

  // onClick
  //--------------------------------------------------------------------------------------
  const toggleExpanded = (e) => {
    if (!expanded) {
      e.persist();
      setTimeout(() => {
        const container = e.target.closest(".AccountFinderComponent");
        const input = container ? container.querySelector("input") : null;
        input && input.focus();
      }, 50);
    }

    setExpanded(!expanded);
  };

  const {values} = useFormikContext();
  const hasArgs =
    Object.values(values).filter((val) => val && val.replace(/\W/g, ""))
      .length > 0;

  // Query
  //--------------------------------------------------------------------------------------

  const {
    loading = false,
    fetchMore: fetchMoreRows,
    refetch,
    data: {
      accountSearchConnection: {
        nodes: accounts = [],
        pageInfo: {endCursor} = {},
      } = {},
    } = {},
  } = useQuery(QUERY, {
    variables: {...values, first: 25},
    fetchPolicy: "network-only",
  });

  const fetchMore = async () => {
    await fetchMoreRows({
      variables: {
        cursor: endCursor,
      },
      updateQuery: createUpdateQuery({
        fieldName: "accountSearchConnection",
        objectName: "nodes",
      }),
    });
  };

  const handleOnAccountCreated = (account) => {
    refetch();

    setCurrentEntryItemCode({
      account,
      onAccountFinderUpdate: () => {
        refetch();
      },
    });
  };

  // Component
  //--------------------------------------------------------------------------------------
  return (
    <Accordion
      expanded={expanded}
      onChange={toggleExpanded}
      TransitionProps={{unmountOnExit: true}}
      className="AccountFinderComponent"
      classes={{
        root: classes.root,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        classes={{
          root: classes.SummaryRoot,
          expandIcon: classes.SummaryIcon,
          content: classes.SummaryContent,
        }}
      >
        <SearchIcon />
        &nbsp;&nbsp; Find Account
        {HeaderBtns && <HeaderBtns values={values} />}
      </AccordionSummary>
      <AccordionDetails className={classes.DetailsRoot}>
        <Searchbar {...SearchbarProps} />

        {loading && <LinearProgress className={classes.progress} />}

        {accounts.length > 0 && (
          <AccountsTableComponent {...{accounts, fetchMore}} />
        )}

        {hasArgs && accounts.length === 0 && (
          <EmptyMessage {...{values, handleOnAccountCreated}} />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

AccountFinder.propTypes = {
  minimized: PropTypes.bool,
  QUERY: PropTypes.object,
  classes: PropTypes.object.isRequired,
  AccountsTableComponent: PropTypes.any,
  HeaderBtns: PropTypes.any,
  SearchbarProps: PropTypes.object,
  onAccountCreated: PropTypes.func,
  setCurrentEntryItemCode: PropTypes.func,
  onAccountFinderUpdate: PropTypes.func,
};

const styles = () => ({
  /* Accordion */
  root: {
    boxShadow: "none",
    border: "1px solid #f5f5f5",
    background: "#f5f5f5",
    margin: "16px 0 0",

    "&:before": {
      display: "none",
    },

    "&$expanded": {
      borderBottom: "1px solid #E0E0E0",
    },
  },
  progress: {
    width: "100%",
    height: "2px",
    margin: "-1px 0 0",
  },

  /* AccordionSummary */
  SummaryRoot: {
    color: "#607d8b",
    borderBottom: "1px solid #f5f5f545",
    minHeight: "1.5rem !important",
    padding: "0 12px",
  },
  SummaryContent: {
    margin: "12px 0 !important",
  },
  SummaryIcon: {
    color: "#607d8b",
  },

  /* AccordionDetails */
  DetailsRoot: {
    background: "#fcfcfc",
    padding: 0,
    display: "block",
    // height: "300px",
  },
});

export default compose(
  withFormik({
    mapPropsToValues: ({
      defaultState = {
        name: "",
      },
    }) => {
      return defaultState;
    },
  }),
  withStyles(styles)
)(AccountFinder);
