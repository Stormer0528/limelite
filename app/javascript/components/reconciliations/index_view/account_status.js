import PropTypes from "prop-types";
import {useFormikContext} from "formik";
import {withStyles} from "@material-ui/core/styles";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";

// Material UI
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";

// Icons
import BankAccountIcon from "../../shared/icons/bank_account_icon";
import CreditCardIcon from "../../shared/icons/credit_card_icon";

const ACCOUNTS_QUERY = gql`
  query {
    bankAccounts {
      name
      id
      slug
    }

    creditCards {
      name
      id
      slug
    }
  }
`;

const AccountStatus = ({classes = {}}) => {
  const {data: {bankAccounts = [], creditCards = []} = {}} = useQuery(
    ACCOUNTS_QUERY,
    {
      fetchPolicy: "network-only",
    }
  );

  const accounts = [...bankAccounts, ...creditCards];

  const catchEvent = (e) => {
    e.stopPropagation();
  };

  const {setValues, values = {}} = useFormikContext();

  return (
    <Toolbar className={classes.ExpansionPanelSummary}>
      <Grid container wrap="nowrap" justify="flex-start" alignItems="center">
        <Grid item>
          <h4 className={classes.header}>Select Account:</h4>
        </Grid>
        <Grid item sm={5}>
          <Select
            displayEmpty
            value={`${values.statementableId}-${values.statementableType}`}
            classes={{
              root: classes.selectRoot,
              selectMenu: classes.selectMenu,
            }}
            onChange={({
              currentTarget: {
                dataset: {id: statementableId, type: statementableType} = {},
              } = {},
            }) => {
              setValues({
                statementableType,
                statementableId,
              });
            }}
            onClick={catchEvent}
            SelectDisplayProps={{
              style: {marginRight: "2rem", minWidth: "15rem"},
              className: classes.menuItem,
            }}
          >
            <MenuItem className={classes.menuItem} value="-">
              All Accounts
            </MenuItem>

            {accounts.map(({id, slug, name, __typename}) => (
              <MenuItem
                data-type={__typename}
                data-id={id}
                className={classes.menuItem}
                key={`${id}-${slug}`}
                value={`${id}-${__typename}`}
              >
                {__typename === "CreditCard" && <CreditCardIcon />}
                {__typename === "BankAccount" && <BankAccountIcon />}
                {name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Grid>
    </Toolbar>
  );
};

AccountStatus.propTypes = {
  currentAccount: PropTypes.string,
  handleChange: PropTypes.func,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      number: PropTypes.string,
    })
  ),
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  header: {
    fontSize: "1.25rem",
    margin: "0",
    marginRight: "1rem",
  },
  selectRoot: {
    width: "100%",
    textAlign: "center",
    display: "flex",
    justifyContent: "stretch",
    paddingLeft: ".5em",
    cursor: "pointer",
  },
  selectMenu: {
    width: "100%",
  },
  ExpansionPanelSummary: {
    fontSize: "1.15rem",
    backgroundColor: "#F5F5F5",
    padding: "0 16px",
    width: "100%",
    cursor: "default",
    minHeight: "48px",
  },
  menuItem: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",

    "& svg": {
      marginRight: ".5rem",
    },
  },
});

export default withStyles(styles)(AccountStatus);
