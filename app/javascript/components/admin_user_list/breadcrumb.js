import PropTypes from "prop-types";
import {titleCase} from "humanize-plus";
import {withStyles} from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import AdminIcon from "../shared/icons/admin_icon";

const Breadcrumb = ({classes = {}}) => {
  return (
    <h2 className={`page-header ${classes.header}`}>
      <AdminIcon className={classes.icon} />
      <Breadcrumbs
        separator="&rsaquo;"
        arial-label="Breadcrumb"
        className={`${classes.breadcrumb}`}
        classes={{
          separator: classes.separator,
        }}
      >
        <a href="/admin" className={`breadcrumb ${classes.link}`}>
          Admin
        </a>
        <a href="/admin" className={`breadcrumb ${classes.link}`}>
          Users
        </a>
      </Breadcrumbs>
    </h2>
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

const styles = () => ({
  header: {
    position: "fixed",
    top: "64px",
    zIndex: "999",
    width: "100%",
    display: "flex",
    textAlign: "center",
    alignItems: "baseline",
    justifyContent: "center",
    borderBottom: "1px solid #eee",
    backgroundColor: "#fcfcfc",
    fontSize: 14,
    margin: 0,
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
        fontSize: "18px",
        fontWeight: "400",
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
          path: "/" + path.slice(0, i + 1).join("/"),
        };
    }
  });
};

const titleize = (str = "") => titleCase(str.replace(/[-_]/g, " "));
