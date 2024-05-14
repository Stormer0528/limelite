import PropTypes from "prop-types";

import ReceiptIcon from "@material-ui/icons/Receipt";
import {withStyles} from "@material-ui/core/styles";

const EntryHeader = ({
  itemPath,
  itemType = "Item",
  entry: {
    journalablePath,
    journalableType,
    payableName,
    payableType,
    payablePath,
    path,
  } = {},
  classes = {},
}) => {
  return (
    <header className={classes.header}>
      <ReceiptIcon />
      &nbsp;&nbsp;Entry
      <div className={classes.linksContainer}>
        {payablePath && (
          <a
            href={payablePath}
            className={classes.entryLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            [
            <b>
              {payableType}
              :&nbsp;
            </b>
            <span className={classes.payableText}>{payableName}</span>]
          </a>
        )}
        {path && (
          <a
            href={path}
            className={classes.entryLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            [ <b>View Entry</b> ]
          </a>
        )}
        {journalablePath && (
          <a
            href={journalablePath}
            className={classes.entryLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            [{" "}
            <b>
              View &nbsp;
              {journalableType}
            </b>{" "}
            ]
          </a>
        )}
        {itemPath && (
          <a
            href={itemPath}
            className={classes.entryLink}
            rel="noopener noreferrer"
            target="_blank"
          >
            [{" "}
            <b>
              View &nbsp;
              {itemType}
            </b>{" "}
            ]
          </a>
        )}
      </div>
    </header>
  );
};

EntryHeader.propTypes = {
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

export default withStyles(styles)(EntryHeader);
