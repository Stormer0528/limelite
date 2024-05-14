import {Fragment} from "react";
import PropTypes from "prop-types";
import Link from "@material-ui/core/Link";
import {titleCase} from "humanize-plus";
import {withStyles} from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import MonetizationOnIcon from "@shared/icons/credit_card_icon";
// import {useParams, useRouteMatch} from "react-router-dom";

const Breadcrumb = ({classes = {}}) => {
  const path = formatUrl(window.location.pathname.split("/").slice(1));

  return (
    <Fragment>
      <div className={`alt-breadcrumb ${classes.root}`}>
        <h2 className={`page-header ${classes.header}`}>
          <MonetizationOnIcon className={classes.icon} />
          <Breadcrumbs
            separator="&rsaquo;"
            arial-label="Breadcrumb"
            className={`${classes.breadcrumb}`}
            classes={{
              separator: classes.separator,
            }}
          >
            {path.map(({name, path: url}) => {
              return (
                <Link
                  key={`${name}-${path}`}
                  href={url}
                  className={`breadcrumb ${classes.link}`}
                >
                  {name}
                </Link>
              );
            })}
          </Breadcrumbs>
        </h2>
      </div>
    </Fragment>
  );
};

Breadcrumb.propTypes = {
  path: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      path: PropTypes.string,
    })
  ),
  request: PropTypes.object,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {},
  header: {
    position: "fixed",
    top: "62px",
    zIndex: "999",
    width: "100%",
    display: "flex",
    textAlign: "center",
    alignItems: "baseline",
    justifyContent: "space-around",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fcfcfc",
  },
  breadcrumb: {
    borderBottom: "none",
    marginBottom: ".75em",
    height: "32px",
    lineHeight: "32px",
    display: "inline-flex",
    width: "auto",

    "& > ol": {
      justifyContent: "center",
      alignItems: "baseline",

      " & > li": {
        fontSize: "25px",
        fontWeight: "200",
        color: "#b0bec5",
      },
    },
  },
  link: {
    display: "flex",
    color: "#000000de",

    "&:hover": {
      textDecoration: "none",
    },
  },
  icon: {
    position: "relative",
    top: ".25em",
    color: "#d7ccc8",
    marginRight: ".5rem",
  },
  separator: {
    margin: "3px 10px 0 8px",
    fontSize: "25px",
    fontWeight: "400",
  },
});

export default withStyles(styles)(Breadcrumb);

// Helper Functions
//------------------------------------------------------------------------------

const formatUrl = (path = [] /*, {requestpath, mountpath}*/) => {
  return path.map((str, i) => {
    switch (str) {
      // case `${requestpath}${mountpath}`:
      //   return {
      //     name: titleize(requestpath),
      //     path: requestpath,
      //   };
      default:
        return {
          name: titleize(str),
          path: !i ? '/vendors' : "/" + path.slice(0, i + 1).join("/"),
        };
    }
  });
};

const titleize = (str = "") => titleCase(str.replace(/[-_]/g, " "));
