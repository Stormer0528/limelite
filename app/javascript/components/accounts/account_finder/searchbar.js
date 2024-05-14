// Account Finder Searchbar
// import {useEffect} from "react";
// Material UI
import TextField from "@material-ui/core/TextField";
import {withStyles} from "@material-ui/core/styles";
import {useFormikContext} from "formik";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

const Searchbar = ({classes = {}}) => {
  const formatFunc = (num) => `${num}`;
  const {values, handleChange, handleBlur} = useFormikContext();

  const el = document.getElementById("accounts_index");

  return (
    <section className={classes.root}>
      <TextField
        id="account-name"
        label="Name"
        name="name"
        value={values.name}
        fullWidth
        inputProps={{
          className: "browser-default",
        }}
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.outlinedInput}
        margin="none"
        size="small"
        variant="outlined"
      />
      <NumberFormat
        size="small"
        variant="outlined"
        customInput={TextField}
        format={formatFunc}
        value={values.fundCode}
        fullWidth
        margin="none"
        min="0"
        name="fundCode"
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.outlinedInput}
        label="Fund"
        style={{marginBottom: "none"}}
        type="tel"
        inputProps={{
          maxLength: 4,
          className: "browser-default",
        }}
      />
      <NumberFormat
        size="small"
        variant="outlined"
        customInput={TextField}
        format={formatFunc}
        value={values.resourceCode}
        fullWidth
        margin="none"
        min="0"
        name="resourceCode"
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.outlinedInput}
        label="Resource"
        style={{marginBottom: "none"}}
        type="tel"
        inputProps={{
          maxLength: 4,
          className: "browser-default",
        }}
      />
      <NumberFormat
        size="small"
        variant="outlined"
        customInput={TextField}
        format={formatFunc}
        value={values.yearCode}
        fullWidth
        margin="none"
        min="0"
        name="yearCode"
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.outlinedInput}
        label="Year"
        style={{marginBottom: "none"}}
        type="tel"
        inputProps={{
          maxLength: 1,
          className: "browser-default",
        }}
      />
      <NumberFormat
        size="small"
        variant="outlined"
        customInput={TextField}
        format={formatFunc}
        value={values.goalCode}
        fullWidth
        margin="none"
        min="0"
        name="goalCode"
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.outlinedInput}
        label="Goal"
        style={{marginBottom: "none"}}
        type="tel"
        inputProps={{
          maxLength: 4,
          className: "browser-default",
        }}
      />
      <NumberFormat
        size="small"
        variant="outlined"
        customInput={TextField}
        format={formatFunc}
        value={values.functionCode}
        fullWidth
        margin="none"
        min="0"
        name="functionCode"
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.outlinedInput}
        label="Function"
        style={{marginBottom: "none"}}
        type="tel"
        inputProps={{
          maxLength: 4,
          className: "browser-default",
        }}
      />
      <NumberFormat
        size="small"
        variant="outlined"
        customInput={TextField}
        format={formatFunc}
        value={values.objectCode}
        fullWidth
        margin="none"
        min="0"
        name="objectCode"
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.outlinedInput}
        label="Object"
        style={{marginBottom: "none"}}
        type="tel"
        inputProps={{
          maxLength: 4,
          className: "browser-default",
        }}
      />
      <NumberFormat
        size="small"
        variant="outlined"
        customInput={TextField}
        format={formatFunc}
        value={values.locationCode}
        fullWidth
        margin="none"
        min="0"
        name="locationCode"
        onChange={handleChange}
        onBlur={handleBlur}
        className={classes.outlinedInput}
        label={"School"}
        style={{marginBottom: "none"}}
        type="tel"
        inputProps={{
          maxLength: 3,
          className: "browser-default",
        }}
      />
    </section>
  );
};

Searchbar.propTypes = {
  handleChange: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

const styles = (theme) => ({
  root: {
    display: "grid",
    gridTemplateColumns: "10fr repeat(2, 3fr) 2fr repeat(3, 3fr) 3fr",
    gridColumnGap: ".5rem",
    padding: ".65rem .5rem",
    background: "#ECEFF1",
    borderTop: "1px solid #CFD8DC",
  },
  outlinedInput: {
    ".react-inputs & input": {
      padding: "10.5px 14px",
      font: "inherit",
      color: "currentColor",
      width: "100%",
      border: "0",
      height: "1.1875em",
      margin: "0",
      display: "block",
      minWidth: "0",
      background: "#fafafa",
      boxSizing: "content-box",
      animationName: "MuiInputBase-keyframes-auto-fill-cancel",
    },
  },
});

export default withStyles(styles)(Searchbar);
