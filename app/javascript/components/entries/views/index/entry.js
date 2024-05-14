import PropTypes from "prop-types";
import EntryItem from "./entry_item";

import Grid from "@material-ui/core/Grid";
import EntryHeader from "./entry_header";
import EntryItemsTotals from "../../../entries/form/entry_items_totals";

import {format} from "date-fns/esm";
import {withStyles} from "@material-ui/core/styles";

const Entry = ({
  itemPath,
  itemType,
  entry = {},
  entry: {
    entryType: type = "",
    date = new Date(),
    totalCredits,
    totalDebits,
    entryItems: items = [],
  } = {},
  classes = {},
}) => {
  return (
    <section className={classes.root}>
      <EntryHeader {...{itemPath, itemType, entry}} />
      <Grid
        container
        spacing={2}
        alignItems="center"
        alignContent="center"
        className={classes.entry}
      >
        <Grid item>
          <b>Date:&nbsp;</b>
          {format(date, "MM/dd/yyyy")}
        </Grid>
        <Grid item>
          <b>Type:&nbsp;</b>
          {type}
        </Grid>
      </Grid>
      <div className={classes.entryItems}>
        <h5 className={classes.titleHeader}>Debits and Credits</h5>
        {items.map((item) => (
          <EntryItem {...item} key={item.id} />
        ))}
      </div>
      <EntryItemsTotals
        {...{
          entryItems: items,
          totalCredits,
          totalDebits,
          style: {
            position: "relative",
            left: "54px",
          },
        }}
      />
    </section>
  );
};

Entry.propTypes = {
  itemType: PropTypes.string,
  itemPath: PropTypes.string,
  entry: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    padding: ".5em 1em",
  },
  header: {
    background: "#90A4AE",
    display: "flex",
    placeContent: "center",
    justifyContent: "flex-start",
    padding: ".5rem 1rem",
    margin: "-.5em -1em 1em",
    color: "#FAFAFA",
    fontSize: "1.25em",
  },
  entry: {
    flexWrap: "nowrap",
    marginBottom: theme.spacing(1),
    fontSize: "1.125rem",
  },
  entryItems: {
    borderBottom: "1px solid #ccc",
    marginBottom: ".5em",
  },
  titleHeader: {
    borderBottom: "1px solid #ECEFF1",
    fontSize: "1.2rem",
    paddingBottom: "0.5em",
    marginBottom: 0,
  },
  selectControl: {
    position: "relative",
    top: "-1px",
  },
  entryLink: {
    textAlign: "right",
    color: "#B0BEC5",
    fontSize: "14px",
    marginTop: "0.35rem",
    marginRight: "1.125rem",

    ["& b"]: {
      color: "white",
    },
  },
  linksContainer: {
    flexGrow: 1,
    display: "flex",
    textAlign: "right",
    justifyContent: "flex-end",
  },
  payableText: {
    color: "#CFD8DC",
  },
});

export default withStyles(styles)(Entry);
