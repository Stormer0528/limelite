import View from "./view";
import PropTypes from "prop-types";
import {useCurrentRoute} from "react-navi";
import {Formik} from "formik";
import {withStyles} from "@material-ui/core/styles";
import validationSchema from "./print_checks.schema";

const PrintChecksContainer = ({classes = {}}) => {
  const {
    data: {fiscalYear = new Date().getFullYear()},
  } = useCurrentRoute();

  return (
    <section className={classes.root}>
      <Formik
        enableReinitialize
        component={View}
        validationSchema={validationSchema}
        isInitialValid={false}
        initialValues={{
          startDate: `${fiscalYear}-07-01`,
          endDate: `${fiscalYear + 1}-06-30`,
          reportPeriod: "This Year",
          checkedItems: {},
          confirmedItems: {},
        }}
      />
    </section>
  );
};

PrintChecksContainer.propTypes = {
  classes: PropTypes.object,
};

const styles = (theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flexGrow: "1",
    marginBottom: "55px",
  },
});

export default withStyles(styles)(PrintChecksContainer);
