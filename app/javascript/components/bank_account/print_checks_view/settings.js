import PropTypes from "prop-types";
import {Field} from "formik";
import {withStyles} from "@material-ui/core/styles";
import {useCurrentRoute} from "react-navi";
import ReportPeriodControl from "./report_period_control";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import PrinterIcon from "@material-ui/icons/Print";
import LinkIcon from "@material-ui/icons/Link";

const Settings = ({refetch = function () {}, classes = {}}) => {
  const {
    data: {printerSettings = []},
  } = useCurrentRoute();

  return (
    <section className={classes.root}>
      <Grid
        container
        className={classes.container}
        wrap="nowrap"
        style={{margin: "1rem 0", maxHeight: "2.25rem"}}
      >
        <Grid item className={classes.chipCell}>
          <PrinterIcon style={{color: "#607D8B"}} />
        </Grid>
        <Grid
          item
          className={classes.fieldCell}
          style={{minWidth: "175px", top: "-35px"}}
        >
          <Field name="printerSettingId">
            {({field: {name, value, onChange, onBlur}}) => (
              <TextField
                id="printerSettingId"
                select
                required
                label="Select Printer Settings"
                value={value || 0}
                onBlur={onBlur}
                onChange={onChange}
                SelectProps={{
                  displayEmpty: true,
                  autoWidth: true,
                  style: {minWidth: "175px"},
                  inputProps: {name},
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                margin="normal"
              >
                {printerSettings.map(({id, name, printerType}) => (
                  <MenuItem key={id} value={id}>
                    {name}&nbsp;
                    <span style={{color: "#607D8B"}}>
                      [<b style={{color: "#455A64"}}>Type:</b>&nbsp;
                      {printerType}]
                    </span>
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Field>
        </Grid>
        <Grid item style={{flexGrow: 1, textAlign: "right"}}>
          <Button
            variant="outlined"
            size="small"
            href="/printer_settings"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkIcon className={classes.linkIcon} />
            Configure Printer Settings
          </Button>
        </Grid>
      </Grid>
      <Field>
        {({
          form: {
            handleChange,
            values: {startDate = "", endDate = "", reportPeriod},
          },
        }) => {
          return (
            <ReportPeriodControl
              {...{
                handleSubmit: refetch,
                startDate,
                endDate,
                reportPeriod,
                handleDateSelectorChange: (value) => {
                  handleChange({target: {value, name: "reportPeriod"}});
                },
                handleStartDateChange: (value) => {
                  handleChange({target: {value, name: "startDate"}});
                },
                handleEndDateChange: (value) => {
                  handleChange({target: {value, name: "endDate"}});
                },
              }}
            />
          );
        }}
      </Field>
    </section>
  );
};

Settings.propTypes = {
  refetch: PropTypes.func,
  printerSettings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  startingCheckNumber: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  classes: PropTypes.object.isRequired,
};

// Theme
//------------------------------------------------------------------------------
const styles = (theme) => ({
  root: {
    border: "1px solid #EEE",
    borderRadius: "4px",
    padding: "1rem",
    marginBottom: "1rem",
  },
  container: {
    margin: theme.spacing(1),
  },
  chipCell: {
    marginRight: theme.spacing(1),
  },
  fieldCell: {
    position: "relative",
    top: "-15px",
    marginRight: theme.spacing(1),
  },
  linkIcon: {
    marginRight: theme.spacing(1),
  },
});

export default withStyles(styles)(Settings);
