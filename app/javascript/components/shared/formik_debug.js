import {useState, useCallback} from "react";
import PropTypes from "prop-types";
import {compose} from "redux";
import {connect} from "formik";
import clsx from "clsx";
import {withStyles} from "@material-ui/core/styles";
import isObject from "lodash/isObject";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import CopyIcon from "@material-ui/icons/FileCopy";

import JSONPrettify from "react-json-prettify";

const FormikDebug = ({defaultClosed = true, formik, classes = {}, ...rest}) => {
  const [open, setOpen] = useState(!defaultClosed);
  const handleOpenClick = useCallback(
    (e) => {
      e.preventDefault();
      if (e.target.tagName === "H5") {
        setOpen(!open);
      }
    },
    [open]
  );

  const handleCopy = (label, data) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(data).then(() => {
      console.log("Copied!", label, data);
    });
  };

  return (
    <section
      id="root"
      className={clsx(classes.root, {[classes.closed]: !open})}
      {...rest}
      onClick={handleOpenClick}
    >
      <h5 className={classes.title}>Formik State</h5>
      {open && (
        <div>
          {Object.entries(formik)
            .filter((item) => typeof item === "object")
            .map(([key, values]) => {
              if (!isObject(values)) {
                return null;
              }

              try {
                return (
                  <Accordion
                    key={key}
                    classes={{
                      root: classes.PanelRoot,
                      expanded: classes.expanded,
                    }}
                    defaultExpanded={key === "values"}
                  >
                    <AccordionSummary
                      classes={{
                        root: classes.SummaryRoot,
                        content: classes.SummaryContent,
                      }}
                      expandIcon={<ExpandMoreIcon />}
                    >
                      <Typography className={classes.heading}>{key}</Typography>
                      <IconButton
                        size="small"
                        className={classes.copyBtn}
                        onClick={handleCopy(key, JSON.stringify(values))}
                      >
                        <CopyIcon />
                      </IconButton>
                    </AccordionSummary>
                    <AccordionDetails className={classes.section}>
                      <JSONPrettify
                        json={JSON.parse(JSON.stringify(values || {}))}
                      />
                    </AccordionDetails>
                  </Accordion>
                );
              } catch {
                return null;
              }
            })}
        </div>
      )}
    </section>
  );
};

FormikDebug.propTypes = {
  defaultClosed: PropTypes.bool,
  formik: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = () => ({
  root: {
    border: "2px solid #B71C1C",
    borderRadius: "3px",
    background: "#F5F5F5",
  },
  copyBtn: {
    float: "right",
  },
  closed: {
    border: "none !important",
    opacity: "0.125",
    background: "#880E4F",
    color: "#F8BBD0",
  },
  section: {
    overflowX: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
    alignItems: "stretch",
    margin: 0,
    padding: 0,

    "& > pre": {
      alignSelf: "stretch",
      height: "max-content",
      padding: "1em",
      margin: 0,
    },
  },
  data: {
    display: "grid",
    justifyContent: "stretch",
    alignItems: "stretch",
    gridTemplateColumns: "1fr 1fr",
  },
  heading: {
    fontWeight: "900",
    fontSize: "18px",
  },
  title: {
    padding: "0 1em",
    margin: ".25em 0 .75rem",

    "&:hover": {
      cursor: "pointer",
    },
  },
  subtitle: {},
  expanded: {
    padding: 0,
  },
  PanelRoot: {
    padding: "0 12px",
  },
  SummaryRoot: {
    minHeight: "1.5rem !important",
    padding: "0 6px",
  },
  SummaryContent: {
    margin: "6px 0 !important",
    display: "flex",
    justifyContent: "space-between",
  },
});

export default compose(connect, withStyles(styles))(FormikDebug);
