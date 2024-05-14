import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import {withStyles} from "@material-ui/core/styles";
import currency from "currency.js";
import groupBy from "lodash/groupBy";

import BalancePopover from "./balance_popover";

const EntryItemsTotals = ({
  readOnly = false,
  classes = {},
  style = {},
  entryItems = [],
}) => {
  const groups = {};
  let groupedItems = groupBy(
    entryItems,
    ({fundCode, resourceCode}) => `${fundCode}-${resourceCode}`
  );

  Object.entries(groupedItems).forEach(([name, items]) => {
    groups[name] = {
      credits: calculateCreditsBalance(items).format(true),
      debits: calculateDebitsBalance(items).format(true),
      balance: calculateBalance(items).format(true),
    };
  });

  const totalCredits = calculateCreditsBalance(entryItems).format(true);
  const totalDebits = calculateDebitsBalance(entryItems).format(true);
  const balance = calculateBalance(entryItems).format(true);

  groupedItems = groups;

  return (
    <div className="totals" {...{style}}>
      <Grid
        container
        spacing={2}
        alignItems="flex-end"
        justifyContent="flex-end"
      >
        <Grid item xs={5} sm={3} md={2} xl={1} className={classes.debitCell}>
          <b>{totalDebits}</b>
        </Grid>
        <Grid item xs={5} sm={3} md={2} xl={1} className={classes.creditCell}>
          <b>{totalCredits}</b>
        </Grid>
        {!readOnly && <Grid style={{width: "64px"}} />}
      </Grid>
      <Grid
        container
        spacing={2}
        alignItems="flex-end"
        justifyContent="flex-end"
      >
        <Grid item xs={10} sm={6} md={4} xl={2} className={classes.totalCell}>
          <b className={classes.totalLabel}>
            <BalancePopover
              groupedItems={groupedItems}
              total={{
                balance,
                totalCredits,
                totalDebits,
              }}
            />
            Balance:
          </b>{" "}
          <span>{balance}</span>
        </Grid>
        {!readOnly && <Grid style={{width: "64px"}} />}
      </Grid>
    </div>
  );
};

// PropTypes
EntryItemsTotals.propTypes = {
  amountType: PropTypes.string,
  totals: PropTypes.object,
  balance: PropTypes.string,
  totalDebits: PropTypes.string,
  totalCredits: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  entryItems: PropTypes.array,
  style: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  debitCell: {
    color: "#b71f1e",
    display: "flex",
    justifyContent: "flex-end",
  },
  creditCell: {
    color: "#388e3c",
    display: "flex",
    justifyContent: "flex-end",
  },
  debitsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(9, 1fr) repeat(2, 48px) 48px",
    gridTemplateAreas: `
    "acc acc acc acc acc acc acc acc dbt dbt dbt del"
    `,
    color: "#b71f1e",
    fontWeight: "900",
  },
  debitTitleCell: {
    gridArea: "acc",
    textAlign: "right",
    padding: "4px 8px",
  },
  debitTotal: {
    gridArea: "dbt",
    fontWeight: "normal",
    textAlign: "right",
    padding: "4px 8px",
  },
  creditsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(9, 1fr) repeat(2, 48px) 48px",
    gridTemplateAreas: `
    "acc acc acc acc acc acc acc acc crd crd crd del"
    `,
    color: "#388e3c",
    fontWeight: "900",
  },
  creditTitleCell: {
    gridArea: "acc",
    textAlign: "right",
    padding: "4px 8px",
  },
  creditTotal: {
    gridArea: "crd",
    fontWeight: "normal",
    textAlign: "right",
    padding: "4px 8px",
  },
  totalCell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderTop: "1px solid #BDBDBD",
    marginTop: "0.5em",
    marginBottom: "8px",
  },
  totalLabel: {
    alignSelf: "flex-start",
    display: "flex",
    justifyContent: "center",
  },
});

export default withStyles(styles)(EntryItemsTotals);

// HELPER FUNCTIONS
//------------------------------------------------------------------------------

export const calculateCreditsBalance = (items = []) => {
  return items.reduce((accum, {credit} = {}) => accum.add(credit), currency(0));
};

export const calculateDebitsBalance = (items = []) => {
  return items.reduce((accum, {debit} = {}) => accum.add(debit), currency(0));
};

export const calculateBalance = (items = []) => {
  return currency(calculateCreditsBalance(items)).subtract(
    calculateDebitsBalance(items)
  );
};
