import PropTypes from "prop-types";
import ReconciliationTable from "./reconciliation_table";

// Material UI
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";

const ReconciliationPanel = ({
  title = "",
  Icon,
  sort = {},
  items = {},
  itemCount = 0,
  selectedItemsCount = 0,
  itemTotal = 0,
  expanded = true,
  selectedItems = {},
  classes = {},
  editable,
  readOnly,
  /* Callbacks */
  toggleExpanded = function () {},
  createSortHandler = function () {},
  createToggleItemHandler = function () {},
}) => {
  return (
    <Accordion
      expanded={expanded}
      onChange={toggleExpanded}
      className={classes.panel}
    >
      <AccordionSummary
        onChange={toggleExpanded}
        style={accordionSummaryStyles}
        classes={{
          expandIcon: classes.expandIcon,
          expanded: classes.headerExpanded,
        }}
      >
        <div style={accordionSummaryDivStyles}>
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
            items,
            editable,
            readOnly,
            selectedItems,
            createSortHandler,
            createToggleItemHandler,
          }}
        />
      </AccordionDetails>
    </Accordion>
  );
};

const accordionSummaryStyles = {
  fontSize: "1.15rem",
  padding: "0 16px",
  width: "100%",
  borderBottom: "1px solid #E0E0E0",
};

const accordionSummaryDivStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "100%",
  width: "calc(100% - 1em)",
};

ReconciliationPanel.propTypes = {
  sort: PropTypes.shape({
    column: PropTypes.string,
    direction: PropTypes.string,
  }),
  title: PropTypes.string,
  Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  items: PropTypes.array,
  selectedItems: PropTypes.object,
  itemCount: PropTypes.number,
  itemTotal: PropTypes.string,
  selectedItemsCount: PropTypes.number,
  expanded: PropTypes.bool,
  editable: PropTypes.bool,
  classes: PropTypes.object,
  /* Callbacks */
  toggleExpanded: PropTypes.func.isRequired,
  createSortHandler: PropTypes.func.isRequired,
  createToggleItemHandler: PropTypes.func.isRequired,
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
  headerExpanded: {
    backgroundColor: "transparent",
  },
});

export default withStyles(styles)(ReconciliationPanel);
