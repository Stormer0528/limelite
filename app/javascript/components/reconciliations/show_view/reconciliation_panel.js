import {useState, useCallback} from "react";
import PropTypes from "prop-types";
import ReconciliationTable from "../../bank_account/statements/show_view/reconciliation_table";
import {isNil, isEmpty, sortBy} from "lodash";

// Material UI
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";

const ReconciliationPanel = ({
  title = "",
  Icon,
  items = {},
  selectedItemsCount = 0,
  itemTotal = 0,
  selectedItems = {},
  classes = {},
  editable,
}) => {
  const itemCount = items.length;
  const [sort, setSort] = useState({column: "date", direction: "desc"});

  const createSortHandler = useCallback((column) => () => {
    setSort({
      column,
      direction:
        column === sort.column && sort.direction === "asc" ? "desc" : "asc",
    });
  });

  return (
    <Accordion defaultExpanded className={classes.panel}>
      <AccordionSummary
        style={{
          fontSize: "1.15rem",
          padding: "0 16px",
          width: "100%",
          borderBottom: "1px solid #E0E0E0",
        }}
        classes={{
          expanded: classes.headerExpanded,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "100%",
            width: "calc(100% - 1em)",
          }}
        >
          <Typography className={classes.heading}>
            {<Icon />}
            &nbsp;&nbsp;
            {title}
          </Typography>
          <Typography className={classes.secondaryHeading}>
            {selectedItemsCount}
            &nbsp;/&nbsp;
            {itemCount} cleared
          </Typography>
          <Typography className={classes.secondaryHeading}>
            <b>Total:</b>
            &nbsp; {itemTotal}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails className={classes.panelDetails}>
        <ReconciliationTable
          {...{
            sort,
            items: sortItems(sort, items),
            editable,
            selectedItems,
            createSortHandler,
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

ReconciliationPanel.propTypes = {
  sort: PropTypes.shape({
    column: PropTypes.string,
    direction: PropTypes.string,
  }),
  title: PropTypes.string,
  Icon: PropTypes.object,
  items: PropTypes.array,
  selectedItems: PropTypes.object,
  itemCount: PropTypes.number,
  itemTotal: PropTypes.string,
  selectedItemsCount: PropTypes.number,
  expanded: PropTypes.bool,
  editable: PropTypes.bool,
  classes: PropTypes.object,
};

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  panel: {
    width: "100%",
  },
  panelDetails: {
    width: "100%",
    padding: "0",

    ["& .ReconciliationTable"]: {
      marginBottom: 0,
      width: "100%",

      ["& .well"]: {
        marginBottom: 0,
      },
    },
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  expandIcon: {
    position: "relative",
    top: "25px",
  },
  headerExpanded: {
    backgroundColor: "transparent",
  },
});

export default withStyles(styles)(ReconciliationPanel);

// HELPERS
//---------------------------------------------------------
const sortItems = ({direction, column}, items = []) => {
  if (isEmpty(column) || isNil(column)) {
    return items;
  }

  let newItems = [];
  // Special Search options
  // Note: must set newItems
  switch (column) {
    case "amount":
      newItems = sortBy(items, ({amount}) =>
        Number(amount.replace(/[,$]/gi, ""))
      );
      break;
    case "name":
      newItems = sortBy(items, ({payee, vendor}) =>
        isEmpty(payee) ? vendor : payee
      );
      break;
    case "date":
      newItems = sortBy(items, ({date}) => new Date(date).toISOString());
      break;
    case "check#":
      newItems = sortBy(items, ({number = ""}) =>
        Number((number || "").replace(/[,$a-zA-z]/gi, ""))
      );
      break;
    default:
      newItems = sortBy(items, column);
  }

  return direction === "asc" ? newItems : newItems.reverse();
};
