import PropTypes from "prop-types";
import {compose} from "redux";
import {connect} from "react-redux";
import {withStyles} from "@material-ui/core/styles";

import JSONPrettify from "react-json-prettify";

const FormikDebug = ({state, props, stateKey = "entry", classes}) => {
  return (
    <section className={classes.root}>
      <h5 className={classes.title}>Redux State</h5>
      <div className={classes.section}>
        <h6 className={classes.subtitle}>State</h6>
        <JSONPrettify json={JSON.parse(JSON.stringify(props[stateKey]))} />
      </div>
    </section>
  );
};

FormikDebug.propTypes = {
  stateKey: PropTypes.string,
  state: PropTypes.object.isRequired,
  props: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

const styles = theme => ({
  root: {
    border: "2px solid darkred",
    borderRadius: "5px",
    margin: "2em .5rem .5rem",
    padding: "0 .5rem .25rem",
    maxHeight: "50vh",
    overflow: "auto",
  },
  section: {
    overflowX: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "stretch",
    alignItems: "stretch",
    margin: "0 1rem",

    "& > pre": {
      alignSelf: "stretch",
      height: "max-content",
      padding: "1em",
    },
  },
  data: {
    display: "grid",
    justifyContent: "stretch",
    alignItems: "stretch",
    gridTemplateColumns: "1fr 1fr",
  },
  title: {},
  subtitle: {},
});

export default compose(
  withStyles(styles),
  connect((props, state) => ({
    props,
    state,
  }))
)(FormikDebug);
